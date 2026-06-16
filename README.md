# The Valley — Charan’s portfolio

A graphic-heavy, glassmorphic one-page portfolio for **Saicharan “Charan” Duduka**,
DevOps & Cloud Engineer and solo SaaS founder in the Thames Valley, UK.

The whole page is a single scroll-journey through “chapters”:

1. **Under the oak** — hero, full-bleed photo + two-layer parallax
2. **A short story** — intro + stack chips
3. **The path** — experience timeline drawn as a winding footpath that draws itself on scroll
4. **Grown here** — the two live products (Banddle, CVMindAI) with 3D hover tilt
5. **Through my lens** — masonry photo gallery + keyboard-navigable lightbox
6. **The open view** — contact, full-bleed panorama
7. Footer

All content floats on frosted-glass panels over the photography.

## Tech

- **Next.js 14** (App Router) — statically pre-rendered (SSG)
- **Tailwind CSS** — palette, glass utilities, fluid type
- **Framer Motion** — reveals, parallax, the drawing footpath, tilt, lightbox
- **next/image** — AVIF/WebP, blur placeholders, priority hero, no layout shift
- **next/font** — Space Grotesk (display), Inter (body), JetBrains Mono (mono), self-hosted
- No CMS, no database. Deploys to Vercel as-is.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build
```

## Make it yours

Everything is plain TypeScript — no admin, no markdown.

| What | Where |
| --- | --- |
| Name, role, intro, experience, products, contact | [`lib/data.ts`](lib/data.ts) |
| Photos & gallery list | [`lib/images.ts`](lib/images.ts) + [`public/photos/`](public/photos) |
| Colours, fonts, glass shadows | [`tailwind.config.ts`](tailwind.config.ts) |
| Glass utilities, scrims, particles, motion-reduce | [`app/globals.css`](app/globals.css) |
| SEO / Open Graph | [`app/layout.tsx`](app/layout.tsx) |

### Replace the photos

> ⚠️ The three images in `public/photos/` are **generated placeholders**. Drop in
> your real Thames Valley photos using the **same filenames** and they just work:

- `public/photos/oak-swing.jpg` — hero **and** the Open Graph share image
- `public/photos/valley-panorama.jpg` — contact background
- `public/photos/thames-bridge.jpg` — gallery

`public/cv.pdf` is the downloadable CV used by every “Download CV” button.

### Add gallery photos

The grid + lightbox are data-driven and reflow for any number of images. To add one,
edit [`lib/images.ts`](lib/images.ts):

```ts
import myPhoto from '@/public/photos/my-photo.jpg';
// …then add to the GALLERY array:
{ src: myPhoto, alt: 'A short, descriptive caption.' }
```

## Deploy (Vercel)

Push to GitHub and import on Vercel — zero config. Image optimization and modern
formats work automatically.

For correct Open Graph URLs on a custom domain, set:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

(On Vercel, `VERCEL_URL` is used automatically if this is unset.)

**Static export** instead of Vercel? In [`next.config.mjs`](next.config.mjs) add
`output: 'export'` and `images: { unoptimized: true }`, then `npm run build` emits a
static `out/`.

## Design notes

- **Glass system** (`.glass`, `.glass-dark`, `.glass-flat`, `.glass-chip`) lives in
  `app/globals.css`. To stay fast, only `.glass`/`.glass-dark` use `backdrop-filter`
  and at most two are on screen at once (the nav + one panel); repeated/gridded panels
  use the blur-free `-flat` variants, which look identical over the smooth gradient.
  There’s a solid-panel `@supports` fallback where `backdrop-filter` is unsupported.
- **Accessibility**: semantic landmarks, alt text on every photo, white-60% focus
  rings, skip link, a fully keyboard-navigable lightbox (Esc / ← → / focus trap /
  scroll lock), and `prefers-reduced-motion` disables parallax + particles while
  keeping fades.
- **Performance**: SSG, priority hero image + lazy below-fold, self-hosted fonts,
  explicit image dimensions (no CLS), and no animated blur.
- Run `npx lighthouse <url>` against the deployment to confirm scores.

---

© 2026 Charan · Shot & built in the Thames Valley.
