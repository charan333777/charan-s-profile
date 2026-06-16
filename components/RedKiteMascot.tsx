type RedKiteMascotProps = {
  className?: string;
};

export default function RedKiteMascot({ className = '' }: RedKiteMascotProps) {
  return (
    <div
      className={`kite-mascot pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 160"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kite-wing-left" x1="14" y1="28" x2="101" y2="104">
            <stop stopColor="#FAEEDA" />
            <stop offset="0.46" stopColor="#EF9F27" />
            <stop offset="1" stopColor="#1D9E75" />
          </linearGradient>
          <linearGradient id="kite-wing-right" x1="206" y1="28" x2="119" y2="104">
            <stop stopColor="#FAEEDA" />
            <stop offset="0.46" stopColor="#EF9F27" />
            <stop offset="1" stopColor="#1D9E75" />
          </linearGradient>
          <linearGradient id="kite-body" x1="89" y1="48" x2="132" y2="125">
            <stop stopColor="#FAEEDA" />
            <stop offset="0.56" stopColor="#EF9F27" />
            <stop offset="1" stopColor="#0A3B2E" />
          </linearGradient>
        </defs>

        <path
          className="kite-wing-left"
          d="M102 76C77 44 39 28 14 39c17 12 29 28 38 48 13 4 28 8 50-11Z"
          fill="url(#kite-wing-left)"
        />
        <path
          className="kite-wing-right"
          d="M118 76c25-32 63-48 88-37-17 12-29 28-38 48-13 4-28 8-50-11Z"
          fill="url(#kite-wing-right)"
        />
        <path
          d="M24 41c15 4 31 16 47 35M196 41c-15 4-31 16-47 35"
          stroke="rgba(4,52,44,0.35)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M96 99 88 142l22-17 22 17-8-43H96Z"
          fill="#EF9F27"
          stroke="rgba(4,52,44,0.25)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <ellipse
          cx="110"
          cy="82"
          rx="25"
          ry="34"
          fill="url(#kite-body)"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
        />
        <circle cx="121" cy="56" r="18" fill="#FAEEDA" />
        <path
          d="M135 57 153 51l-13 13"
          fill="#EF9F27"
          stroke="rgba(4,52,44,0.25)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="126" cy="52" r="2.8" fill="#04342C" />
        <path
          d="M121 62c4 4 9 4 13 0"
          stroke="#04342C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="115" cy="60" r="4" fill="rgba(239,159,39,0.35)" />

        <path
          d="M58 25c8-7 18-7 26 0M151 23c8-7 18-7 26 0"
          stroke="rgba(225,245,238,0.62)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
