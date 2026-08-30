export const COLOR_MODES = [
  { id: "spectrum", label: "Spectrum" },
  { id: "prism", label: "Prism" },
  { id: "aurora", label: "Aurora" },
  { id: "ember", label: "Ember" },
  { id: "ice", label: "Ice" },
  { id: "pearl", label: "Pearl" },
] as const;

export type ColorMode = (typeof COLOR_MODES)[number]["id"];

export type KaleidoSettings = {
  segments: number;
  colorMode: ColorMode;
  brush: number;
  spin: boolean;
  frozen: boolean;
};

export const DEFAULT_SETTINGS: KaleidoSettings = {
  segments: 8,
  colorMode: "spectrum",
  brush: 16,
  spin: true,
  frozen: false,
};

export const STORAGE_KEY = "kaleido.settings.v1";

export function isColorMode(value: unknown): value is ColorMode {
  return COLOR_MODES.some((mode) => mode.id === value);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function loadSettings(): KaleidoSettings {
  if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<KaleidoSettings>;
    return {
      segments: clamp(Math.round(Number(parsed.segments) || 8), 3, 16),
      colorMode: isColorMode(parsed.colorMode) ? parsed.colorMode : "spectrum",
      brush: clamp(Number(parsed.brush) || 16, 6, 36),
      spin: parsed.spin !== false,
      frozen: false,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: KaleidoSettings) {
  if (typeof localStorage === "undefined") return;
  try {
    const { frozen: _frozen, ...rest } = settings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* ignore quota / private mode */
  }
}

export function randomSettings(): KaleidoSettings {
  const segmentChoices = [4, 6, 8, 10, 12, 14, 16];
  const modes = COLOR_MODES.map((mode) => mode.id);
  return {
    segments: segmentChoices[Math.floor(Math.random() * segmentChoices.length)] ?? 8,
    colorMode: modes[Math.floor(Math.random() * modes.length)] ?? "spectrum",
    brush: Math.round(10 + Math.random() * 20),
    spin: Math.random() > 0.35,
    frozen: false,
  };
}
