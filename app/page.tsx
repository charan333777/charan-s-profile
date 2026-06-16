import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import UnderTheOak from '@/components/UnderTheOak';
import ThePath from '@/components/ThePath';
import GrownHere from '@/components/GrownHere';
import TheOpenView from '@/components/TheOpenView';
import Footer from '@/components/Footer';
import HillDivider from '@/components/HillDivider';

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:font-medium focus:text-deep-green"
      >
        Skip to content
      </a>

      <span id="top" aria-hidden="true" className="absolute top-0" />

      <Nav />

      <main id="main">
        <Hero />
        <UnderTheOak />
        <HillDivider />
        <ThePath />
        <HillDivider flip />
        <GrownHere />
        <TheOpenView />
      </main>

      <Footer />
    </>
  );
}
