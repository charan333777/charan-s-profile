'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Vertical "01 → 05" progress rail pinned to the right edge (desktop only).
 * Makes the "follow the path" metaphor literal: a scroll-spy IntersectionObserver
 * lights the current step in amber and reveals its label; clicking jumps to the
 * section. Hidden until the hero is scrolled past. Sits below the nav and modals.
 */
const STEPS = [
  { id: 'intro', n: '01', label: 'Field notes' },
  { id: 'path', n: '02', label: 'The path' },
  { id: 'grown', n: '03', label: 'Products' },
  { id: 'contact', n: '04', label: 'Contact' },
];

export default function PathRail() {
  const [active, setActive] = useState('intro');
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    STEPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <motion.nav
      aria-label="Section progress"
      initial={false}
      animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : 12 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      style={{ pointerEvents: shown ? 'auto' : 'none' }}
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ol className="flex flex-col gap-1.5">
        {STEPS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="flex justify-end">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center justify-end gap-2.5 py-1"
              >
                <span
                  className={[
                    'whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-300',
                    isActive
                      ? 'text-amber opacity-100'
                      : 'translate-x-1 text-white/70 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                  ].join(' ')}
                >
                  {s.label}
                </span>
                <span
                  className={[
                    'font-mono text-[0.62rem] tabular-nums transition-colors duration-300',
                    isActive ? 'text-amber' : 'text-white/35 group-hover:text-white/70',
                  ].join(' ')}
                >
                  {s.n}
                </span>
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span
                    className={[
                      'rounded-full transition-all duration-300',
                      isActive
                        ? 'h-2.5 w-2.5 bg-amber shadow-[0_0_12px_rgba(239,159,39,0.85)]'
                        : 'h-1.5 w-1.5 bg-white/30 group-hover:bg-white/60',
                    ].join(' ')}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
