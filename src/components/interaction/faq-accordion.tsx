"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { RevealItem, StaggerReveal } from "@/components/motion/reveal";
import { toDomId } from "@/lib/a11y";
import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/motion";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
  animated?: boolean;
};

function FaqAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const baseId = useId();
  const questionId = `${baseId}-question-${toDomId(item.question) || index}`;
  const answerId = `${baseId}-answer-${toDomId(item.question) || index}`;

  return (
    <div className="overflow-hidden rounded-lg border border-border/78 bg-card/82 transition-[border-color,background-color] duration-300 hover:border-primary/22 hover:bg-card">
      <h3 className="m-0">
        <button
          type="button"
          id={questionId}
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-muted/24 sm:gap-4 sm:px-6 sm:py-4.5"
        >
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:transition motion-safe:duration-300 motion-safe:ease-out sm:size-9",
              isOpen && "motion-safe:translate-y-0.5",
            )}
            aria-hidden
          >
            <ChevronDown
              className={cn(
                "size-4 motion-safe:transition motion-safe:duration-300 motion-safe:ease-out",
                isOpen && "rotate-180",
              )}
            />
          </span>
          <span className="flex-1 text-sm font-medium leading-snug sm:text-base">{item.question}</span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            id={answerId}
            role="region"
            aria-labelledby={questionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: MOTION.ease }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-6 pl-[4rem] text-sm leading-[1.75] text-muted-foreground sm:px-6 sm:pl-[4.75rem]">
              {item.answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion({ items, className, animated = false }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const content = items.map((item, index) => {
    const isOpen = openIndex === index;
    const itemNode = (
      <FaqAccordionItem
        item={item}
        index={index}
        isOpen={isOpen}
        onToggle={() => setOpenIndex(isOpen ? null : index)}
      />
    );

    if (animated) {
      return <RevealItem key={item.question}>{itemNode}</RevealItem>;
    }

    return <div key={item.question}>{itemNode}</div>;
  });

  if (animated) {
    return (
      <StaggerReveal fast className={cn("grid gap-3", className)}>
        {content}
      </StaggerReveal>
    );
  }

  return <div className={cn("grid gap-3", className)}>{content}</div>;
}
