'use client';

import Image from 'next/image';
import { INTRO_LINES, INTERESTS, PROOF_POINTS, SYSTEMS_I_OWN, TECH_CHIPS, PERSON } from '@/lib/data';
import { portraitPhoto } from '@/lib/images';
import { Reveal, Stagger, StaggerItem } from './motion';
import SectionHeading from './SectionHeading';
import CountUp from './CountUp';
import SpotlightCard from './SpotlightCard';
import { Compass, Rocket, Layers } from './icons';

const PROOF_ICONS = {
  compass: Compass,
  rocket: Rocket,
  layers: Layers,
} as const;

export default function UnderTheOak() {
  return (
    <section id="intro" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading kicker="01 · Field notes" title="Who I am" />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass-flat hairline-top mt-8 p-7 sm:p-10">
            <div className="grid items-start gap-7 sm:grid-cols-[1fr_auto] sm:gap-9">
              <div className="order-2 space-y-4 text-lg leading-relaxed text-white/90 sm:order-1 sm:text-xl">
                {INTRO_LINES.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <figure className="group relative order-1 mx-auto w-44 shrink-0 sm:order-2 sm:mx-0 sm:w-52">
                {/* soft golden-hour halo behind the frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 -z-10 rounded-[28px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(239,159,39,0.28),transparent_72%)] blur-xl"
                />
                <div className="overflow-hidden rounded-[22px] border border-white/20 shadow-[0_18px_50px_rgba(4,52,44,0.45),inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <Image
                    src={portraitPhoto}
                    alt={`${PERSON.nick} — ${PERSON.role}`}
                    placeholder="blur"
                    sizes="(max-width: 640px) 11rem, 13rem"
                    className="h-auto w-full object-cover transition-transform duration-500 ease-grow group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mint/80 sm:text-left">
                  {PERSON.location}
                </figcaption>
              </figure>
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
                {PROOF_POINTS.map((point) => {
                  const Icon = PROOF_ICONS[point.icon];
                  return (
                    <div key={point.label} className="min-w-0">
                      <span
                        aria-hidden="true"
                        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber/12 text-amber ring-1 ring-amber/25 [box-shadow:0_0_20px_rgba(239,159,39,0.18)]"
                      >
                        <Icon width={20} height={20} />
                      </span>
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
                  );
                })}
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
