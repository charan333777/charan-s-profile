'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Hairline reading-progress bar pinned to the very top edge — fills
 * leaf → mint → amber as you descend the valley. Spring-smoothed so it
 * glides rather than jumps. Decorative; sits above the page, below modals.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-gradient-to-r from-leaf via-mint to-amber shadow-[0_0_12px_rgba(29,158,117,0.6)]"
    />
  );
}
