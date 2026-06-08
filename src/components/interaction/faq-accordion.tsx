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
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/24">
      <h3 className="m-0">
        <button
          type="button"
          id={questionId}
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-muted/35"
        >
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:transition motion-safe:duration-300 motion-safe:ease-out",
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
          <span className="flex-1 text-base font-medium">{item.question}</span>
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
            <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-6 text-muted-foreground">
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
      <StaggerReveal fast className={cn("grid gap-2.5", className)}>
        {content}
      </StaggerReveal>
    );
  }

  return <div className={cn("grid gap-2.5", className)}>{content}</div>;
}
