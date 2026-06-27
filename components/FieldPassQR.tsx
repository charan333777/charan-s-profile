'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowUpRight, Check, Download, QrCode } from './icons';

/**
 * The actual field-pass QR. Encodes the absolute `/connect` URL so a scan opens
 * the live contact page. The URL self-resolves: it prefers NEXT_PUBLIC_SITE_URL
 * (the canonical deployed origin) and falls back to the current origin, so the
 * code is always correct for wherever the site is served. Computed after mount
 * to keep server/client markup identical (no hydration mismatch).
 */
export default function FieldPassQR() {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, '');
    setUrl(`${base}/connect`);
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const downloadSvg = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: 'image/svg+xml',
    });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'charan-field-pass-qr.svg';
    a.click();
    URL.revokeObjectURL(href);
    setSaved(true);
  };

  return (
    <div className="mt-7 border-t border-white/10 pt-6">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mint/75">
        Field pass · scan or tap
      </p>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Scannable QR — dark modules on a bright card for reliable scanning. */}
        <div
          ref={qrRef}
          className="relative grid h-[116px] w-[116px] shrink-0 place-items-center rounded-2xl border border-white/25 bg-stone p-2.5 shadow-glass-lit"
        >
          {url ? (
            <QRCodeSVG
              value={url}
              size={96}
              bgColor="transparent"
              fgColor="#0F2A33"
              level="M"
              marginSize={0}
              aria-label="QR code linking to Charan's contact page"
            />
          ) : (
            <span className="h-[96px] w-[96px] animate-pulse rounded-lg bg-deep-green/15" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-6 text-white/80">
            A quick QR field pass — links, photo, and a direct hello, with a sky
            that shifts to the time you land.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href="/connect"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-deep-green shadow-glass-lit transition-[transform,background-color,box-shadow] duration-300 ease-grow hover:-translate-y-0.5 hover:bg-amber/90 hover:shadow-[0_0_26px_rgba(239,159,39,0.42)]"
            >
              <QrCode width={17} height={17} />
              Open field pass
              <ArrowUpRight width={16} height={16} />
            </a>
            <button
              type="button"
              onClick={downloadSvg}
              disabled={!url}
              aria-label={saved ? 'QR code downloaded' : 'Download QR code'}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/86 shadow-glass-lit transition-[transform,background-color,border-color] duration-300 ease-grow hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.18] disabled:opacity-50"
            >
              {saved ? <Check width={16} height={16} className="text-mint" /> : <Download width={16} height={16} />}
              {saved ? 'Saved' : 'Download QR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
