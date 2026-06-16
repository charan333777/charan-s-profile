/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // next/image serves modern formats automatically when deployed on Vercel.
    formats: ['image/avif', 'image/webp'],
  },
  // The site is fully static (SSG). To produce a static export instead of a
  // Vercel deployment, set `output: 'export'` and `images.unoptimized: true`.
};

export default nextConfig;
