'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { footsteps } from './soundEngine';
import { Volume, VolumeOff } from './icons';

/**
 * Floating, off-by-default toggle for the synthesized footstep sounds on the
 * path. Reveals after the hero so it never clutters the opening. Uses the
 * blur-free `.glass-flat` so it stays out of the backdrop-blur budget.
 */
export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 480;
    setShown(y > threshold);
  });

  useEffect(() => footsteps.subscribe(setEnabled), []);

  return (
    <motion.button
      type="button"
      data-sound-toggle
      onClick={() => footsteps.toggle()}
      aria-pressed={enabled}
      aria-label={enabled ? 'Mute ambient sound' : 'Enable ambient sound'}
      title={enabled ? 'Sound on — wind & footsteps' : 'Walk the path with wind & footsteps'}
      initial={false}
      animate={{
        opacity: shown ? 1 : 0,
        scale: shown ? 1 : 0.8,
        y: shown ? 0 : 14,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ pointerEvents: shown ? 'auto' : 'none' }}
      className="glass-flat fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-colors duration-300 hover:text-white"
    >
      <span className="relative inline-flex">
        {enabled ? <Volume width={19} height={19} /> : <VolumeOff width={19} height={19} />}
        {enabled && (
          <motion.span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 h-1.5 w-1.5 rounded-full bg-leaf"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </span>
    </motion.button>
  );
}
