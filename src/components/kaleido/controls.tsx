import {
  Download,
  Eraser,
  Pause,
  Play,
  RotateCw,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { COLOR_MODES, type ColorMode, type KaleidoSettings } from "@/lib/kaleido/types";
import { cn } from "@/lib/utils";

type ControlsProps = {
  settings: KaleidoSettings;
  exported: boolean;
  onChange: (patch: Partial<KaleidoSettings>) => void;
  onRandomize: () => void;
  onClear: () => void;
  onExport: () => void;
};

export function KaleidoControls({
  settings,
  exported,
  onChange,
  onRandomize,
  onClear,
  onExport,
}: ControlsProps) {
  return (
    <div className="pointer-events-auto w-full max-w-3xl rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-center gap-3">
        <label
          htmlFor="segments"
          className="w-20 shrink-0 text-xs font-medium tracking-wide text-muted"
        >
          Segments
        </label>
        <Slider
          id="segments"
          data-testid="slider-segments"
          min={3}
          max={16}
          step={1}
          value={[settings.segments]}
          onValueChange={(value) => onChange({ segments: value[0] ?? 8 })}
          aria-label="Segment count"
        />
        <span className="w-8 text-right font-medium tabular-nums text-fg">
          {settings.segments}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label
          htmlFor="brush"
          className="w-20 shrink-0 text-xs font-medium tracking-wide text-muted"
        >
          Brush
        </label>
        <Slider
          id="brush"
          min={6}
          max={36}
          step={1}
          value={[settings.brush]}
          onValueChange={(value) => onChange({ brush: value[0] ?? 16 })}
          aria-label="Brush size"
        />
        <span className="w-8 text-right font-medium tabular-nums text-fg">
          {settings.brush}
        </span>
      </div>

      <div
        className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1"
        role="radiogroup"
        aria-label="Color mode"
      >
        {COLOR_MODES.map((mode) => {
          const active = settings.colorMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ colorMode: mode.id as ColorMode })}
              className={cn(
                "h-10 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]",
                active
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:bg-surface-2 hover:text-fg",
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Button
          type="button"
          data-testid="btn-freeze"
          variant={settings.frozen ? "active" : "secondary"}
          onClick={() => onChange({ frozen: !settings.frozen })}
          aria-pressed={settings.frozen}
        >
          {settings.frozen ? <Play /> : <Pause />}
          {settings.frozen ? "Live" : "Freeze"}
        </Button>
        <Button
          type="button"
          data-testid="btn-randomize"
          variant="secondary"
          onClick={onRandomize}
        >
          <Shuffle />
          Random
        </Button>
        <Button
          type="button"
          data-testid="btn-export"
          variant="secondary"
          onClick={onExport}
        >
          <Download />
          {exported ? "Saved" : "Export"}
        </Button>
        <Button
          type="button"
          data-testid="btn-clear"
          variant="secondary"
          onClick={onClear}
        >
          <Eraser />
          Clear
        </Button>
        <Button
          type="button"
          data-testid="btn-spin"
          variant={settings.spin ? "active" : "secondary"}
          className="col-span-2 sm:col-span-1"
          onClick={() => onChange({ spin: !settings.spin })}
          aria-pressed={settings.spin}
        >
          <RotateCw />
          Spin
        </Button>
      </div>
    </div>
  );
}
