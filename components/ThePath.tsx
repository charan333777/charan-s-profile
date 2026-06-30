'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useInView,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { TIMELINE, type Milestone } from '@/lib/data';
import { Reveal } from './motion';
import SectionHeading from './SectionHeading';
import SpotlightCard from './SpotlightCard';
import MilestoneModal from './MilestoneModal';
import { footsteps } from './soundEngine';
import dynamic from 'next/dynamic';

/** Lazy-loaded 3D mountain finale (Three.js — client only, code-split). */
const Mountain3D = dynamic(() => import('./Mountain3D'), { ssr: false });

/** Accent colour per milestone, drawn from its dominant cloud platform. */
type Accent = { color: string; glow: string };
function accentFor(m: Milestone): Accent {
  const t = [m.org, m.role, ...m.tags].join(' ').toLowerCase();
  if (m.now || t.includes('openai') || t.includes('next') || t.includes('stripe'))
    return { color: '#EF9F27', glow: 'rgba(239,159,39,0.85)' }; // founder amber
  if (t.includes('aws') || t.includes('cloudformation'))
    return { color: '#F59E0B', glow: 'rgba(245,158,11,0.8)' }; // AWS orange
  if (t.includes('azure'))
    return { color: '#5FA0E6', glow: 'rgba(95,160,230,0.8)' }; // Azure blue
  if (t.includes('gcp'))
    return { color: '#34A853', glow: 'rgba(52,168,83,0.8)' }; // GCP green
  return { color: '#1D9E75', glow: 'rgba(29,158,117,0.8)' }; // leaf
}

/**
 * Trail node that stays dim until the descending path reaches it, then
 * "ignites" in its platform colour. Tagged with data-trail-node so the parent
 * can measure its centre and thread the winding path through it.
 */
/**
 * Trail node that ignites when reached. Its "energy" escalates down the
 * timeline (index 0 = quiet slow breath → last/now = confident fast pulse),
 * so the eye is drawn ever downward toward the finale.
 */
function NodeDot({
  now,
  accent,
  index,
  total,
}: {
  now?: boolean;
  accent: Accent;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -45% 0px' });
  const lit = inView || reduce;

  // Energy 0..1 — rises with position, maxed on the current ("now") role.
  const e = now ? 1 : total > 1 ? index / (total - 1) : 0;
  const amp = 0.04 + e * 0.12; // breathing scale amplitude
  const dur = 4.8 - e * 2.3; // faster = more energetic
  const gLo = 8 + e * 8;
  const gHi = gLo + 8 + e * 16;
  const shadow = (g: number) =>
    `0 0 0 5px rgba(4,52,44,0.55), 0 0 ${g}px ${accent.glow}`;

  return (
    <span
      ref={ref}
      data-trail-node
      className="absolute left-5 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
      aria-hidden="true"
    >
      {/* escalating halo ring — stronger and quicker further down */}
      {lit && !reduce && (
        <motion.span
          className="absolute inset-0 -m-1 rounded-full"
          style={{ backgroundColor: accent.color }}
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 2 + e * 0.7], opacity: [0.1 + e * 0.4, 0] }}
          transition={{ duration: 3 - e, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <motion.span
        initial={false}
        animate={
          lit
            ? reduce
              ? { scale: 1, opacity: 1, boxShadow: shadow(gHi) }
              : {
                  scale: [1, 1 + amp, 1],
                  opacity: 1,
                  boxShadow: [shadow(gLo), shadow(gHi), shadow(gLo)],
                }
            : { scale: 0.55, opacity: 0.5 }
        }
        transition={
          lit && !reduce
            ? { duration: dur, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 320, damping: 17 }
        }
        className="relative block h-4 w-4 rounded-full border-2"
        style={
          lit
            ? { backgroundColor: accent.color, borderColor: accent.color }
            : {
                backgroundColor: '#04342C',
                borderColor: 'rgba(255,255,255,0.5)',
                boxShadow: '0 0 0 5px rgba(4,52,44,0.55)',
              }
        }
      />
    </span>
  );
}

function MilestoneCard({
  m,
  index,
  accent,
  onOpen,
}: {
  m: Milestone;
  index: number;
  accent: Accent;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const position =
    m.side === 'left'
      ? 'md:col-start-1 md:ml-auto md:mr-0'
      : 'md:col-start-2 md:mr-auto md:ml-0';
  const fromX = reduce ? 0 : m.side === 'left' ? -44 : 44;

  return (
    <motion.div
      className={`md:max-w-md ${position}`}
      initial={{ opacity: 0, x: fromX, y: reduce ? 0 : 14 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ type: 'spring', stiffness: 130, damping: 18, mass: 0.7 }}
      onClick={onOpen}
    >
      <SpotlightCard
        as="article"
        className={[
          'group glass-flat-dark hairline-top cursor-pointer p-6 pl-7 sm:p-7 sm:pl-8 transition-colors duration-300 hover:border-white/30',
          m.now ? 'ring-1 ring-amber/50' : '',
        ].join(' ')}
      >
        {/* platform-coloured chapter spine */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 left-0 top-5 w-[3px] rounded-full"
          style={{ backgroundColor: accent.color, opacity: 0.7 }}
        />
        {/* faint chapter number, tinted to the chapter colour */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-2 font-display text-5xl font-bold leading-none"
          style={{ color: accent.color, opacity: 0.14 }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-mint/80">
          {m.period}
          {m.now && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2 py-0.5 text-[0.65rem] font-medium text-amber ring-1 ring-amber/40">
              Now
            </span>
          )}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-white">
          {m.org}
        </h3>
        <p className="mt-0.5 text-sm text-white/70">{m.role}</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-white/85">{m.blurb}</p>

        {m.metric && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 font-mono text-sm font-medium text-amber ring-1 ring-amber/30">
            {m.metric}
          </p>
        )}

        <ul className="mt-4 flex flex-wrap gap-2">
          {m.tags.map((tag) => (
            <li
              key={tag}
              className="glass-chip px-3 py-1 font-mono text-xs text-white/80"
            >
              {tag}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label={`View details for ${m.role} at ${m.org}`}
          className="group/btn mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white focus-visible:text-white"
        >
          View details
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover/btn:translate-x-0.5"
            style={{ color: accent.color }}
          >
            →
          </span>
        </button>
      </SpotlightCard>
    </motion.div>
  );
}

/** Build a smooth winding path (cubic beziers) threaded through node centres. */
function buildPath(
  pts: Array<{ x: number; y: number }>,
  baseX: number,
  height: number,
  amp: number,
  dirs: number[],
): string {
  // Add straight-ish head and tail caps on the rail axis.
  const all = [{ x: baseX, y: 0 }, ...pts, { x: baseX, y: height }];
  let d = `M ${all[0].x.toFixed(1)} ${all[0].y.toFixed(1)}`;
  for (let i = 0; i < all.length - 1; i++) {
    const a = all[i];
    const b = all[i + 1];
    const dy = b.y - a.y;
    // direction of bow for this segment (caps reuse nearest node's direction)
    const dir =
      i === 0 ? dirs[0] ?? 1 : i > pts.length ? dirs[pts.length - 1] ?? 1 : dirs[i - 1] ?? 1;
    const off = amp * dir;
    const c1x = a.x + off;
    const c1y = a.y + dy * 0.42;
    const c2x = b.x + off;
    const c2y = b.y - dy * 0.42;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

type FP = {
  x: number;
  y: number;
  angle: number;
  t: number;
  side: 1 | -1;
  color: string;
};

const CLAY = '#C76B43';
const AMBER = '#EF9F27';

/** One footprint that presses into the trail as the fill sweeps past it. */
function Footprint({
  fp,
  fill,
  reduce,
}: {
  fp: FP;
  fill: MotionValue<number>;
  reduce: boolean;
}) {
  // Prints live near the walking point: fade in as the tip arrives, then fade
  // out behind it. The visible "comet" of prints travels with the scroll in
  // both directions instead of accumulating into a permanent trail.
  const opacity = useTransform(
    fill,
    [fp.t - 0.06, fp.t - 0.01, fp.t + 0.012, fp.t + 0.1],
    [0, 0.85, 0.85, 0],
  );
  const scale = useTransform(
    fill,
    [fp.t - 0.06, fp.t - 0.01, fp.t + 0.1],
    [0.5, 1, 0.9],
  );
  return (
    <div
      className="absolute"
      style={{
        left: fp.x,
        top: fp.y,
        transform: `translate(-50%, -50%) rotate(${fp.angle + 90}deg)`,
      }}
    >
      <motion.div style={reduce ? { opacity: 0.5 } : { opacity, scale }}>
        {/* lateral offset + mirror so left/right prints straddle the path */}
        <div style={{ transform: `translateX(${fp.side * 6}px) scaleX(${fp.side})` }}>
          <svg
            width="15"
            height="20"
            viewBox="0 0 15 20"
            fill={fp.color}
            aria-hidden="true"
            style={{ filter: `drop-shadow(0 0 5px ${fp.color}aa)`, display: 'block' }}
          >
            <ellipse cx="7.5" cy="13" rx="4.5" ry="6" fillOpacity="0.92" />
            <circle cx="4.2" cy="5" r="1.4" fillOpacity="0.92" />
            <circle cx="7.5" cy="3.4" r="1.7" fillOpacity="0.92" />
            <circle cx="10.8" cy="5" r="1.3" fillOpacity="0.92" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * The trail's destination. The footpath ends in a glowing amber beacon and the
 * red kite lifts off into a warm horizon — "onto something big". Sits on the
 * rail axis (left on mobile, centre on desktop) in the space below the last card.
 */
function TrailEnd() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const show = inView || reduce;

  return (
    <div
      ref={ref}
      className="pointer-events-none relative h-[300px] md:h-[340px]"
      aria-hidden="true"
    >
      {/* warm golden-hour sky glow behind the peak */}
      <span
        className="absolute left-1/2 top-[150px] -z-10 block h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(239,159,39,0.22), rgba(239,159,39,0.05) 52%, transparent 70%)',
        }}
      />

      {/* the rotatable low-poly mountain that crowns the trail */}
      <div className="absolute left-1/2 top-8 h-[260px] w-[300px] -translate-x-1/2 md:h-[290px] md:w-[360px]">
        <motion.div
          className="h-full w-full"
          initial={false}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {show && (
            <div className="pointer-events-auto h-full w-full">
              <Mountain3D reduce={!!reduce} />
            </div>
          )}
        </motion.div>
      </div>

      {/* the kite, soaring above the summit */}
      <span
        className="absolute left-1/2 top-2 block -translate-x-1/2"
        style={{ color: AMBER }}
      >
        <motion.span
          className="block"
          initial={false}
          animate={
            show
              ? reduce
                ? { opacity: 0.95, y: 0 }
                : { opacity: 0.95, y: [0, -14, 0], rotate: [-5, 5, -5] }
              : { opacity: 0, y: 12 }
          }
          transition={
            reduce
              ? { duration: 0.7 }
              : {
                  opacity: { duration: 0.7 },
                  y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <svg
            width="58"
            height="42"
            viewBox="0 0 210 150"
            fill="currentColor"
            style={{ filter: 'drop-shadow(0 0 10px rgba(239,159,39,0.7))' }}
          >
            <path d="M102 76C77 44 39 28 14 39c17 12 29 28 38 48 13 4 28 8 50-11Z" />
            <path d="M118 76c25-32 63-48 88-37-17 12-29 28-38 48-13 4-28 8-50-11Z" />
            <path d="M96 99 88 142l22-17 22 17-8-43H96Z" />
          </svg>
        </motion.span>
      </span>
    </div>
  );
}

export default function ThePath() {
  const trailRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: trailRef,
    offset: ['start 78%', 'end 55%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 });

  // Measured geometry → winding SVG path.
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const drawPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const c = trailRef.current;
    if (!c) return;

    const measure = () => {
      const crect = c.getBoundingClientRect();
      const nodes = Array.from(
        c.querySelectorAll<HTMLElement>('[data-trail-node]'),
      );
      if (nodes.length === 0) return;
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - crect.left,
          y: r.top + r.height / 2 - crect.top,
        };
      });
      const w = c.clientWidth;
      const h = c.clientHeight;
      const baseX = pts[0].x;
      const centered = baseX > w * 0.35; // desktop centre rail vs mobile left rail
      const amp = centered ? Math.min(70, w * 0.08) : 14;
      const dirs = TIMELINE.map((m) =>
        centered ? (m.side === 'left' ? -1 : 1) : 1,
      );
      setGeo({ w, h, d: buildPath(pts, baseX, h, amp, dirs) });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    window.addEventListener('resize', measure);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      (document as Document).fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Sample footprints along the measured path; reveal + sound follow `fill`.
  const [footprints, setFootprints] = useState<FP[]>([]);
  const fpRef = useRef<FP[]>([]);
  fpRef.current = footprints;

  useEffect(() => {
    const p = drawPathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    if (len === 0) return;
    const n = Math.max(10, Math.min(30, Math.round(len / 64)));
    const fps: FP[] = [];
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const s = t * len;
      const pt = p.getPointAtLength(s);
      const a = p.getPointAtLength(Math.max(0, s - 6));
      const b = p.getPointAtLength(Math.min(len, s + 6));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      fps.push({
        x: pt.x,
        y: pt.y,
        angle,
        t,
        side: i % 2 === 0 ? 1 : -1,
        color: t > 0.55 ? AMBER : CLAY,
      });
    }
    setFootprints(fps);
  }, [geo]);

  // One footfall as the fill crosses each print (forward scroll only).
  const prevFill = useRef(0);
  useMotionValueEvent(fill, 'change', (v) => {
    if (reduce) return;
    const prev = prevFill.current;
    prevFill.current = v;
    if (v <= prev) return;
    for (const fp of fpRef.current) {
      if (fp.t > prev && fp.t <= v) {
        footsteps.step();
        break;
      }
    }
  });

  const drawProgress = useTransform(fill, (v) => v);

  return (
    <section id="path" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading kicker="02 · The route so far" title="Where I’ve been" />
        </Reveal>

        <div ref={trailRef} className="relative mt-14">
          {/* Winding footpath through every milestone. */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {!geo && (
              // Fallback straight rail until geometry is measured (matches SSR).
              <div className="absolute bottom-0 top-0 left-[4.25rem] w-10 -translate-x-1/2 md:left-1/2">
                <span className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-white/10" />
              </div>
            )}

            {geo && (
              <svg
                className="absolute inset-0"
                width={geo.w}
                height={geo.h}
                viewBox={`0 0 ${geo.w} ${geo.h}`}
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="trailGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={geo.h}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#1D9E75" />
                    <stop offset="0.55" stopColor="#1D9E75" />
                    <stop offset="1" stopColor="#EF9F27" />
                  </linearGradient>
                </defs>
                {/* dashed guide trail */}
                <path
                  d={geo.d}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="2"
                  strokeDasharray="2 8"
                  strokeLinecap="round"
                />
                {/* bright drawn trail, revealed by scroll */}
                <motion.path
                  ref={drawPathRef}
                  d={geo.d}
                  stroke="url(#trailGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    pathLength: reduce ? 1 : drawProgress,
                    filter: 'drop-shadow(0 0 6px rgba(29,158,117,0.55))',
                  }}
                />
              </svg>
            )}

            {/* Footsteps press into the trail as it fills — the walker, implied. */}
            {geo &&
              footprints.map((fp, i) => (
                <Footprint key={i} fp={fp} fill={fill} reduce={!!reduce} />
              ))}
          </div>

          <ol className="relative space-y-12 pb-24 pl-12 md:space-y-20 md:pb-28 md:pl-0">
            {TIMELINE.map((m, i) => {
              const accent = accentFor(m);
              return (
                <li
                  key={`${m.org}-${m.period}`}
                  className="relative grid items-center md:grid-cols-2 md:gap-x-16"
                >
                  <NodeDot
                    now={m.now}
                    accent={accent}
                    index={i}
                    total={TIMELINE.length}
                  />
                  <MilestoneCard
                    m={m}
                    index={i}
                    accent={accent}
                    onOpen={() => setOpenIndex(i)}
                  />
                </li>
              );
            })}
          </ol>
        </div>

        <TrailEnd />
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <MilestoneModal
            m={TIMELINE[openIndex]}
            index={openIndex}
            accent={accentFor(TIMELINE[openIndex])}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
