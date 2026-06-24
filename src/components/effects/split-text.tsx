"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ElementType,
} from "react";

import { registerGsapPlugins } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

registerGsapPlugins();

type SplitTarget = "chars" | "words" | "lines" | "words, chars";

export type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Atraso antes do stagger (ms). */
  startDelay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitTarget;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: ElementType;
  /** Scroll na primeira entrada ou reanima a cada mudança de texto. */
  triggerMode?: "scroll" | "change";
  onLetterAnimationComplete?: () => void;
};

const splitInstanceMap = new WeakMap<HTMLElement, GSAPSplitText>();

function assignTargets(
  splitType: SplitTarget,
  instance: GSAPSplitText,
): Element[] {
  if (splitType.includes("chars") && instance.chars.length) return instance.chars;
  if (splitType.includes("words") && instance.words.length) return instance.words;
  if (splitType.includes("lines") && instance.lines.length) return instance.lines;
  return instance.chars.length
    ? instance.chars
    : instance.words.length
      ? instance.words
      : instance.lines;
}

function buildScrollStart(threshold: number, rootMargin: string) {
  const startPct = (1 - threshold) * 100;
  const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
  const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
  const marginUnit = marginMatch?.[2] ?? "px";
  const sign =
    marginValue === 0
      ? ""
      : marginValue < 0
        ? `-=${Math.abs(marginValue)}${marginUnit}`
        : `+=${marginValue}${marginUnit}`;

  return `top ${startPct}%${sign}`;
}

function revertSplit(el: HTMLElement | null) {
  if (!el) return;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === el) trigger.kill();
  });

  const instance = splitInstanceMap.get(el);
  if (!instance) return;

  try {
    instance.revert();
  } catch {
    /* noop */
  }

  splitInstanceMap.delete(el);
}

function subscribeFontsReady(onStoreChange: () => void) {
  if (document.fonts.status === "loaded") {
    return () => undefined;
  }

  document.fonts.ready.then(() => onStoreChange());
  return () => undefined;
}

function getFontsLoadedSnapshot() {
  return typeof document !== "undefined" && document.fonts.status === "loaded";
}

function getFontsLoadedServerSnapshot() {
  return false;
}

export function SplitText({
  text,
  className = "",
  delay = 50,
  startDelay = 0,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  tag: Tag = "p",
  triggerMode = "scroll",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const fontsLoaded = useSyncExternalStore(
    subscribeFontsReady,
    getFontsLoadedSnapshot,
    getFontsLoadedServerSnapshot,
  );

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      revertSplit(el);

      const runAnimation = (targets: Element[]) => {
        if (!targets.length) return undefined;

        const tweenVars: gsap.TweenVars = {
          ...to,
          duration,
          ease,
          delay: startDelay / 1000,
          stagger: delay / 1000,
          onComplete: () => onCompleteRef.current?.(),
          willChange: "transform, opacity",
          force3D: true,
        };

        if (triggerMode === "scroll") {
          tweenVars.scrollTrigger = {
            trigger: el,
            start: buildScrollStart(threshold, rootMargin),
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4,
          };
        }

        return gsap.fromTo(targets, { ...from }, tweenVars);
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit:
          triggerMode === "scroll"
            ? (self) => runAnimation(assignTargets(splitType, self))
            : undefined,
      });

      splitInstanceMap.set(el, splitInstance);

      if (triggerMode === "change") {
        runAnimation(assignTargets(splitType, splitInstance));
      }
    },
    {
      dependencies: [
        text,
        delay,
        startDelay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        triggerMode,
        fontsLoaded,
      ],
      scope: ref,
      revertOnUpdate: true,
    },
  );

  const Component = Tag as ElementType;
  const blockTag =
    Tag === "h1" || Tag === "h2" || Tag === "h3" || Tag === "h4";
  const displayBlock = blockTag || className.includes("block");
  const yOffset =
    typeof from.y === "number" ? Math.abs(from.y) : triggerMode === "change" ? 24 : 0;

  return (
    <Component
      ref={ref}
      className={cn(
        "split-parent",
        textAlign === "center" && "split-parent-center",
        className,
      )}
      style={{
        textAlign,
        overflow: triggerMode === "change" ? "visible" : "hidden",
        display: displayBlock ? "block" : "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        willChange: "transform, opacity",
        paddingBottom: yOffset > 0 ? `${yOffset}px` : undefined,
      }}
    >
      {text}
    </Component>
  );
}
