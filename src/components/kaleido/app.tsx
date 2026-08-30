import { useCallback, useEffect, useRef, useState } from "react";
import { KaleidoControls } from "@/components/kaleido/controls";
import { KaleidoStage, type KaleidoStageHandle } from "@/components/kaleido/stage";
import {
  DEFAULT_SETTINGS,
  clamp,
  loadSettings,
  randomSettings,
  saveSettings,
  type KaleidoSettings,
} from "@/lib/kaleido/types";
import { cn } from "@/lib/utils";

export function KaleidoApp() {
  const [settings, setSettings] = useState<KaleidoSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);
  const [exported, setExported] = useState(false);
  const stageRef = useRef<KaleidoStageHandle>(null);
  const burstOnce = useRef(false);

  useEffect(() => {
    setSettings(loadSettings());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveSettings(settings);
  }, [ready, settings]);

  const patch = useCallback((next: Partial<KaleidoSettings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  const onRandomize = useCallback(() => {
    burstOnce.current = true;
    setHint(false);
    setSettings(randomSettings());
  }, []);

  useEffect(() => {
    if (!burstOnce.current) return;
    burstOnce.current = false;
    stageRef.current?.clear();
    stageRef.current?.burst();
  }, [settings]);

  const onClear = useCallback(() => {
    stageRef.current?.clear();
  }, []);

  const onExport = useCallback(async () => {
    try {
      await stageRef.current?.exportPng();
      setExported(true);
      window.setTimeout(() => setExported(false), 1600);
    } catch {
      setExported(false);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (e.code === "Space" || e.key === "f" || e.key === "F") {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, frozen: !prev.frozen }));
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onRandomize();
        return;
      }
      if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        void onExport();
        return;
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        onClear();
        return;
      }
      if (e.key === "[") {
        setSettings((prev) => ({ ...prev, segments: clamp(prev.segments - 1, 3, 16) }));
        return;
      }
      if (e.key === "]") {
        setSettings((prev) => ({ ...prev, segments: clamp(prev.segments + 1, 3, 16) }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClear, onExport, onRandomize]);

  return (
    <main className="relative h-dvh w-full select-none overflow-hidden bg-bg text-fg">
      <KaleidoStage
        ref={stageRef}
        settings={settings}
        onInteract={() => setHint(false)}
      />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
        <div>
          <h1 className="font-display text-3xl leading-tight tracking-[-0.03em] text-fg sm:text-4xl">
            Kaleido
          </h1>
          <p
            className={cn(
              "mt-1 text-sm text-muted transition-opacity duration-300 ease-out",
              hint ? "opacity-100" : "opacity-0",
            )}
          >
            Move to paint
          </p>
        </div>
        {settings.frozen ? (
          <span className="rounded-md bg-surface px-3 py-1.5 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-border)]">
            Frozen
          </span>
        ) : null}
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5">
        <KaleidoControls
          settings={settings}
          exported={exported}
          onChange={patch}
          onRandomize={onRandomize}
          onClear={onClear}
          onExport={() => void onExport()}
        />
      </div>
    </main>
  );
}
