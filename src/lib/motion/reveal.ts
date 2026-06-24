import type { Transition, Variant, Variants } from "motion/react";

import { MOTION } from "@/lib/motion/tokens";

const ease = MOTION.ease;

export const viewportHeading = { once: true, margin: "-12%" } as const;
export const viewportBlock = { once: true, margin: "-10%" } as const;
export const viewportCard = { once: true, margin: "-8%" } as const;

export const transitionReveal: Transition = {
  duration: MOTION.duration.reveal,
  ease,
};

export const transitionRevealWide: Transition = {
  duration: MOTION.duration.revealWide,
  ease,
};

export const transitionSoft: Transition = {
  duration: 0.78,
  ease,
};

export const fadeUpHidden: Variant = { opacity: 0, y: 24 };
export const fadeUpShow: Variant = { opacity: 1, y: 0 };

export const fadeUpSoftHidden: Variant = { opacity: 0, y: 16 };
export const fadeUpSoftShow: Variant = { opacity: 1, y: 0 };

export const fadeInHidden: Variant = { opacity: 0, y: 12 };
export const fadeInShow: Variant = { opacity: 1, y: 0 };

export const scaleInHidden: Variant = { opacity: 0, scale: 0.96 };
export const scaleInShow: Variant = { opacity: 1, scale: 1 };

export const mediaHidden: Variant = { opacity: 0, scale: 1.05 };
export const mediaShow: Variant = { opacity: 1, scale: 1 };

export const fadeUp = {
  initial: fadeUpHidden,
  whileInView: fadeUpShow,
  viewport: viewportHeading,
  transition: transitionRevealWide,
} as const;

export const fadeUpSoft = {
  initial: fadeUpSoftHidden,
  whileInView: fadeUpSoftShow,
  viewport: viewportBlock,
  transition: transitionSoft,
} as const;

export const fadeIn = {
  initial: fadeInHidden,
  whileInView: fadeInShow,
  viewport: viewportBlock,
  transition: transitionReveal,
} as const;

export const scaleIn = {
  initial: scaleInHidden,
  whileInView: scaleInShow,
  viewport: viewportCard,
  transition: transitionSoft,
} as const;

export const mediaReveal = {
  initial: mediaHidden,
  whileInView: mediaShow,
  viewport: viewportCard,
  transition: transitionRevealWide,
} as const;

/** @deprecated Use fadeUpSoft */
export const reveal = fadeUpSoft;

/** @deprecated Use fadeUp */
export const revealWide = fadeUp;

export const mountUp = {
  initial: fadeUpSoftHidden,
  animate: fadeUpSoftShow,
  transition: transitionSoft,
} as const;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: fadeUpSoftHidden,
  show: {
    ...fadeUpSoftShow,
    transition: transitionSoft,
  },
};

export const heroEyebrow: Variants = {
  hidden: fadeInHidden,
  show: {
    ...fadeInShow,
    transition: { duration: 0.55, ease },
  },
};

export const heroLine: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease },
  },
};

export const heroStat: Variants = {
  hidden: scaleInHidden,
  show: {
    ...scaleInShow,
    transition: { duration: 0.72, ease },
  },
};

export const heroCta: Variants = {
  hidden: fadeUpSoftHidden,
  show: {
    ...fadeUpSoftShow,
    transition: { duration: 0.78, ease },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const heroStaggerReturn: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

export const hubPanelShell: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.988,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease,
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

export const hubPanelShellReturn: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.992,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease,
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

/** @deprecated Use hubPanelShell */
export const hubIntroStagger = hubPanelShell;

/** @deprecated Use hubPanelShellReturn */
export const hubIntroStaggerReturn = hubPanelShellReturn;

export const hubCardsStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const hubCardItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease },
  },
};

export const textLineStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.04,
    },
  },
};
