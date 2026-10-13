import type { Variants } from "framer-motion";

/** Luxe ease — the soul of Noir Editorial. Slow, precise, expensive. */
export const luxeEase = [0.16, 1, 0.3, 1] as const;

/** Blur + y reveal — far more luxurious than plain fade. */
export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export const blurRevealTransition = (delay = 0) => ({
  delay,
  duration: 0.7,
  ease: luxeEase,
});

/** Stagger container */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: luxeEase },
  },
};

/** Line draw — for timeline / hairline */
export const lineDraw: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.1, ease: luxeEase },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: luxeEase } },
};
