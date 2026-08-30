import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Pause, i as Play, n as Shuffle, o as Eraser, r as RotateCw, s as Download } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPA1WbVI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg shadow-[var(--shadow-border)] hover:bg-accent/90",
			secondary: "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:bg-surface-2/80",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			active: "bg-fg text-bg shadow-[var(--shadow-border)]"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11",
			pill: "h-10 px-3.5"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Slider = import_react.forwardRef(({ className, value, defaultValue, min = 0, max = 100, ...props }, ref) => {
	const [mounted, setMounted] = import_react.useState(false);
	import_react.useEffect(() => setMounted(true), []);
	const current = (value ?? defaultValue ?? [min])[0] ?? min;
	const pct = (Number(current) - Number(min)) / Math.max(1, Number(max) - Number(min)) * 100;
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative flex h-9 w-full items-center", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-fg/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-accent",
				style: { width: `${pct}%` }
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		ref,
		className: cn("relative flex w-full touch-none select-none items-center py-2", className),
		value,
		defaultValue,
		min,
		max,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-fg/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "relative block size-5 rounded-full bg-fg shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40" })]
	});
});
Slider.displayName = Slider$1.displayName;
var COLOR_MODES = [
	{
		id: "spectrum",
		label: "Spectrum"
	},
	{
		id: "prism",
		label: "Prism"
	},
	{
		id: "aurora",
		label: "Aurora"
	},
	{
		id: "ember",
		label: "Ember"
	},
	{
		id: "ice",
		label: "Ice"
	},
	{
		id: "pearl",
		label: "Pearl"
	}
];
var DEFAULT_SETTINGS = {
	segments: 8,
	colorMode: "spectrum",
	brush: 16,
	spin: true,
	frozen: false
};
var STORAGE_KEY = "kaleido.settings.v1";
function isColorMode(value) {
	return COLOR_MODES.some((mode) => mode.id === value);
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function loadSettings() {
	if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(raw);
		return {
			segments: clamp(Math.round(Number(parsed.segments) || 8), 3, 16),
			colorMode: isColorMode(parsed.colorMode) ? parsed.colorMode : "spectrum",
			brush: clamp(Number(parsed.brush) || 16, 6, 36),
			spin: parsed.spin !== false,
			frozen: false
		};
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}
function saveSettings(settings) {
	if (typeof localStorage === "undefined") return;
	try {
		const { frozen: _frozen, ...rest } = settings;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
	} catch {}
}
function randomSettings() {
	const segmentChoices = [
		4,
		6,
		8,
		10,
		12,
		14,
		16
	];
	const modes = COLOR_MODES.map((mode) => mode.id);
	return {
		segments: segmentChoices[Math.floor(Math.random() * segmentChoices.length)] ?? 8,
		colorMode: modes[Math.floor(Math.random() * modes.length)] ?? "spectrum",
		brush: Math.round(10 + Math.random() * 20),
		spin: Math.random() > .35,
		frozen: false
	};
}
function KaleidoControls({ settings, exported, onChange, onRandomize, onClear, onExport }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto w-full max-w-3xl rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "segments",
						className: "w-20 shrink-0 text-xs font-medium tracking-wide text-muted",
						children: "Segments"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "segments",
						"data-testid": "slider-segments",
						min: 3,
						max: 16,
						step: 1,
						value: [settings.segments],
						onValueChange: (value) => onChange({ segments: value[0] ?? 8 }),
						"aria-label": "Segment count"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-8 text-right font-medium tabular-nums text-fg",
						children: settings.segments
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "brush",
						className: "w-20 shrink-0 text-xs font-medium tracking-wide text-muted",
						children: "Brush"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "brush",
						min: 6,
						max: 36,
						step: 1,
						value: [settings.brush],
						onValueChange: (value) => onChange({ brush: value[0] ?? 16 }),
						"aria-label": "Brush size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-8 text-right font-medium tabular-nums text-fg",
						children: settings.brush
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1",
				role: "radiogroup",
				"aria-label": "Color mode",
				children: COLOR_MODES.map((mode) => {
					const active = settings.colorMode === mode.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "radio",
						"aria-checked": active,
						onClick: () => onChange({ colorMode: mode.id }),
						className: cn("h-10 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
						children: mode.label
					}, mode.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						"data-testid": "btn-freeze",
						variant: settings.frozen ? "active" : "secondary",
						onClick: () => onChange({ frozen: !settings.frozen }),
						"aria-pressed": settings.frozen,
						children: [settings.frozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), settings.frozen ? "Live" : "Freeze"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						"data-testid": "btn-randomize",
						variant: "secondary",
						onClick: onRandomize,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, {}), "Random"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						"data-testid": "btn-export",
						variant: "secondary",
						onClick: onExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), exported ? "Saved" : "Export"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						"data-testid": "btn-clear",
						variant: "secondary",
						onClick: onClear,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, {}), "Clear"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						"data-testid": "btn-spin",
						variant: settings.spin ? "active" : "secondary",
						className: "col-span-2 sm:col-span-1",
						onClick: () => onChange({ spin: !settings.spin }),
						"aria-pressed": settings.spin,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, {}), "Spin"]
					})
				]
			})
		]
	});
}
var BG = "rgb(8, 8, 11)";
var TRAIL = .046;
var TAU = Math.PI * 2;
function makeGlow(h, s, l, size = 96) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) return canvas;
	const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	g.addColorStop(0, `hsla(${h}, ${s}%, ${Math.min(98, l + 28)}%, 1)`);
	g.addColorStop(.1, `hsla(${h}, ${s}%, ${l}%, 0.92)`);
	g.addColorStop(.28, `hsla(${h}, ${s}%, ${l}%, 0.42)`);
	g.addColorStop(.55, `hsla(${h}, ${s}%, ${Math.max(20, l - 8)}%, 0.12)`);
	g.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, size, size);
	return canvas;
}
function colorAt(mode, time, x, y, radius) {
	const u = Math.min(1, Math.hypot(x, y) / Math.max(1, radius));
	const ang = Math.atan2(y, x);
	switch (mode) {
		case "spectrum": return {
			h: (time * 46 + u * 150) % 360,
			s: 82,
			l: 58,
			a: .38
		};
		case "prism": return {
			h: ((ang * 180 / Math.PI + 360) % 360 + time * 10) % 360,
			s: 78,
			l: 60,
			a: .36
		};
		case "aurora": return {
			h: 150 + Math.sin(time * .65 + u * 5) * 78,
			s: 72,
			l: 56,
			a: .38
		};
		case "ember": return {
			h: 16 + Math.sin(time * 1.05 + u * 6) * 16,
			s: 90,
			l: 54,
			a: .44
		};
		case "ice": return {
			h: 196 + Math.sin(time * .7 + u * 4) * 24,
			s: 68,
			l: 64,
			a: .36
		};
		case "pearl": return {
			h: 36 + Math.sin(time * .5) * 10,
			s: 14,
			l: 86,
			a: .28
		};
	}
}
function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
var KaleidoEngine = class {
	display;
	root;
	dctx;
	ink;
	ictx;
	dpr = 1;
	width = 0;
	height = 0;
	cx = 0;
	cy = 0;
	radius = 0;
	settings;
	time = 0;
	spinAngle = 0;
	raf = 0;
	lastTs = 0;
	running = false;
	destroyed = false;
	hueGlows = [];
	pearlGlow;
	whiteGlow;
	cos = /* @__PURE__ */ new Float64Array(8);
	sin = /* @__PURE__ */ new Float64Array(8);
	pointerActive = false;
	pointerX = 0;
	pointerY = 0;
	smoothX = 0;
	smoothY = 0;
	hasSmooth = false;
	idleT = 0;
	idleR = 0;
	idleD = 0;
	idleRatio = 0;
	idleA = 0;
	lastIdleX = 0;
	lastIdleY = 0;
	hasIdle = false;
	resumeIdleAt = 0;
	reduced = false;
	observers = null;
	constructor(display, root, settings) {
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
	setSettings(next) {
		const segsChanged = next.segments !== this.settings.segments;
		this.settings = { ...next };
		if (segsChanged) this.rebuildTrig();
		if (next.frozen) this.pointerActive = false;
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
		const dt = .042 + Math.random() * .012;
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
	exportPng() {
		return new Promise((resolve, reject) => {
			this.present();
			this.display.toBlob((blob) => {
				if (!blob) {
					reject(/* @__PURE__ */ new Error("Could not export image"));
					return;
				}
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
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
	bind() {
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
	unbind() {
		this.display.removeEventListener("pointerdown", this.onPointerDown);
		this.display.removeEventListener("pointermove", this.onPointerMove);
		this.display.removeEventListener("pointerup", this.onPointerUp);
		this.display.removeEventListener("pointercancel", this.onPointerUp);
		this.display.removeEventListener("pointerleave", this.onPointerLeave);
		this.display.removeEventListener("contextmenu", this.onContextMenu);
		window.removeEventListener("keydown", this.onKeyDown);
		document.removeEventListener("visibilitychange", this.onVisibility);
	}
	onContextMenu = (e) => {
		e.preventDefault();
	};
	onVisibility = () => {
		if (document.hidden) {
			cancelAnimationFrame(this.raf);
			this.lastTs = 0;
		} else if (this.running && !this.destroyed) {
			this.lastTs = performance.now();
			this.raf = requestAnimationFrame(this.frame);
		}
	};
	onKeyDown = (e) => {
		if (e.code === "Space") e.preventDefault();
	};
	eventToLocal(e) {
		const rect = this.display.getBoundingClientRect();
		const scaleX = this.display.width / Math.max(1, rect.width);
		const scaleY = this.display.height / Math.max(1, rect.height);
		return {
			x: (e.clientX - rect.left) * scaleX - this.cx,
			y: (e.clientY - rect.top) * scaleY - this.cy
		};
	}
	onPointerDown = (e) => {
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
	onPointerMove = (e) => {
		if (this.settings.frozen) return;
		const p = this.eventToLocal(e);
		if ((e.pointerType === "touch" || e.pointerType === "pen") && e.buttons === 0 && e.pressure === 0) return;
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
	onPointerUp = (e) => {
		try {
			if (this.display.hasPointerCapture(e.pointerId)) this.display.releasePointerCapture(e.pointerId);
		} catch {}
		if (e.pointerType === "touch" || e.pointerType === "pen") {
			this.pointerActive = false;
			this.hasSmooth = false;
			this.resumeIdleAt = this.time + .6;
		}
	};
	onPointerLeave = () => {
		this.pointerActive = false;
		this.hasSmooth = false;
		this.resumeIdleAt = this.time + .8;
	};
	rebuildTrig() {
		const n = this.settings.segments;
		this.cos = new Float64Array(n);
		this.sin = new Float64Array(n);
		const slice = TAU / n;
		for (let i = 0; i < n; i++) {
			this.cos[i] = Math.cos(i * slice);
			this.sin[i] = Math.sin(i * slice);
		}
	}
	reseedIdle() {
		const R = Math.max(80, this.radius * .64);
		const r = R / (this.settings.segments * .28 + 2.4);
		this.idleR = R;
		this.idleA = R - r;
		this.idleD = r * (1.15 + Math.random() * .9);
		this.idleRatio = this.idleA / Math.max(.001, r);
		this.idleT = Math.random() * TAU;
	}
	hypotrochoid(t) {
		const a = this.idleA || this.radius * .5;
		const d = this.idleD || a * .4;
		const ratio = this.idleRatio || 3;
		return {
			x: a * Math.cos(t) + d * Math.cos(ratio * t),
			y: a * Math.sin(t) - d * Math.sin(ratio * t)
		};
	}
	layout() {
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
		if (prevW > 0 && prevH > 0) this.ictx.drawImage(prevInk, this.cx - prevCx, this.cy - prevCy);
		this.reseedIdle();
		this.present();
	}
	spriteFor(color) {
		if (this.settings.colorMode === "pearl") return this.pearlGlow;
		const idx = (Math.round(color.h / 10) % 36 + 36) % 36;
		return this.hueGlows[idx] ?? this.whiteGlow;
	}
	stampAll(x, y, sprite, size, alpha) {
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
	stampSegment(x0, y0, x1, y1) {
		const dx = x1 - x0;
		const dy = y1 - y0;
		const dist = Math.hypot(dx, dy);
		const brush = this.settings.brush * this.dpr;
		const spacing = Math.max(1.4, brush * .26);
		const steps = Math.min(28, Math.max(1, Math.ceil(dist / spacing)));
		const ctx = this.ictx;
		ctx.globalCompositeOperation = "lighter";
		for (let s = 0; s <= steps; s++) {
			const tt = s / steps;
			const x = x0 + dx * tt;
			const y = y0 + dy * tt;
			const color = colorAt(this.settings.colorMode, this.time + tt * .04, x, y, this.radius);
			const sprite = this.spriteFor(color);
			const size = brush * (.72 + .18 * Math.sin(this.time * 2.4 + tt * 6));
			this.stampAll(x, y, sprite, size, color.a);
			this.stampAll(x, y, this.whiteGlow, size * .34, color.a * .45);
		}
	}
	fade() {
		this.ictx.globalCompositeOperation = "source-over";
		this.ictx.globalAlpha = 1;
		this.ictx.fillStyle = `rgba(8, 8, 11, ${TRAIL})`;
		this.ictx.fillRect(0, 0, this.width, this.height);
	}
	present() {
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
		const vig = ctx.createRadialGradient(cx, cy, radius * .42, cx, cy, radius);
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
	frame = (now) => {
		if (this.destroyed) return;
		this.raf = requestAnimationFrame(this.frame);
		if (this.settings.frozen) {
			this.lastTs = now;
			return;
		}
		const dt = this.lastTs ? Math.min(.1, (now - this.lastTs) / 1e3) : .016;
		this.lastTs = now;
		this.time += dt;
		this.fade();
		if (this.settings.spin && !this.reduced) this.spinAngle += .07 * dt;
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
			this.idleT += dt * .42;
			const p = this.hypotrochoid(this.idleT);
			this.stampSegment(this.lastIdleX, this.lastIdleY, p.x, p.y);
			this.lastIdleX = p.x;
			this.lastIdleY = p.y;
		}
		this.present();
	};
};
var KaleidoStage = (0, import_react.forwardRef)(function KaleidoStage({ settings, onInteract }, ref) {
	const rootRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const settingsRef = (0, import_react.useRef)(settings);
	settingsRef.current = settings;
	(0, import_react.useImperativeHandle)(ref, () => ({
		clear: () => engineRef.current?.clear(),
		burst: () => engineRef.current?.burst(),
		exportPng: () => engineRef.current?.exportPng() ?? Promise.resolve()
	}));
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const root = rootRef.current;
		if (!canvas || !root) return;
		const engine = new KaleidoEngine(canvas, root, settingsRef.current);
		engineRef.current = engine;
		engine.start();
		return () => {
			engine.destroy();
			engineRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		engineRef.current?.setSettings(settings);
	}, [settings]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: rootRef,
		className: "absolute inset-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			"data-testid": "kaleido-canvas",
			className: "absolute inset-0 size-full cursor-crosshair touch-none select-none",
			"aria-label": "Kaleidoscope canvas. Move to paint.",
			onPointerDown: onInteract,
			onPointerMove: onInteract
		})
	});
});
function KaleidoApp() {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [exported, setExported] = (0, import_react.useState)(false);
	const stageRef = (0, import_react.useRef)(null);
	const burstOnce = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		setSettings(loadSettings());
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		saveSettings(settings);
	}, [ready, settings]);
	const patch = (0, import_react.useCallback)((next) => {
		setSettings((prev) => ({
			...prev,
			...next
		}));
	}, []);
	const onRandomize = (0, import_react.useCallback)(() => {
		burstOnce.current = true;
		setHint(false);
		setSettings(randomSettings());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!burstOnce.current) return;
		burstOnce.current = false;
		stageRef.current?.clear();
		stageRef.current?.burst();
	}, [settings]);
	const onClear = (0, import_react.useCallback)(() => {
		stageRef.current?.clear();
	}, []);
	const onExport = (0, import_react.useCallback)(async () => {
		try {
			await stageRef.current?.exportPng();
			setExported(true);
			window.setTimeout(() => setExported(false), 1600);
		} catch {
			setExported(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
			if (target && [
				"INPUT",
				"TEXTAREA",
				"SELECT"
			].includes(target.tagName)) return;
			if (e.code === "Space" || e.key === "f" || e.key === "F") {
				e.preventDefault();
				setSettings((prev) => ({
					...prev,
					frozen: !prev.frozen
				}));
				return;
			}
			if (e.key === "r" || e.key === "R") {
				e.preventDefault();
				onRandomize();
				return;
			}
			if (e.key === "e" || e.key === "E") {
				e.preventDefault();
				onExport();
				return;
			}
			if (e.key === "c" || e.key === "C") {
				e.preventDefault();
				onClear();
				return;
			}
			if (e.key === "[") {
				setSettings((prev) => ({
					...prev,
					segments: clamp(prev.segments - 1, 3, 16)
				}));
				return;
			}
			if (e.key === "]") setSettings((prev) => ({
				...prev,
				segments: clamp(prev.segments + 1, 3, 16)
			}));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		onClear,
		onExport,
		onRandomize
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full select-none overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoStage, {
				ref: stageRef,
				settings,
				onInteract: () => setHint(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight tracking-[-0.03em] text-fg sm:text-4xl",
					children: "Kaleido"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-1 text-sm text-muted transition-opacity duration-300 ease-out", hint ? "opacity-100" : "opacity-0"),
					children: "Move to paint"
				})] }), settings.frozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-surface px-3 py-1.5 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-border)]",
					children: "Frozen"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoControls, {
					settings,
					exported,
					onChange: patch,
					onRandomize,
					onClear,
					onExport: () => void onExport()
				})
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoApp, {});
}
//#endregion
export { Home as component };
