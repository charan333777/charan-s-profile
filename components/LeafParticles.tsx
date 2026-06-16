import type { CSSProperties } from 'react';

// Fixed configs (no Math.random at render — that would desync SSR/CSR).
// CSS handles the drift + hides everything under prefers-reduced-motion.
const LEAVES: Array<CSSProperties & Record<string, string>> = [
  { left: '8%', '--size': '13px', '--dur': '15s', '--delay': '0s', '--lx': '40px' },
  { left: '22%', '--size': '10px', '--dur': '19s', '--delay': '4s', '--lx': '-30px' },
  { left: '37%', '--size': '16px', '--dur': '17s', '--delay': '8s', '--lx': '55px' },
  { left: '51%', '--size': '11px', '--dur': '21s', '--delay': '2s', '--lx': '-45px' },
  { left: '64%', '--size': '14px', '--dur': '16s', '--delay': '10s', '--lx': '35px' },
  { left: '76%', '--size': '9px', '--dur': '20s', '--delay': '6s', '--lx': '-25px' },
  { left: '86%', '--size': '15px', '--dur': '18s', '--delay': '12s', '--lx': '50px' },
  { left: '94%', '--size': '11px', '--dur': '22s', '--delay': '3s', '--lx': '-35px' },
];

export default function LeafParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {LEAVES.map((style, i) => (
        <span key={i} className="leaf" style={style} />
      ))}
    </div>
  );
}
