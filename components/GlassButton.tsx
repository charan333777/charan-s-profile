'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

type Variant = 'primary' | 'ghost';

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** Trigger a file download (e.g. the CV). */
  download?: boolean;
  /** Open in a new tab with safe rel. */
  external?: boolean;
  /** Subtle pull-toward-cursor on fine pointers. */
  magnetic?: boolean;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

// No backdrop-filter here — buttons are translucent only, so they never eat
// into the per-viewport blur budget.
const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-amber text-deep-green font-semibold border border-white/30 shadow-glass-lit hover:bg-amber/90 hover:shadow-[0_8px_32px_rgba(4,52,44,0.18),0_0_30px_rgba(239,159,39,0.45)]',
  ghost:
    'bg-white/10 text-white/90 border border-white/25 shadow-glass-lit hover:bg-white/[0.18] hover:border-white/40',
};

export default function GlassButton({
  href,
  children,
  variant = 'ghost',
  download = false,
  external = false,
  magnetic = false,
  iconRight,
  iconLeft,
  className = '',
  'aria-label': ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!magnetic || reduce) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [magnetic, reduce]);

  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 14);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      download={download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onPointerMove={enabled ? onMove : undefined}
      onPointerLeave={enabled ? reset : undefined}
      style={enabled ? { x, y } : undefined}
      className={[
        'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3',
        'text-sm tracking-wide transition-[transform,background-color,box-shadow,border-color] duration-300 ease-grow',
        'will-change-transform hover:-translate-y-0.5 active:translate-y-0',
        VARIANTS[variant],
        className,
      ].join(' ')}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </motion.a>
  );
}
