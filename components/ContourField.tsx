/**
 * Topographic contour lines — a faint "valley map" texture for the ambient
 * backdrop. Deterministic (no random) so SSR and client markup match.
 */
export default function ContourField() {
  const W = 1440;
  const H = 1000;
  const lines = 16;
  const steps = 44;

  const paths: string[] = [];
  for (let i = 0; i < lines; i++) {
    const baseY = (i / (lines - 1)) * H;
    const amp = 16 + (i % 4) * 13;
    const freq = 1 + (i % 3) * 0.45;
    const phase = i * 0.7;
    let d = `M 0 ${baseY.toFixed(1)}`;
    for (let s = 1; s <= steps; s++) {
      const x = (s / steps) * W;
      const y = baseY + Math.sin((s / steps) * Math.PI * 2 * freq + phase) * amp;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(d);
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}
