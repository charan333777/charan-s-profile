'use client';

import Image from 'next/image';
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CONTACT } from '@/lib/data';
import { portraitPhoto } from '@/lib/images';
import { timeOfDay } from '@/lib/timeOfDay';
import { buildVCard } from '@/lib/vcard';
import ContourField from './ContourField';
import {
  ArrowUpRight,
  Check,
  Clock,
  Compass,
  Copy,
  GitHub,
  Instagram,
  Leaf,
  LinkedIn,
  Mail,
  MapPin,
  UserPlus,
} from './icons';

type ConnectLink = {
  href: string;
  label: string;
  platform: string;
  detail: string;
  icon: ReactNode;
  external?: boolean;
};

const CONNECT_LINKS: ConnectLink[] = [
  {
    href: CONTACT.linkedin.href,
    label: 'Work trail',
    platform: 'LinkedIn',
    detail: 'Professional hello',
    icon: <LinkedIn width={22} height={22} />,
    external: true,
  },
  {
    href: CONTACT.instagram.href,
    label: 'Lens trail',
    platform: 'Instagram',
    detail: 'Travel, greenery, and moments',
    icon: <Instagram width={22} height={22} />,
    external: true,
  },
  {
    href: `mailto:${CONTACT.email}?subject=${encodeURIComponent('Hello Charan')}`,
    label: 'Direct hello',
    platform: 'Email',
    detail: CONTACT.email,
    icon: <Mail width={22} height={22} />,
  },
  {
    href: CONTACT.github.href,
    label: 'Build log',
    platform: 'GitHub',
    detail: 'Projects and experiments',
    icon: <GitHub width={22} height={22} />,
    external: true,
  },
  {
    href: '/',
    label: 'Full map',
    platform: 'Portfolio',
    detail: 'Story, products, and path',
    icon: <Compass width={22} height={22} />,
  },
];

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];
const pad = (n: number) => String(n).padStart(2, '0');

export default function ConnectCard() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [passActive, setPassActive] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [fine, setFine] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [connectUrl, setConnectUrl] = useState('');

  // 3D tilt — the pass leans toward the cursor (fine pointers, motion allowed).
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 150, damping: 20, mass: 0.4 });
  const springY = useSpring(ry, { stiffness: 150, damping: 20, mass: 0.4 });
  const tiltOn = fine && !reduce;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const timer = window.setTimeout(() => setPassActive(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Live local clock — drives the phase label, dated pass № and stamp.
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Absolute URL of this pass — for the share QR + saved-contact link. Prefers
  // the canonical origin, falls back to the current one (matches the home QR).
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, '');
    setConnectUrl(`${base}/connect`);
  }, []);

  const tod = now ? timeOfDay(now) : null;
  const clock = now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : null;
  const passId = now
    ? `FP-${pad(now.getFullYear() % 100)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    : null;
  const stampDate = now
    ? `${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
    : '';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  const saveContact = () => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, '');
    const blob = new Blob([buildVCard(base)], { type: 'text/vcard;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'saicharan-duduka.vcf';
    a.click();
    URL.revokeObjectURL(href);
  };

  const onTilt = (e: PointerEvent<HTMLDivElement>) => {
    if (!tiltOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set((0.5 - (e.clientY - r.top) / r.height) * 9);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 11);
  };
  const onTiltLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const entrance = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } };

  return (
    <section
      aria-labelledby="connect-heading"
      className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-5 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
        animate={entrance}
        style={{ perspective: 1100 }}
      >
        <motion.div
          onPointerMove={onTilt}
          onPointerLeave={onTiltLeave}
          style={{ rotateX: springX, rotateY: springY }}
          className="glass aurora-border relative overflow-hidden p-6 sm:p-8"
        >
          <div
            className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-azure/20 blur-3xl"
            aria-hidden="true"
          />

          {/* Arrival scan-line — sweeps the pass once, like a reader catching the QR. */}
          {!reduce && (
            <motion.span
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-transparent via-mint/25 to-transparent"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: ['-100%', '820%'], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1, ease: 'easeInOut', times: [0, 0.5, 1] }}
              aria-hidden="true"
            />
          )}

          {/* "Access granted" stamp — thumps onto the pass after the scan. */}
          <motion.div
            className="pointer-events-none absolute right-3 top-3 z-20 select-none rounded-md border-2 border-amber/70 bg-deep-green/10 px-2.5 py-1 text-center shadow-[0_0_18px_rgba(239,159,39,0.18)]"
            initial={reduce ? { opacity: 1, scale: 1, rotate: -9 } : { opacity: 0, scale: 1.9, rotate: -22 }}
            animate={passActive ? { opacity: 1, scale: 1, rotate: -9 } : undefined}
            transition={{ delay: reduce ? 0 : 1.05, type: 'spring', stiffness: 340, damping: 13 }}
            aria-hidden="true"
          >
            <span className="block font-mono text-[0.62rem] font-bold uppercase tracking-[0.24em] text-amber">
              Access granted
            </span>
            <span className="mt-0.5 block font-mono text-[0.5rem] uppercase tracking-[0.18em] text-amber/70">
              {stampDate || 'Field pass'}
            </span>
          </motion.div>

          <div className="relative flex flex-wrap items-center gap-2.5">
            <span className="glass-chip inline-flex items-center gap-2 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-white/85">
              <Leaf width={14} height={14} className="text-leaf" />
              QR field pass
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mint">
              <Clock width={13} height={13} className="text-amber" />
              {clock ? `${clock} · ${tod?.label}` : 'Local time'}
            </span>
          </div>

          <div
            className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/10"
            aria-hidden="true"
          >
            <motion.span
              className="block h-full rounded-full bg-gradient-to-r from-leaf via-mint to-amber"
              initial={{ width: '18%' }}
              animate={{ width: passActive ? '100%' : '34%' }}
              transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
            />
          </div>

          <div className="relative mt-7 flex flex-col gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-start">
            <button
              type="button"
              onClick={() => setNoteOpen((open) => !open)}
              aria-label="Show a quick note from Charan"
              aria-expanded={noteOpen}
              className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/35 bg-white/10 shadow-glass-lit transition-[transform,border-color,box-shadow] duration-300 ease-grow hover:-translate-y-0.5 hover:border-amber/55 hover:shadow-[0_8px_32px_rgba(4,52,44,0.18),0_0_24px_rgba(239,159,39,0.26)] sm:h-32 sm:w-32"
            >
              <Image
                src={portraitPhoto}
                alt="Saicharan Duduka smiling near the water."
                fill
                priority
                placeholder="blur"
                sizes="128px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-deep-green/70 py-1 text-center font-mono text-[0.56rem] uppercase tracking-[0.16em] text-white/78 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Hello
              </span>
            </button>

            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber">
                Founder · Builder · Explorer
              </p>
              <h1
                id="connect-heading"
                className="mt-2 font-display text-4xl font-semibold leading-none text-gradient text-shimmer sm:text-5xl"
              >
                Charan
              </h1>
              <p className="mt-3 max-w-sm text-base leading-7 text-white/78">
                A quick hello from the Thames Valley. Choose the trail that fits the moment.
              </p>
            </div>
          </div>

          {noteOpen && (
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-5 rounded-2xl border border-white/14 bg-white/[0.08] px-4 py-3 text-sm leading-6 text-white/72"
            >
              Currently building CVMindAI, collecting good views, and saying yes to interesting
              conversations.
            </motion.p>
          )}

          <div className="relative mt-6 flex flex-wrap gap-2">
            {['Builder', 'Founder', 'Explorer', 'Thames Valley'].map((note) => (
              <span
                key={note}
                className="rounded-full border border-white/14 bg-white/[0.08] px-3 py-1 text-xs text-white/70"
              >
                {note}
              </span>
            ))}
          </div>

          <div className="relative mt-7 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveContact}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-amber px-5 py-3 text-sm font-semibold text-deep-green shadow-glass-lit transition-[transform,background-color,box-shadow] duration-300 ease-grow hover:-translate-y-0.5 hover:bg-amber/90 hover:shadow-[0_8px_32px_rgba(4,52,44,0.18),0_0_30px_rgba(239,159,39,0.38)] active:translate-y-0"
              >
                <UserPlus width={18} height={18} />
                Save contact
              </button>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white/86 shadow-glass-lit transition-[transform,background-color,border-color] duration-300 ease-grow hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.18] active:translate-y-0"
                aria-live="polite"
              >
                {copied ? <Check width={18} height={18} className="text-mint" /> : <Copy width={18} height={18} />}
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </div>
            <a
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white/78 transition-[transform,background-color,border-color] duration-300 ease-grow hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12] active:translate-y-0"
            >
              Full portfolio
              <ArrowUpRight width={17} height={17} />
            </a>
          </div>

          {/* Field-pass meta — dated pass № and the Thames Valley coordinates. */}
          <div className="relative mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/55">
            <span className="text-amber/75">PASS №{passId ?? '········'}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin width={12} height={12} className="text-mint/70" />
              51.51°N 0.92°W
            </span>
            <span aria-hidden="true">·</span>
            <span>Thames Valley · UK</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.nav
        aria-label="Connect links"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
        animate={
          reduce
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 120, damping: 18, delay: 0.08 },
              }
        }
        className="glass-flat-dark hairline-top relative overflow-hidden rounded-[20px] border border-white/15"
      >
        {/* Trail-map texture — a faint valley contour behind the link list. */}
        <div
          className="pointer-events-none absolute inset-0 text-mint opacity-[0.06] [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          <ContourField />
        </div>

        <div className="relative flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <p className="font-display text-xl font-semibold text-white">Choose your trail</p>
            <p className="mt-1 text-sm text-white/58">Fast, friendly, no phone number.</p>
          </div>
          {/* Compass rose — points the way down the trails. */}
          <span
            className="relative hidden h-12 w-12 shrink-0 items-center justify-center sm:inline-flex"
            aria-hidden="true"
          >
            <span className="absolute inset-0 rounded-full border border-amber/30 bg-amber/[0.06]" />
            <svg viewBox="0 0 48 48" className="h-11 w-11">
              <g fill="none" stroke="currentColor" className="text-mint/45" strokeWidth="1">
                <circle cx="24" cy="24" r="17" />
                <path d="M24 7v6M24 35v6M7 24h6M35 24h6" strokeLinecap="round" />
              </g>
              <path d="M24 11 27 24 24 22 21 24z" className="fill-amber" />
              <path d="M24 37 21 24 24 26 27 24z" className="fill-mint/55" />
              <text
                x="24"
                y="6"
                textAnchor="middle"
                className="fill-amber font-mono"
                fontSize="5"
                letterSpacing="0.5"
              >
                N
              </text>
            </svg>
          </span>
        </div>

        <ul className="relative divide-y divide-white/10">
          {CONNECT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="group grid min-h-[78px] grid-cols-[44px_minmax(0,1fr)_24px] items-center gap-4 px-5 py-4 transition-colors duration-300 hover:bg-white/[0.08] focus-visible:bg-white/[0.08] sm:px-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-mint transition-colors duration-300 group-hover:border-amber/45 group-hover:text-amber">
                  {link.icon}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-display text-lg font-semibold leading-tight text-white">
                      {link.label}
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber/85">
                      {link.platform}
                    </span>
                  </span>
                  <span className="mt-1 block break-words text-sm leading-5 text-white/60">
                    {link.detail}
                  </span>
                </span>
                <ArrowUpRight
                  width={20}
                  height={20}
                  className="text-white/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Share QR — show your screen for someone to scan this pass in person. */}
        <div className="relative flex items-center gap-4 border-t border-white/10 px-5 py-4 sm:px-6">
          <div className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-xl border border-white/25 bg-stone p-1.5 shadow-glass-lit">
            {connectUrl ? (
              <QRCodeSVG
                value={connectUrl}
                size={56}
                bgColor="transparent"
                fgColor="#0F2A33"
                level="M"
                marginSize={0}
                aria-label="QR code to open this field pass"
              />
            ) : (
              <span className="h-[56px] w-[56px] animate-pulse rounded bg-deep-green/15" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-white">Scan to share this pass</p>
            <p className="mt-0.5 text-xs leading-5 text-white/55">
              Point a camera here to open it on another phone.
            </p>
          </div>
        </div>
      </motion.nav>
    </section>
  );
}
