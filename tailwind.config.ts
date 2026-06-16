import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // "Field Notes" explorer palette — golden hour on the road.
        // Twilight base, warm golden/terracotta accents, travel-teal, and
        // green kept only as a greenery accent (no longer the dominant colour).
        // (Token names kept stable to avoid churn; values are the new palette.)
        'deep-green': '#0F2A33', // deep twilight teal — base / dark panels
        'leaf': '#36A98C', // jade — greenery accent (used sparingly)
        'mint': '#E7EFE8', // soft warm light — muted text / fine lines
        'sky': '#A9CCE6', // pale travel sky
        'deep-blue': '#123C5E', // depth / water
        'stone': '#F2E3C7', // warm sand / paper / stone
        'amber': '#EF9F27', // golden hour — primary warm accent
        'clay': '#C76B43', // terracotta — architecture / earth warmth
        'azure': '#4FA3C7', // brighter travel teal-blue accent
      },
      fontFamily: {
        // Wired to next/font CSS variables defined in app/layout.tsx.
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Oversized fluid hero type.
        hero: ['clamp(3rem, 9vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        section: ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.0', letterSpacing: '-0.015em' }],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(4,52,44,0.18)',
        'glass-lit':
          '0 8px 32px rgba(4,52,44,0.18), inset 0 1px 0 rgba(255,255,255,0.35)',
        'glass-dark-lit':
          '0 8px 32px rgba(4,52,44,0.30), inset 0 1px 0 rgba(255,255,255,0.22)',
      },
      borderRadius: {
        glass: '20px',
      },
      transitionTimingFunction: {
        grow: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        // CSS-only floating leaf drift (hero particles).
        leafdrift: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.5' },
          '100%': {
            transform: 'translate3d(var(--lx, 40px), 110vh, 0) rotate(320deg)',
            opacity: '0',
          },
        },
        sway: {
          '0%,100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(var(--sway, 18px))' },
        },
      },
      animation: {
        leafdrift: 'leafdrift var(--dur, 16s) linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
