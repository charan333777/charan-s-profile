type Props = {
  /** Source string, e.g. "5+", "2", "86", "3.5". Rendered verbatim. */
  value: string;
  className?: string;
};

/**
 * Renders a proof-point value exactly as given. We deliberately do NOT count up
 * from zero: that reset caused the number to flash (and sometimes stick) at 0
 * when the in-view observer fired. The section already fades/slides up via its
 * Reveal wrapper, which provides the entrance flair without ever showing 0.
 */
export default function CountUp({ value, className }: Props) {
  return <span className={className}>{value}</span>;
}
