/**
 * Time-of-day model for the /connect "field pass" — drives the sky tint and the
 * sun/moon arc from the *visitor's* local clock. Pure + deterministic so the
 * caller controls when `new Date()` is read (keeps SSR/CSR markup in sync).
 */
export type Phase = 'dawn' | 'day' | 'dusk' | 'night';

export type TimeOfDay = {
  phase: Phase;
  /** Short field-note label for the phase. */
  label: string;
  /** 0..1 horizontal progress of the celestial body across its arc. */
  sunT: number;
  /** 0..1 altitude — 0 at the horizon ends, 1 at the peak of the arc. */
  altitude: number;
  /** True between dusk and dawn (moon instead of sun). */
  isNight: boolean;
};

const DAY_START = 6 * 60; // sunrise ~06:00
const DAY_END = 20 * 60; // sunset ~20:00

const LABELS: Record<Phase, string> = {
  dawn: 'First light',
  day: 'Daylight',
  dusk: 'Golden hour',
  night: 'Night watch',
};

export function timeOfDay(now: Date): TimeOfDay {
  const min = now.getHours() * 60 + now.getMinutes();
  const isDay = min >= DAY_START && min < DAY_END;

  // Progress along the active arc (sun across the day, moon across the night).
  const sunT = isDay
    ? (min - DAY_START) / (DAY_END - DAY_START)
    : ((min - DAY_END + 1440) % 1440) / (1440 - (DAY_END - DAY_START));
  const altitude = Math.sin(sunT * Math.PI);

  const h = now.getHours();
  let phase: Phase;
  if (h >= 5 && h < 8) phase = 'dawn';
  else if (h >= 8 && h < 17) phase = 'day';
  else if (h >= 17 && h < 20) phase = 'dusk';
  else phase = 'night';

  return { phase, label: LABELS[phase], sunT, altitude, isNight: !isDay };
}

/** Stable pre-mount fallback (golden hour — the brand's signature light). */
export const FALLBACK_TOD: TimeOfDay = {
  phase: 'dusk',
  label: LABELS.dusk,
  sunT: 0.18,
  altitude: Math.sin(0.18 * Math.PI),
  isNight: false,
};
