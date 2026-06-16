'use client';

import Image from 'next/image';
import { contactPhoto } from '@/lib/images';
import { CONTACT, CV_HREF, WORKING_STYLE } from '@/lib/data';
import { Reveal } from './motion';
import GlassButton from './GlassButton';
import { Mail, LinkedIn, GitHub, Download, ArrowUpRight } from './icons';
import type { ReactNode } from 'react';

type Method = {
  name: string;
  label: string;
  href: string;
  icon: ReactNode;
  external: boolean;
};

const METHODS: Method[] = [
  {
    name: 'Email',
    label: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: <Mail width={18} height={18} />,
    external: false,
  },
  {
    name: 'LinkedIn',
    label: CONTACT.linkedin.label,
    href: CONTACT.linkedin.href,
    icon: <LinkedIn width={18} height={18} />,
    external: true,
  },
  {
    name: 'GitHub',
    label: CONTACT.github.label,
    href: CONTACT.github.href,
    icon: <GitHub width={18} height={18} />,
    external: true,
  },
];

export default function TheOpenView() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex min-h-[100svh] w-full items-start overflow-hidden"
    >
      {/* full-bleed panorama */}
      <div className="absolute inset-0 z-0">
        <Image
          src={contactPhoto}
          alt="A wide open horizon at dusk — the kind of view worth travelling for."
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* top-down scrim — content sits in the bright sky half */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/15 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <Reveal>
          <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-mint">
            <span className="h-px w-8 bg-gradient-to-r from-mint to-transparent" aria-hidden="true" />
            05 · The open view
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass hairline-top mt-5 max-w-xl p-7 sm:p-9">
            <span className="glass-chip mb-5 inline-flex items-center gap-2 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/85">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-leaf text-leaf" aria-hidden="true" />
              Available for new roles
            </span>
            <h2
              id="contact-heading"
              className="font-display text-section font-semibold text-gradient text-shimmer"
            >
              Let’s build something.
            </h2>
            <p className="mt-4 text-white/85">
              Got a team that needs cleaner pipelines, or an idea that needs
              shipping? I’m always up for a good problem.
            </p>

            <div className="mt-6 border-y border-white/10 py-5">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mint/75">
                Why work with me
              </p>
              <ul className="mt-3 space-y-2">
                {WORKING_STYLE.map((line) => (
                  <li key={line} className="flex gap-2 text-sm leading-relaxed text-white/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-7 space-y-3">
              {METHODS.map((m) => (
                <li key={m.name}>
                  <a
                    href={m.href}
                    target={m.external ? '_blank' : undefined}
                    rel={m.external ? 'noopener noreferrer' : undefined}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white/90 transition-colors duration-300 hover:border-leaf/30 hover:bg-white/10"
                  >
                    <span
                      className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gradient-to-b from-leaf to-amber transition-transform duration-300 ease-grow group-hover:scale-y-100"
                      aria-hidden="true"
                    />
                    <span className="text-mint transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(29,158,117,0.85)]">
                      {m.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-mono text-[0.7rem] uppercase tracking-widest text-white/70">
                        {m.name}
                      </span>
                      <span className="text-sm">{m.label}</span>
                    </span>
                    <ArrowUpRight
                      width={16}
                      height={16}
                      className="ml-auto text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/80"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <GlassButton
                href={CV_HREF}
                download
                variant="primary"
                magnetic
                iconLeft={<Download width={18} height={18} />}
              >
                Download CV
              </GlassButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
