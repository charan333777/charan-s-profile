'use client';

import { INTRO_LINES, INTERESTS, PROOF_POINTS, SYSTEMS_I_OWN, TECH_CHIPS } from '@/lib/data';
import { Reveal, Stagger, StaggerItem } from './motion';
import SectionHeading from './SectionHeading';
import CountUp from './CountUp';
import SpotlightCard from './SpotlightCard';

export default function UnderTheOak() {
  return (
    <section id="intro" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading kicker="01 · Field notes" title="Who I am" />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass-flat hairline-top mt-8 p-7 sm:p-10">
            <div className="space-y-4 text-lg leading-relaxed text-white/90 sm:text-xl">
              {INTRO_LINES.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="mt-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-clay">
                Off the clock
              </p>
              <Stagger className="flex flex-wrap gap-2.5">
                {INTERESTS.map((interest) => (
                  <StaggerItem
                    key={interest}
                    as="span"
                    className="glass-chip cursor-default px-3.5 py-1.5 font-mono text-sm text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white hover:shadow-[0_0_18px_rgba(239,159,39,0.4)]"
                  >
                    {interest}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="mt-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
                Stack
              </p>
              <Stagger className="flex flex-wrap gap-2.5">
                {TECH_CHIPS.map((tech) => (
                  <StaggerItem
                    key={tech}
                    as="span"
                    className="glass-chip cursor-default px-3.5 py-1.5 font-mono text-sm text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white hover:shadow-[0_0_18px_rgba(29,158,117,0.4)]"
                  >
                    {tech}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-mint/80">
                Proof points
              </p>
              <dl className="grid gap-5 sm:grid-cols-3">
                {PROOF_POINTS.map((point) => (
                  <div key={point.label} className="min-w-0">
                    <dt className="font-display text-4xl font-semibold text-amber [text-shadow:0_0_24px_rgba(239,159,39,0.35)]">
                      <CountUp value={point.value} />
                    </dt>
                    <dd className="mt-1">
                      <span className="block font-medium text-white">{point.label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/65">
                        {point.detail}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-mint/80">
              Systems I can own
            </p>
            <h3 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-gradient sm:text-4xl">
              From commit to cloud, with product sense.
            </h3>

            <Stagger className="mt-7 grid gap-4 sm:grid-cols-2">
              {SYSTEMS_I_OWN.map((system, i) => (
                <StaggerItem key={system.title} as="div" className="h-full">
                  <SpotlightCard
                    as="article"
                    className="glass-flat-dark hairline-top h-full p-5 transition-colors duration-300 hover:border-white/30"
                  >
                    <span className="font-mono text-xs text-mint/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="mt-1 font-display text-xl font-semibold text-white">
                      {system.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {system.detail}
                    </p>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
