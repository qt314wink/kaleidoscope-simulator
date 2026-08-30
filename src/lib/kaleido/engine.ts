import type { ColorMode, KaleidoSettings } from "./types";

const BG = "rgb(8, 8, 11)";
const TRAIL = 0.046;
const TAU = Math.PI * 2;

type RGBA = { h: number; s: number; l: number; a: number };

function makeGlow(h: number, s: number, l: number, size = 96): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `hsla(${h}, ${s}%, ${Math.min(98, l + 28)}%, 1)`);
  g.addColorStop(0.1, `hsla(${h}, ${s}%, ${l}%, 0.92)`);
  g.addColorStop(0.28, `hsla(${h}, ${s}%, ${l}%, 0.42)`);
  g.addColorStop(0.55, `hsla(${h}, ${s}%, ${Math.max(20, l - 8)}%, 0.12)`);
  g.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function colorAt(mode: ColorMode, time: number, x: number, y: number, radius: number): RGBA {
  const u = Math.min(1, Math.hypot(x, y) / Math.max(1, radius));
  const ang = Math.atan2(y, x);
  switch (mode) {
    case "spectrum":
      return { h: (time * 46 + u * 150) % 360, s: 82, l: 58, a: 0.38 };
    case "prism":
      return { h: (((ang * 180) / Math.PI + 360) % 360 + time * 10) % 360, s: 78, l: 60, a: 0.36 };
    case "aurora":
      return { h: 150 + Math.sin(time * 0.65 + u * 5) * 78, s: 72, l: 56, a: 0.38 };
    case "ember":
      return { h: 16 + Math.sin(time * 1.05 + u * 6) * 16, s: 90, l: 54, a: 0.44 };
    case "ice":
      return { h: 196 + Math.sin(time * 0.7 + u * 4) * 24, s: 68, l: 64, a: 0.36 };
    case "pearl":
      return { h: 36 + Math.sin(time * 0.5) * 10, s: 14, l: 86, a: 0.28 };
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export class KaleidoEngine {
  private display: HTMLCanvasElement;
  private root: HTMLElement;
  private dctx: CanvasRenderingContext2D;
  private ink: HTMLCanvasElement;
  private ictx: CanvasRenderingContext2D;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private cx = 0;
  private cy = 0;
  private radius = 0;
  private settings: KaleidoSettings;
  private time = 0;
  private spinAngle = 0;
  private raf = 0;
  private lastTs = 0;
  private running = false;
  private destroyed = false;
  private hueGlows: HTMLCanvasElement[] = [];
  private pearlGlow: HTMLCanvasElement;
  private whiteGlow: HTMLCanvasElement;
  private cos = new Float64Array(8);
  private sin = new Float64Array(8);
  private pointerActive = false;
  private pointerX = 0;
  private pointerY = 0;
  private smoothX = 0;
  private smoothY = 0;
  private hasSmooth = false;
  private idleT = 0;
  private idleR = 0;
  private idleD = 0;
  private idleRatio = 0;
  private idleA = 0;
  private lastIdleX = 0;
  private lastIdleY = 0;
  private hasIdle = false;
  private resumeIdleAt = 0;
  private reduced = false;
  private observers: ResizeObserver | null = null;

  constructor(display: HTMLCanvasElement, root: HTMLElement, settings: KaleidoSettings) {
    const dctx = display.getContext("2d", { alpha: false });
    if (!dctx) throw new Error("Canvas 2D is not available");
    this.display = display;
    this.root = root;
    this.dctx = dctx;
    this.ink = document.createElement("canvas");
    const ictx = this.ink.getContext("2d", { alpha: false });
    if (!ictx) throw new Error("Canvas 2D is not available");
    this.ictx = ictx;
    this.settings = { ...settings };
    this.pearlGlow = makeGlow(38, 16, 88);
    this.whiteGlow = makeGlow(0, 0, 100);
    for (let i = 0; i < 36; i++) this.hueGlows.push(makeGlow(i * 10, 80, 58));
    this.rebuildTrig();
    this.reseedIdle();
    this.reduced = prefersReducedMotion();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.layout();
    this.bind();
    this.burst(true);
    this.lastTs = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.unbind();
    this.observers?.disconnect();
    this.observers = null;
  }

  setSettings(next: KaleidoSettings) {
    const segsChanged = next.segments !== this.settings.segments;
    this.settings = { ...next };
    if (segsChanged) this.rebuildTrig();
    if (next.frozen) {
      this.pointerActive = false;
    }
    this.present();
  }

  clear() {
    this.ictx.globalCompositeOperation = "source-over";
    this.ictx.globalAlpha = 1;
    this.ictx.fillStyle = BG;
    this.ictx.fillRect(0, 0, this.width, this.height);
    this.hasIdle = false;
    this.hasSmooth = false;
    this.pointerActive = false;
    this.resumeIdleAt = Number.POSITIVE_INFINITY;
    this.present();
  }

  burst(seed = false) {
    this.reseedIdle();
    const steps = seed ? 420 : 300;
    const t0 = Math.random() * TAU;
    const dt = 0.042 + Math.random() * 0.012;
    let prevX = 0;
    let prevY = 0;
    for (let i = 0; i < steps; i++) {
      const t = t0 + i * dt;
      const p = this.hypotrochoid(t);
      if (i > 0) this.stampSegment(prevX, prevY, p.x, p.y);
      prevX = p.x;
      prevY = p.y;
    }
    this.lastIdleX = prevX;
    this.lastIdleY = prevY;
    this.hasIdle = true;
    this.idleT = t0 + steps * dt;
    this.resumeIdleAt = this.time;
    this.present();
  }

  exportPng(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.present();
      this.display.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not export image"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        a.href = url;
        a.download = `kaleido-${stamp}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    });
  }

  private bind() {
    this.display.addEventListener("pointerdown", this.onPointerDown);
    this.display.addEventListener("pointermove", this.onPointerMove);
    this.display.addEventListener("pointerup", this.onPointerUp);
    this.display.addEventListener("pointercancel", this.onPointerUp);
    this.display.addEventListener("pointerleave", this.onPointerLeave);
    this.display.addEventListener("contextmenu", this.onContextMenu);
    window.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.observers = new ResizeObserver(() => this.layout());
    this.observers.observe(this.root);
  }

  private unbind() {
    this.display.removeEventListener("pointerdown", this.onPointerDown);
    this.display.removeEventListener("pointermove", this.onPointerMove);
    this.display.removeEventListener("pointerup", this.onPointerUp);
    this.display.removeEventListener("pointercancel", this.onPointerUp);
    this.display.removeEventListener("pointerleave", this.onPointerLeave);
    this.display.removeEventListener("contextmenu", this.onContextMenu);
    window.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  private onContextMenu = (e: Event) => {
    e.preventDefault();
  };

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      this.lastTs = 0;
    } else if (this.running && !this.destroyed) {
      this.lastTs = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") e.preventDefault();
  };

  private eventToLocal(e: PointerEvent) {
    const rect = this.display.getBoundingClientRect();
    const scaleX = this.display.width / Math.max(1, rect.width);
    const scaleY = this.display.height / Math.max(1, rect.height);
    return {
      x: (e.clientX - rect.left) * scaleX - this.cx,
      y: (e.clientY - rect.top) * scaleY - this.cy,
    };
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.settings.frozen) return;
    this.display.setPointerCapture(e.pointerId);
    const p = this.eventToLocal(e);
    this.pointerActive = true;
    this.pointerX = p.x;
    this.pointerY = p.y;
    this.smoothX = p.x;
    this.smoothY = p.y;
    this.hasSmooth = true;
    this.resumeIdleAt = 0;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.settings.frozen) return;
    const p = this.eventToLocal(e);
    const isTouch = e.pointerType === "touch" || e.pointerType === "pen";
    if (isTouch && e.buttons === 0 && e.pressure === 0) return;
    this.pointerActive = true;
    this.pointerX = p.x;
    this.pointerY = p.y;
    if (!this.hasSmooth) {
      this.smoothX = p.x;
      this.smoothY = p.y;
      this.hasSmooth = true;
    }
    this.resumeIdleAt = 0;
  };

  private onPointerUp = (e: PointerEvent) => {
    try {
      if (this.display.hasPointerCapture(e.pointerId)) {
        this.display.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* already released */
    }
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      this.pointerActive = false;
      this.hasSmooth = false;
      this.resumeIdleAt = this.time + 0.6;
    }
  };

  private onPointerLeave = () => {
    this.pointerActive = false;
    this.hasSmooth = false;
    this.resumeIdleAt = this.time + 0.8;
  };

  private rebuildTrig() {
    const n = this.settings.segments;
    this.cos = new Float64Array(n);
    this.sin = new Float64Array(n);
    const slice = TAU / n;
    for (let i = 0; i < n; i++) {
      this.cos[i] = Math.cos(i * slice);
      this.sin[i] = Math.sin(i * slice);
    }
  }

  private reseedIdle() {
    const R = Math.max(80, this.radius * 0.64);
    const segs = this.settings.segments;
    const r = R / (segs * 0.28 + 2.4);
    this.idleR = R;
    this.idleA = R - r;
    this.idleD = r * (1.15 + Math.random() * 0.9);
    this.idleRatio = this.idleA / Math.max(0.001, r);
    this.idleT = Math.random() * TAU;
  }

  private hypotrochoid(t: number) {
    const a = this.idleA || this.radius * 0.5;
    const d = this.idleD || a * 0.4;
    const ratio = this.idleRatio || 3;
    return {
      x: a * Math.cos(t) + d * Math.cos(ratio * t),
      y: a * Math.sin(t) - d * Math.sin(ratio * t),
    };
  }

  private layout() {
    const rect = this.root.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (w === this.width && h === this.height && dpr === this.dpr) return;

    const prevInk = this.ink;
    const prevW = this.width;
    const prevH = this.height;
    const prevCx = this.cx;
    const prevCy = this.cy;

    this.dpr = dpr;
    this.width = w;
    this.height = h;
    this.display.width = w;
    this.display.height = h;
    this.ink.width = w;
    this.ink.height = h;
    this.cx = w / 2;
    this.cy = h / 2;
    this.radius = Math.min(this.cx, this.cy) - 18 * dpr;

    this.ictx.globalCompositeOperation = "source-over";
    this.ictx.globalAlpha = 1;
    this.ictx.fillStyle = BG;
    this.ictx.fillRect(0, 0, w, h);

    if (prevW > 0 && prevH > 0) {
      this.ictx.drawImage(prevInk, this.cx - prevCx, this.cy - prevCy);
    }

    this.reseedIdle();
    this.present();
  }

  private spriteFor(color: RGBA) {
    if (this.settings.colorMode === "pearl") return this.pearlGlow;
    const idx = ((Math.round(color.h / 10) % 36) + 36) % 36;
    return this.hueGlows[idx] ?? this.whiteGlow;
  }

  private stampAll(x: number, y: number, sprite: HTMLCanvasElement, size: number, alpha: number) {
    const ctx = this.ictx;
    ctx.globalAlpha = alpha;
    const n = this.settings.segments;
    for (let i = 0; i < n; i++) {
      const ca = this.cos[i] ?? 1;
      const sa = this.sin[i] ?? 0;
      const rx = x * ca - y * sa;
      const ry = x * sa + y * ca;
      ctx.drawImage(sprite, this.cx + rx - size, this.cy + ry - size, size * 2, size * 2);
      const mx = x * ca + y * sa;
      const my = x * sa - y * ca;
      ctx.drawImage(sprite, this.cx + mx - size, this.cy + my - size, size * 2, size * 2);
    }
  }

  private stampSegment(x0: number, y0: number, x1: number, y1: number) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    const brush = this.settings.brush * this.dpr;
    const spacing = Math.max(1.4, brush * 0.26);
    const steps = Math.min(28, Math.max(1, Math.ceil(dist / spacing)));
    const ctx = this.ictx;
    ctx.globalCompositeOperation = "lighter";
    for (let s = 0; s <= steps; s++) {
      const tt = s / steps;
      const x = x0 + dx * tt;
      const y = y0 + dy * tt;
      const color = colorAt(this.settings.colorMode, this.time + tt * 0.04, x, y, this.radius);
      const sprite = this.spriteFor(color);
      const size = brush * (0.72 + 0.18 * Math.sin(this.time * 2.4 + tt * 6));
      this.stampAll(x, y, sprite, size, color.a);
      this.stampAll(x, y, this.whiteGlow, size * 0.34, color.a * 0.45);
    }
  }

  private fade() {
    this.ictx.globalCompositeOperation = "source-over";
    this.ictx.globalAlpha = 1;
    this.ictx.fillStyle = `rgba(8, 8, 11, ${TRAIL})`;
    this.ictx.fillRect(0, 0, this.width, this.height);
  }

  private present() {
    const ctx = this.dctx;
    const { width: w, height: h, cx, cy, radius } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(8, radius), 0, TAU);
    ctx.clip();
    ctx.translate(cx, cy);
    if (this.settings.spin) ctx.rotate(this.spinAngle);
    ctx.drawImage(this.ink, -cx, -cy);
    ctx.restore();

    const vig = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius);
    vig.addColorStop(0, "rgba(8, 8, 11, 0)");
    vig.addColorStop(1, "rgba(8, 8, 11, 0.38)");
    ctx.fillStyle = vig;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.strokeStyle = "rgba(197, 205, 216, 0.22)";
    ctx.lineWidth = Math.max(1, this.dpr);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(4, radius - 5 * this.dpr), 0, TAU);
    ctx.strokeStyle = "rgba(197, 205, 216, 0.06)";
    ctx.lineWidth = Math.max(1, 3 * this.dpr);
    ctx.stroke();
  }

  private frame = (now: number) => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.frame);
    if (this.settings.frozen) {
      this.lastTs = now;
      return;
    }
    const dt = this.lastTs ? Math.min(0.1, (now - this.lastTs) / 1000) : 0.016;
    this.lastTs = now;
    this.time += dt;

    this.fade();

    if (this.settings.spin && !this.reduced) {
      this.spinAngle += 0.07 * dt;
    }

    if (this.pointerActive && this.hasSmooth) {
      const k = 1 - Math.exp(-18 * dt);
      const nx = this.smoothX + (this.pointerX - this.smoothX) * k;
      const ny = this.smoothY + (this.pointerY - this.smoothY) * k;
      this.stampSegment(this.smoothX, this.smoothY, nx, ny);
      this.smoothX = nx;
      this.smoothY = ny;
    } else if (!this.reduced && this.time >= this.resumeIdleAt) {
      if (!this.hasIdle) {
        const p = this.hypotrochoid(this.idleT);
        this.lastIdleX = p.x;
        this.lastIdleY = p.y;
        this.hasIdle = true;
      }
      this.idleT += dt * 0.42;
      const p = this.hypotrochoid(this.idleT);
      this.stampSegment(this.lastIdleX, this.lastIdleY, p.x, p.y);
      this.lastIdleX = p.x;
      this.lastIdleY = p.y;
    }

    this.present();
  };
}
