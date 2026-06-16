import type { StaticImageData } from 'next/image';

// Static imports let next/image auto-generate width/height (no layout shift)
// and a blur placeholder for each photo. These are palette-matched
// PLACEHOLDERS — drop real travel photos in at the same paths to swap them.
import heroPhoto from '@/public/photos/hero-horizon.jpg';
import contactPhoto from '@/public/photos/open-view.jpg';
import hillsideHomes from '@/public/photos/hillside-homes.jpg';
import greenRidge from '@/public/photos/green-ridge.jpg';
import portraitPhoto from '@/public/photos/charan-portrait.jpg';

export { heroPhoto, contactPhoto, hillsideHomes, greenRidge, portraitPhoto };

export type GalleryPhoto = {
  src: StaticImageData;
  alt: string;
};

/**
 * "Through my lens" — places explored: architecture + greenery. The masonry
 * grid + lightbox handle any number of items, so adding more is a two-line
 * change:
 *   1. `import myPhoto from '@/public/photos/my-photo.jpg';`
 *   2. add `{ src: myPhoto, alt: '…' }` to this array.
 */
export const GALLERY: GalleryPhoto[] = [
  {
    src: hillsideHomes,
    alt: 'Terracotta-roofed houses stacked up a steep hillside — the kind of design that makes me stop and look.',
  },
  {
    src: greenRidge,
    alt: 'Green ridgelines rolling into the distance under a soft golden-hour sky.',
  },
];
