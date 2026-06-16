'use client';

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Rendered element — defaults to a div. */
  as?: ElementType;
};

/**
 * Wraps an existing surface (pass the glass classes through `className`) and
 * paints a soft cursor-following light wash over it on fine pointers. Pure
 * paint — no backdrop-filter, no layout — so it stays off the blur budget and
 * costs nothing on touch / reduced-pointer devices (the wash never turns on).
 */
export default function SpotlightCard({ children, className = '', as }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
    el.style.setProperty('--spot', '1');
  };

  const onLeave = () => {
    ref.current?.style.setProperty('--spot', '0');
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={enabled ? onMove : undefined}
      onPointerLeave={enabled ? onLeave : undefined}
      className={`relative overflow-hidden ${className}`}
    >
      <span className="spotlight-layer" aria-hidden="true" />
      {children}
    </Tag>
  );
}
