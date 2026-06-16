import type { ReactNode } from 'react';

type Props = {
  kicker: string;
  title: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({ kicker, title, align = 'left', className = '' }: Props) {
  return (
    <div className={[align === 'center' ? 'text-center' : '', className].join(' ')}>
      <span
        className={[
          'inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-leaf',
          align === 'center' ? 'justify-center' : '',
        ].join(' ')}
      >
        <span className="h-px w-8 bg-gradient-to-r from-leaf to-transparent" aria-hidden="true" />
        {kicker}
      </span>
      <h2 className="mt-3 font-display text-section font-semibold text-white [text-wrap:balance] [text-shadow:0_2px_30px_rgba(4,52,44,0.5)]">
        {title}
      </h2>
    </div>
  );
}
