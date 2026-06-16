'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { heroPhoto } from '@/lib/images';
import { PERSON, CV_HREF } from '@/lib/data';
import GlassButton from './GlassButton';
import LeafParticles from './LeafParticles';
import RedKiteMascot from './RedKiteMascot';
import { ArrowDown, Download } from './icons';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Two layers drift at different rates: the valley lags, the foreground oak
  // canopy leads (moves faster) — parallax depth. Pixel offsets stay inside the
  // layers' overflow + scale so edges never show. Disabled on reduced motion.
  const valleyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const valleyScale = useTransform(scrollYProgress, [0, 1], [1.06, reduce ? 1.06 : 1.12]);
  // Foreground canopy leads (moves up faster than the page) while the valley lags.
  const canopyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0.15]);

  const panelInitial = reduce
    ? { opacity: 0 }
    : { opacity: 0, y: 28, scale: 0.97 };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* Layer 0 — valley photo (parallax, slower) */}
      <motion.div
        style={{ y: valleyY, scale: valleyScale }}
        className="absolute -inset-[8%] z-0"
      >
        <Image
          src={heroPhoto}
          alt="A winding path leading toward distant hills at golden hour — somewhere worth exploring."
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Scrim — keeps glass text above WCAG AA */}
      <div className="scrim absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Layer 1 — foreground oak canopy silhouette (parallax, faster) */}
      <motion.div
        style={{ y: canopyY }}
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[42%]"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 420"
          preserveAspectRatio="xMidYMin slice"
          fill="#0F2A33"
        >
          <g opacity="0.92">
            {/* left cluster */}
            <ellipse cx="60" cy="-20" rx="190" ry="150" />
            <ellipse cx="190" cy="20" rx="150" ry="120" />
            <ellipse cx="40" cy="120" rx="120" ry="100" />
            <ellipse cx="250" cy="-30" rx="120" ry="110" />
            {/* right cluster */}
            <ellipse cx="1390" cy="-20" rx="200" ry="150" />
            <ellipse cx="1260" cy="20" rx="150" ry="120" />
            <ellipse cx="1410" cy="120" rx="120" ry="100" />
            <ellipse cx="1200" cy="-30" rx="110" ry="100" />
          </g>
        </svg>
      </motion.div>

      {/* Floating leaves */}
      <div className="absolute inset-0 z-[2]">
        <LeafParticles />
      </div>

      <RedKiteMascot className="absolute bottom-24 right-5 z-[3] w-20 opacity-90 sm:bottom-28 sm:right-10 sm:w-28 lg:right-[8%] lg:w-36" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-[3] mx-auto w-full max-w-6xl px-5 sm:px-8"
      >
        {/* Warm golden-hour bloom behind the panel for depth (no blur). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 z-0 h-[130%] w-[80%] max-w-2xl -translate-y-1/2 bg-[radial-gradient(50%_50%_at_38%_42%,rgba(239,159,39,0.22),transparent_70%)]"
        />

        <motion.div
          initial={panelInitial}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
          className="glass aurora-border relative z-10 max-w-2xl p-7 sm:p-10"
        >
          <span className="glass-chip inline-flex items-center gap-2 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/85">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-leaf text-leaf" aria-hidden="true" />
            {PERSON.location}
            <span className="text-white/40">·</span>
            <a
              href="#contact"
              className="rounded-full text-mint underline-offset-4 transition-colors hover:text-mint/80 hover:underline focus-visible:underline"
            >
              Open to work
            </a>
          </span>

          <h1
            id="hero-heading"
            className="mt-5 font-display text-hero font-semibold"
          >
            <span className="text-gradient text-shimmer">Saicharan</span>{' '}
            <span className="text-gradient-amber text-shimmer">“Charan”</span>{' '}
            <span className="text-gradient text-shimmer">Duduka</span>
          </h1>

          <p className="mt-5 max-w-md font-display text-lg text-white/90 sm:text-xl">
            {PERSON.role} <span className="text-white/70">·</span>{' '}
            <span className="text-mint">{PERSON.tagline}</span>
          </p>

          <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-white/65">
            <span className="h-px w-6 bg-gradient-to-r from-amber to-transparent" aria-hidden="true" />
            {PERSON.lookingFor}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <GlassButton
              href="#path"
              variant="primary"
              magnetic
              iconRight={<ArrowDown width={18} height={18} />}
            >
              Follow the path
            </GlassButton>
            <GlassButton
              href={CV_HREF}
              download
              variant="ghost"
              magnetic
              iconLeft={<Download width={18} height={18} />}
            >
              Download CV
            </GlassButton>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 z-[3] -translate-x-1/2 text-white/70"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]">scroll</span>
          <ArrowDown className="animate-bounce" width={18} height={18} />
        </div>
      </div>
    </section>
  );
}
