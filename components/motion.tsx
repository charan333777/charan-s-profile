'use client';

import { motion, useReducedMotion, type Variants, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared motion language: sections "grow" into view (opacity + gentle rise +
 * scale settle) on a spring — organic, never a linear slide. With reduced
 * motion we keep a plain fade.
 */
const SPRING: Transition = { type: 'spring', stiffness: 130, damping: 18, mass: 0.7 };

const grow = (reduce: boolean | null, delay = 0): Variants =>
  reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35, delay } },
      }
    : {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { ...SPRING, delay } },
      };

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

// Stable motion components (creating them per-render would remount the tree).
const TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  p: motion.p,
  article: motion.article,
  h2: motion.h2,
} as const;

type Tag = keyof typeof TAGS;

type Props = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  id?: string;
};

/** Single element that grows into view once. */
export function Reveal({ children, className, as = 'div', delay = 0, id }: Props) {
  const reduce = useReducedMotion();
  const MotionTag = TAGS[as];
  return (
    <MotionTag
      id={id}
      className={className}
      variants={grow(reduce, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers its <StaggerItem> children by 60ms. */
export function Stagger({ children, className, as = 'div', id }: Props) {
  const MotionTag = TAGS[as];
  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Child of <Stagger>. */
export function StaggerItem({ children, className, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const MotionTag = TAGS[as];
  return (
    <MotionTag className={className} variants={grow(reduce)}>
      {children}
    </MotionTag>
  );
}
