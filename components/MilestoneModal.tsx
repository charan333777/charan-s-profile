'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Milestone } from '@/lib/data';

type Accent = { color: string; glow: string };

/** Small leaf glyph that marks each highlight — tinted to the role accent. */
function LeafBullet({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill={color}
      aria-hidden="true"
      className="mt-[3px] flex-shrink-0"
    >
      <path d="M14 2C7 2 2 6 2 12c0 .8.2 1.6.4 2.3.6-2.4 1.9-4.6 3.8-6.2-1.4 1.8-2.3 3.9-2.6 6.2 4.6.7 9.6-1.2 10.2-7.2C14 5 14 3.4 14 2Z" />
    </svg>
  );
}

/** Red-kite mascot silhouette, soaring into the top-left corner. */
function KiteCorner({ color, reduce }: { color: string; reduce: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute -left-5 -top-6 z-0"
      style={{ color }}
      aria-hidden="true"
      initial={reduce ? false : { y: 6, rotate: -3, opacity: 0 }}
      animate={
        reduce
          ? { opacity: 0.45 }
          : { y: [6, -4, 6], rotate: [-3, 2, -3], opacity: 0.45 }
      }
      transition={
        reduce
          ? undefined
          : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <svg
        width="112"
        height="80"
        viewBox="0 0 210 150"
        fill="currentColor"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path d="M102 76C77 44 39 28 14 39c17 12 29 28 38 48 13 4 28 8 50-11Z" />
        <path d="M118 76c25-32 63-48 88-37-17 12-29 28-38 48-13 4-28 8-50-11Z" />
        <path d="M96 99 88 142l22-17 22 17-8-43H96Z" />
      </svg>
    </motion.div>
  );
}

export default function MilestoneModal({
  m,
  index,
  accent,
  onClose,
}: {
  m: Milestone;
  index: number;
  accent: Accent;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc to close + scroll lock + initial focus + simple focus trap.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevFocus = document.activeElement as HTMLElement | null;

    const focusables = () =>
      panelRef.current
        ? Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Dimmed, blurred forest behind the page. */}
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        tabIndex={-1}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-modal-title"
        className="glass-flat-dark hairline-top relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-t-3xl px-6 pb-7 pt-6 sm:rounded-3xl sm:px-8 sm:pb-8 sm:pt-7"
        initial={
          reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {/* platform-coloured chapter spine */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-0 top-6 w-[3px] rounded-r-full"
          style={{ backgroundColor: accent.color, boxShadow: `0 0 14px ${accent.glow}` }}
        />
        {/* faint chapter number */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-4 font-display text-6xl font-bold leading-none"
          style={{ color: accent.color, opacity: 0.13 }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <KiteCorner color={accent.color} reduce={!!reduce} />

        {/* mobile grab handle */}
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-white/25 sm:hidden"
        />

        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-deep-green/50 text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="relative z-10">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-mint/80">
            {m.period}
            {m.now && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2 py-0.5 text-[0.65rem] font-medium text-amber ring-1 ring-amber/40">
                Now
              </span>
            )}
          </p>
          <h2
            id="milestone-modal-title"
            className="mt-2 font-display text-2xl font-semibold text-white"
          >
            {m.org}
          </h2>
          <p className="mt-0.5 text-sm text-white/70">{m.role}</p>

          {m.metric && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 font-mono text-sm font-medium text-amber ring-1 ring-amber/30">
              {m.metric}
            </p>
          )}

          <div
            className="mt-5 h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(231,239,232,0.28), transparent)',
            }}
          />

          <ul className="mt-5 flex flex-col gap-3">
            {m.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <LeafBullet color={accent.color} />
                <span className="text-[0.95rem] leading-relaxed text-white/90">
                  {h}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {m.tags.map((tag) => (
              <li
                key={tag}
                className="glass-chip px-3 py-1 font-mono text-xs text-white/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
