import type { Metadata } from 'next';
import Image from 'next/image';
import ConnectCard from '@/components/ConnectCard';
import LeafParticles from '@/components/LeafParticles';
import FieldPassAtmosphere from '@/components/FieldPassAtmosphere';
import { heroPhoto } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Connect with Charan',
  description: 'A quick QR field pass for Charan: links, photos, work, and a direct hello.',
  alternates: { canonical: '/connect' },
  openGraph: {
    title: 'Connect with Charan',
    description: 'A quick QR field pass for Charan.',
    url: '/connect',
    images: [
      {
        url: '/photos/charan-portrait.jpg',
        width: 1080,
        height: 1350,
        alt: 'Saicharan Duduka smiling near the water.',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Connect with Charan',
    description: 'A quick QR field pass for Charan.',
    images: ['/photos/charan-portrait.jpg'],
  },
};

export default function ConnectPage() {
  return (
    <main className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <Image
        src={heroPhoto}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover opacity-35 saturate-[1.15]"
      />
      <FieldPassAtmosphere />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:68px_68px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 opacity-55">
        <LeafParticles />
      </div>

      <ConnectCard />
    </main>
  );
}
