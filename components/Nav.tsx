'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { NAV_LINKS, CV_HREF } from '@/lib/data';
import { Download } from './icons';

export default function Nav() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  // Reveal once the hero is mostly scrolled past.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.82 : 600;
    setShown(y > threshold);
  });

  // Scroll-spy: highlight the section currently centered in the viewport.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: shown ? 0 : -96, opacity: shown ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      aria-hidden={!shown}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3"
      style={{ pointerEvents: shown ? 'auto' : 'none' }}
    >
      <nav
        aria-label="Section navigation"
        className="glass mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-full px-3 py-2.5 sm:gap-3 sm:px-4"
      >
        <a
          href="#top"
          className="shrink-0 rounded-full px-1.5 font-display text-base font-semibold tracking-tight text-white sm:px-2"
        >
          Charan<span className="text-amber">.</span>
        </a>

        <ul className="flex min-w-0 items-center gap-0.5 text-[0.78rem] sm:gap-2 sm:text-[0.8rem]">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li
                key={link.href}
                className={link.href === '#lens' ? 'hidden min-[440px]:block' : undefined}
              >
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'relative whitespace-nowrap rounded-full px-2 py-1.5 transition-colors duration-300 sm:px-2.5',
                    isActive ? 'text-white' : 'text-white/70 hover:text-white',
                  ].join(' ')}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-white/15 ring-1 ring-inset ring-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href={CV_HREF}
          download
          className="hidden items-center gap-1.5 rounded-full bg-amber px-3.5 py-1.5 text-[0.8rem] font-semibold text-deep-green transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(239,159,39,0.5)] sm:inline-flex"
        >
          <Download width={15} height={15} />
          CV
        </a>
      </nav>
    </motion.header>
  );
}
