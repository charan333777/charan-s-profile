import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ScrollProgress from '@/components/ScrollProgress';
import PathRail from '@/components/PathRail';
import CursorGlow from '@/components/CursorGlow';
import ContourField from '@/components/ContourField';
import SoundToggle from '@/components/SoundToggle';

const display = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});
const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const title = 'Saicharan “Charan” Duduka — DevOps & Cloud Engineer';
const description =
  'DevOps & Cloud Engineer and solo SaaS founder, endlessly curious about how things are built. 5+ years across Azure, AWS and GCP, two live products shipped end-to-end — and an explorer who loves travel, greenery and good design.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'Saicharan Duduka',
    'Charan Duduka',
    'DevOps Engineer',
    'Cloud Engineer',
    'SaaS Founder',
    'Azure',
    'AWS',
    'GCP',
    'Terraform',
    'Kubernetes',
  ],
  authors: [{ name: 'Saicharan Duduka' }],
  creator: 'Saicharan Duduka',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Charan · Field Notes',
    title,
    description,
    images: [
      {
        url: '/photos/hero-horizon.jpg',
        width: 1920,
        height: 1280,
        alt: 'A winding path leading toward distant hills at golden hour.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/photos/hero-horizon.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#04342C',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Fixed living backdrop — drifting valley light + grain, behind all content. */}
        <div className="ambient" aria-hidden="true">
          <div className="ambient-aurora">
            <span />
          </div>
          <div className="ambient-contours">
            <ContourField />
          </div>
          <div className="ambient-grain" />
          <div className="ambient-vignette" />
        </div>

        <ScrollProgress />
        <PathRail />
        <CursorGlow />
        <SoundToggle />
        {children}
      </body>
    </html>
  );
}
