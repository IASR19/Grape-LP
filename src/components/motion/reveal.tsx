"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { forwardRef, type ReactNode } from "react";

import {
  fadeIn,
  fadeUp,
  fadeUpSoft,
  mediaReveal,
  scaleIn,
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  textLineStagger,
  heroLine,
  viewportBlock,
} from "@/lib/motion/reveal";
import { cn } from "@/lib/utils";

type Preset = "fadeUp" | "fadeUpSoft" | "fadeIn" | "scaleIn" | "media";

const presets = {
  fadeUp,
  fadeUpSoft,
  fadeIn,
  scaleIn,
  media: mediaReveal,
} as const;

type RevealProps = {
  preset?: Preset;
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export function Reveal({
  preset = "fadeUpSoft",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const reduced = useReducedMotion();
  const config = presets[preset];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={config.initial}
      whileInView={config.whileInView}
      viewport={config.viewport}
      transition={{ ...config.transition, delay } as Transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type RevealTextProps = {
  lines: readonly string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
};

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

export function RevealText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const MotionTag = motionTags[Tag];

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={fadeUp.viewport}
      variants={textLineStagger}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {lines.map((line) => (
        <motion.span key={line} variants={heroLine} className={cn("block", lineClassName)}>
          {line}
        </motion.span>
      ))}
    </MotionTag>
  );
}

type StaggerRevealProps = {
  fast?: boolean;
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export const StaggerReveal = forwardRef<HTMLDivElement, StaggerRevealProps>(function StaggerReveal(
  { fast = false, delay = 0, className, children },
  ref,
) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="show"
      viewport={viewportBlock}
      variants={fast ? staggerContainerFast : staggerContainer}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

type RevealItemProps = {
  className?: string;
  children?: ReactNode;
};

export function RevealItem({ className, children }: RevealItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

type RevealMediaProps = {
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export function RevealMedia({ delay = 0, className, children }: RevealMediaProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={mediaReveal.initial}
      whileInView={mediaReveal.whileInView}
      viewport={mediaReveal.viewport}
      transition={{ ...mediaReveal.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
