'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { PRODUCTS, type Product } from '@/lib/data';
import { Reveal } from './motion';
import SectionHeading from './SectionHeading';
import { ArrowUpRight } from './icons';

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Tilt is a desktop / fine-pointer progressive enhancement only.
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduce]);

  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 11);
    rx.set(-py * 11);
    // Drive the cursor spotlight (inherited by the card via CSS vars).
    ref.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    ref.current.style.setProperty('--spot', '1');
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    ref.current?.style.setProperty('--spot', '0');
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={
        enabled
          ? { rotateX: rx, rotateY: ry, transformPerspective: 900 }
          : undefined
      }
      whileHover={enabled ? { scale: 1.015 } : undefined}
      className="h-full [transform-style:preserve-3d]"
    >
      {children}
    </motion.div>
  );
}

function BoardPreview() {
  const columns = [
    { name: 'Applied', count: '12', cards: ['Frontend Engineer'] },
    { name: 'Interview', count: '3', cards: ['Platform role'] },
    { name: 'Follow-up', count: '5', cards: ['Send note'] },
  ];

  return (
    <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(239,159,39,0.2),transparent_32%),linear-gradient(135deg,rgba(29,158,117,0.22),rgba(255,255,255,0.04))] p-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {columns.map((column) => (
          <div key={column.name} className="rounded-2xl border border-white/10 bg-deep-green/45 p-2 sm:p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/65">
                {column.name}
              </p>
              <span className="w-fit rounded-full bg-white/10 px-2 py-0.5 font-mono text-[0.65rem] text-mint">
                {column.count}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {column.cards.map((card) => (
                <div key={card} className="rounded-xl bg-white/10 p-2.5 shadow-glass sm:p-3">
                  <div className="h-1.5 w-16 rounded-full bg-amber/70" />
                  <p className="mt-2 text-xs font-medium text-white/85">{card}</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-leaf" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CvPreview() {
  return (
    <div className="border-b border-white/10 bg-[radial-gradient(circle_at_82%_24%,rgba(181,212,244,0.26),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.1),rgba(29,158,117,0.14))] p-4">
      <div className="grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/90 font-display text-xl font-semibold text-deep-green">
              86
            </span>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-mint">
                ATS match
              </p>
              <p className="mt-1 text-sm font-medium text-white">Cloud Engineer role</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-full w-5/6 rounded-full bg-amber" />
            </div>
            <div className="h-2 w-4/5 rounded-full bg-white/15" />
            <div className="h-2 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-deep-green/45 p-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/65">
            Keywords
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Terraform', 'Azure', 'CI/CD', 'Docker', 'Monitoring'].map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-leaf/20 px-2.5 py-1 font-mono text-[0.68rem] text-mint ring-1 ring-leaf/30"
              >
                {keyword}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white/10 p-3">
            <p className="text-xs leading-relaxed text-white/75">
              Stronger role language, cleaner structure and targeted evidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview({ product }: { product: Product }) {
  return product.preview === 'board' ? <BoardPreview /> : <CvPreview />;
}

function ProductCard({ product }: { product: Product }) {
  const facts = [
    { label: 'Problem', value: product.problem },
    { label: 'Built', value: product.built },
    { label: 'Result', value: product.result },
  ];

  return (
    <TiltCard>
      <article className="glass-flat-dark relative flex h-full flex-col overflow-hidden transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(4,52,44,0.4),0_0_42px_rgba(29,158,117,0.25)]">
        <span className="spotlight-layer" aria-hidden="true" />
        {/* faux app window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" aria-hidden="true" />
          <span className="ml-2 font-mono text-xs text-white/70">{product.domain}</span>
        </div>

        <ProductPreview product={product} />

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-leaf/15 px-3 py-1 font-mono text-xs text-mint ring-1 ring-leaf/30">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-leaf text-leaf" aria-hidden="true" />
            {product.status}
          </span>

          <h3 className="mt-4 font-display text-3xl font-semibold text-white">
            {product.name}
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-white/80">
            {product.pitch}
          </p>

          <dl className="mt-6 space-y-4 border-t border-white/10 pt-5">
            {facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 sm:grid-cols-[5rem_1fr]">
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-mint/70">
                  {fact.label}
                </dt>
                <dd className="text-sm leading-relaxed text-white/75">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <li
                key={tag}
                className="glass-chip px-3 py-1 font-mono text-xs text-white/80"
              >
                {tag}
              </li>
            ))}
          </ul>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-7 font-medium text-amber transition-colors hover:text-amber/80"
          >
            Visit {product.domain}
            <ArrowUpRight
              width={18}
              height={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </article>
    </TiltCard>
  );
}

export default function GrownHere() {
  return (
    <section id="grown" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            kicker="03 · Built by hand"
            title="Two products, shipped solo"
          />
          <p className="mt-4 max-w-xl text-white/65">
            Live production systems I designed, built, shipped and still run
            end-to-end — at near-zero cost.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {PRODUCTS.map((product) => (
            <Reveal key={product.name} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
