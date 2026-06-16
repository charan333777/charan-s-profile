'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { GalleryPhoto } from '@/lib/images';
import { ChevronLeft, ChevronRight, Close } from './icons';

type Props = {
  photos: GalleryPhoto[];
  index: number | null;
  caption?: string;
  onClose: () => void;
  onNavigate: (i: number) => void;
};

const EXIT_MS = 260;

export default function Lightbox({ photos, index, caption, onClose, onNavigate }: Props) {
  const open = index !== null;
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const count = photos.length;

  // Keep the last shown index so the image stays put while fading out.
  const lastIndex = useRef<number | null>(index);
  if (index !== null) lastIndex.current = index;
  const shownIndex = index !== null ? index : lastIndex.current;
  const current = shownIndex !== null ? photos[shownIndex] : null;

  // Mount immediately on open; defer unmount with a real-clock timer so the
  // overlay always tears down even if the tab is hidden and rAF is throttled
  // (i.e. never rely on the exit animation completing to remove the click layer).
  const [render, setRender] = useState(open);
  useEffect(() => {
    if (open) {
      setRender(true);
      return;
    }
    const t = setTimeout(() => setRender(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onNavigate((index + dir + count) % count);
    },
    [index, count, onNavigate],
  );

  // Keyboard: Esc closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
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
    return () => document.removeEventListener('keydown', onKey);
  }, [open, go, onClose]);

  // Lock body scroll + manage focus (move in on open, restore on close).
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!render || !current || shownIndex === null) return null;

  return (
    <motion.div
      // pointer-events flip to none the instant we start closing, so a fading
      // overlay can never intercept clicks.
      style={{ pointerEvents: open ? 'auto' : 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10"
    >
      {/* solid backdrop (no blur — keeps us in the blur budget) */}
      <button
        type="button"
        aria-label="Close image viewer"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out bg-black/85"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={current.alt}
        className="relative z-[1] flex max-h-full w-full max-w-5xl flex-col items-center"
      >
        <div className="mb-3 flex w-full items-center justify-between gap-3">
          <span className="glass-flat-dark rounded-full px-3 py-1.5 font-mono text-xs text-white/80">
            {shownIndex + 1} / {count}
          </span>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close"
            className="glass-flat-dark inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15"
          >
            <Close />
          </button>
        </div>

        <motion.div
          key={shownIndex}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) go(1);
            else if (info.offset.x > 80) go(-1);
          }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex w-full cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <Image
            src={current.src}
            alt={current.alt}
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 1024px"
            draggable={false}
            className="h-auto max-h-[70vh] w-auto max-w-full select-none rounded-xl object-contain shadow-2xl"
          />
        </motion.div>

        {caption && (
          <p className="glass-flat-dark mt-3 max-w-md rounded-full px-4 py-2 text-center text-sm text-white/80">
            {caption}
          </p>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="glass-flat-dark absolute left-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/15 sm:-left-3"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="glass-flat-dark absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/15 sm:-right-3"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
