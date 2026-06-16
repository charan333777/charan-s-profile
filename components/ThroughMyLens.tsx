'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GALLERY } from '@/lib/images';
import { GALLERY_CAPTION } from '@/lib/data';
import { Reveal, Stagger, StaggerItem } from './motion';
import SectionHeading from './SectionHeading';
import Lightbox from './Lightbox';

export default function ThroughMyLens() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="lens" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading kicker="04 · Through my lens" title="Through my lens" />
          <p className="mt-4 max-w-xl text-white/65">{GALLERY_CAPTION}</p>
        </Reveal>

        {/* Masonry — CSS columns reflow gracefully as photos are added. */}
        <Stagger className="mt-10 columns-1 gap-5 sm:columns-2 [&>*]:mb-5">
          {GALLERY.map((photo, i) => (
            <StaggerItem key={photo.src.src} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open photo: ${photo.alt}`}
                className="group relative block w-full overflow-hidden rounded-glass glass-flat p-2 text-left transition-all duration-500 ease-grow hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(4,52,44,0.4),0_0_30px_rgba(29,158,117,0.3)] hover:ring-1 hover:ring-leaf/40"
              >
                <span className="block overflow-hidden rounded-[14px]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    placeholder="blur"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="h-auto w-full object-cover transition-transform duration-500 ease-grow group-hover:scale-[1.04]"
                  />
                </span>
                {/* hover affordance */}
                <span
                  className="pointer-events-none absolute inset-2 rounded-[14px] bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute bottom-4 left-4 inline-flex translate-y-1.5 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  aria-hidden="true"
                >
                  View ⤢
                </span>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Lightbox
        photos={GALLERY}
        index={openIndex}
        caption={GALLERY_CAPTION}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
