import { Leaf } from './icons';

export default function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-4 sm:px-8">
      <div className="glass-flat hairline-top mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-4 text-sm text-white/70 sm:flex-row">
        <p className="flex items-center gap-2">
          <Leaf width={16} height={16} className="text-leaf [filter:drop-shadow(0_0_6px_rgba(29,158,117,0.7))]" />
          © 2026 Charan
        </p>
        <p className="text-white/70">Built with curiosity · always exploring.</p>
        <a
          href="#top"
          className="rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
