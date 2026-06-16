'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

type Props = {
  /** Source string, e.g. "5+", "2", "86", "3.5". Non-digits are preserved. */
  value: string;
  className?: string;
  durationMs?: number;
};

/**
 * Counts a numeric value up from zero the first time it scrolls into view,
 * preserving any prefix/suffix ("5+", "£20"). Snaps straight to the final
 * value under prefers-reduced-motion.
 */
export default function CountUp({ value, className, durationMs = 1200 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? '';
  const numStr = match?.[2] ?? '';
  const suffix = match?.[3] ?? '';
  const target = match ? parseFloat(numStr) : 0;
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

  const [display, setDisplay] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!match) return;
    if (!inView || reduce) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, durationMs, match]);

  // Non-numeric values render verbatim.
  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
