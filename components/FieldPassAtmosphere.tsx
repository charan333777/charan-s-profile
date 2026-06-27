'use client';

import { useEffect, useState } from 'react';
import { timeOfDay, FALLBACK_TOD, type Phase } from '@/lib/timeOfDay';

/**
 * Live "sky" behind the field pass. Reads the visitor's local clock and shifts
 * the backdrop tint plus a sun/moon arc through dawn → day → dusk → night.
 * Pure paint (gradients + soft glows), no backdrop-filter, so it stays off the
 * blur budget. SSR-safe: renders a fixed golden-hour fallback until mounted, so
 * the first client paint matches the server markup before the real time lands.
 */

// Per-phase backdrop wash (top sky → warm/cool horizon → twilight base).
const SKY: Record<Phase, string> = {
  dawn: 'linear-gradient(180deg, rgba(242,227,199,0.36) 0%, rgba(199,107,67,0.22) 40%, rgba(15,42,51,0.72) 100%)',
  day: 'linear-gradient(180deg, rgba(169,204,230,0.42) 0%, rgba(79,163,199,0.20) 46%, rgba(15,42,51,0.68) 100%)',
  dusk: 'linear-gradient(180deg, rgba(239,159,39,0.36) 0%, rgba(199,107,67,0.24) 42%, rgba(18,42,62,0.78) 100%)',
  night:
    'linear-gradient(180deg, rgba(18,42,62,0.55) 0%, rgba(15,42,51,0.74) 48%, rgba(8,18,28,0.88) 100%)',
};

// A soft, phase-tinted pool of light centered on the pass — anchors the cards
// in every phase the way a single hero glow would.
const CENTER_GLOW: Record<Phase, string> = {
  dawn: 'radial-gradient(68% 56% at 50% 42%, rgba(239,159,39,0.18), transparent 66%)',
  day: 'radial-gradient(68% 56% at 50% 42%, rgba(255,238,200,0.16), transparent 66%)',
  dusk: 'radial-gradient(68% 56% at 50% 42%, rgba(239,159,39,0.22), transparent 66%)',
  night: 'radial-gradient(68% 56% at 50% 42%, rgba(79,163,199,0.16), transparent 66%)',
};

// Celestial body look per phase: [core gradient, glow halo].
const BODY: Record<Phase, { core: string; glow: string; size: number }> = {
  dawn: {
    core: 'radial-gradient(circle at 38% 36%, #ffe7c2, #ef9f27 58%, rgba(199,107,67,0))',
    glow: '0 0 90px 30px rgba(239,159,39,0.34)',
    size: 76,
  },
  day: {
    core: 'radial-gradient(circle at 38% 36%, #fff7e6, #ffd27a 55%, rgba(239,159,39,0))',
    glow: '0 0 120px 46px rgba(255,210,122,0.40)',
    size: 84,
  },
  dusk: {
    core: 'radial-gradient(circle at 38% 36%, #ffd9a1, #ef9f27 52%, rgba(199,107,67,0))',
    glow: '0 0 110px 40px rgba(239,159,39,0.42)',
    size: 88,
  },
  night: {
    core: 'radial-gradient(circle at 40% 36%, #f3f7f4, #cdd9e6 60%, rgba(169,204,230,0))',
    glow: '0 0 70px 16px rgba(225,240,250,0.28)',
    size: 60,
  },
};

// Deterministic starfield (no Math.random — keeps SSR/CSR identical).
const STARS = [
  { x: '12%', y: '14%', s: 2, d: '0s' },
  { x: '24%', y: '8%', s: 1.5, d: '1.4s' },
  { x: '33%', y: '20%', s: 2.5, d: '0.6s' },
  { x: '46%', y: '11%', s: 1.5, d: '2.1s' },
  { x: '58%', y: '17%', s: 2, d: '0.9s' },
  { x: '67%', y: '7%', s: 1.5, d: '1.8s' },
  { x: '74%', y: '22%', s: 2.5, d: '0.3s' },
  { x: '83%', y: '12%', s: 2, d: '2.6s' },
  { x: '90%', y: '24%', s: 1.5, d: '1.1s' },
  { x: '18%', y: '30%', s: 1.5, d: '2.3s' },
  { x: '52%', y: '28%', s: 2, d: '0.5s' },
  { x: '63%', y: '33%', s: 1.5, d: '1.6s' },
];

export default function FieldPassAtmosphere() {
  // `null` until mounted → server and first client paint both use the fallback.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const tod = now ? timeOfDay(now) : FALLBACK_TOD;
  const body = BODY[tod.phase];

  // Place the body along its arc: high at the peak, low on the horizon at the
  // ends so a rising/setting sun sits below the pass rather than behind its text.
  const left = 8 + tod.sunT * 84;
  const top = 14 + (1 - tod.altitude) * 58;

  return (
    <>
      {/* Sky wash — transitions smoothly as the phase changes. */}
      <div
        className="absolute inset-0 -z-20 transition-[background] duration-1000 ease-out"
        style={{ backgroundImage: SKY[tod.phase] }}
        aria-hidden="true"
      />

      {/* Centered pool of light that keeps the pass lifted in every phase. */}
      <div
        className="absolute inset-0 -z-20 transition-[background] duration-1000 ease-out"
        style={{ backgroundImage: CENTER_GLOW[tod.phase] }}
        aria-hidden="true"
      />

      {/* Celestial body + stars. */}
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        {tod.isNight &&
          STARS.map((star, i) => (
            <span
              key={i}
              className="field-star"
              style={{
                left: star.x,
                top: star.y,
                width: star.s,
                height: star.s,
                animationDelay: star.d,
              }}
            />
          ))}
        <div
          className="absolute rounded-full transition-[left,top] duration-1000 ease-out"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: body.size,
            height: body.size,
            background: body.core,
            boxShadow: body.glow,
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Low horizon haze that warms dawn/dusk. */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 transition-opacity duration-1000"
          style={{
            opacity: tod.phase === 'dawn' || tod.phase === 'dusk' ? 0.7 : 0.25,
            background:
              'radial-gradient(120% 100% at 50% 120%, rgba(239,159,39,0.22), transparent 70%)',
          }}
        />
      </div>
    </>
  );
}
