type Props = {
  /** Mirror the ridgelines so repeated dividers don't look identical. */
  flip?: boolean;
  className?: string;
};

/**
 * Atmospheric valley ridgelines that sit between sections — layered
 * silhouettes with mist-lit tops, feathered top+bottom (via mask) so they
 * dissolve seamlessly into the descending gradient instead of cutting a hard
 * edge. Purely decorative, no motion (safe on reduced-motion).
 */
export default function HillDivider({ flip = false, className = '' }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative -my-px h-24 w-full overflow-hidden sm:h-36 ${className}`}
      style={{
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
        maskImage:
          'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
      }}
    >
      <svg
        className={`absolute inset-0 h-full w-full ${flip ? '-scale-x-100' : ''}`}
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* layered ridge fills — paler/hazier behind, darker in front */}
        <path
          d="M0,96 C240,56 480,112 720,90 C960,68 1200,110 1440,84 L1440,260 L0,260 Z"
          fill="#1c3d52"
          opacity="0.5"
        />
        <path
          d="M0,140 C240,104 480,160 720,134 C960,108 1200,156 1440,128 L1440,260 L0,260 Z"
          fill="#122d40"
          opacity="0.8"
        />
        <path
          d="M0,180 C240,150 480,198 720,172 C960,146 1200,192 1440,166 L1440,260 L0,260 Z"
          fill="#0c2030"
          opacity="0.95"
        />
        {/* mist catching each ridge edge */}
        <path
          d="M0,96 C240,56 480,112 720,90 C960,68 1200,110 1440,84"
          stroke="rgba(225,245,238,0.09)"
          strokeWidth="1.2"
        />
        <path
          d="M0,140 C240,104 480,160 720,134 C960,108 1200,156 1440,128"
          stroke="rgba(225,245,238,0.06)"
          strokeWidth="1.2"
        />
        <path
          d="M0,180 C240,150 480,198 720,172 C960,146 1200,192 1440,166"
          stroke="rgba(239,159,39,0.08)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
