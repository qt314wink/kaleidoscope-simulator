import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { KaleidoEngine } from "@/lib/kaleido/engine";
import type { KaleidoSettings } from "@/lib/kaleido/types";

export type KaleidoStageHandle = {
  clear: () => void;
  burst: () => void;
  exportPng: () => Promise<void>;
};

type StageProps = {
  settings: KaleidoSettings;
  onInteract: () => void;
};

export const KaleidoStage = forwardRef<KaleidoStageHandle, StageProps>(
  function KaleidoStage({ settings, onInteract }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<KaleidoEngine | null>(null);
    const settingsRef = useRef(settings);
    settingsRef.current = settings;

    useImperativeHandle(ref, () => ({
      clear: () => engineRef.current?.clear(),
      burst: () => engineRef.current?.burst(),
      exportPng: () => engineRef.current?.exportPng() ?? Promise.resolve(),
    }));

    useEffect(() => {
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

    useEffect(() => {
      engineRef.current?.setSettings(settings);
    }, [settings]);

    return (
      <div ref={rootRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          data-testid="kaleido-canvas"
          className="absolute inset-0 size-full cursor-crosshair touch-none select-none"
          aria-label="Kaleidoscope canvas. Move to paint."
          onPointerDown={onInteract}
          onPointerMove={onInteract}
        />
      </div>
    );
  },
);
