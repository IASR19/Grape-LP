import { useEffect, type RefObject } from "react";

type UseHorizontalScrollOptions = {
  drag?: boolean;
  wheel?: boolean;
  loop?: boolean;
  /** Pixels before pointer movement counts as drag. */
  threshold?: number;
  /** px/ms — fast flicks advance to the next/previous slide. */
  flickVelocity?: number;
  /** Snap animation duration in ms. */
  snapDuration?: number;
};

type VelocitySample = {
  x: number;
  time: number;
};

function getSlides(scroller: HTMLElement) {
  return Array.from(scroller.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
}

function getNearestSlideIndex(scroller: HTMLElement, slides: HTMLElement[]) {
  if (slides.length === 0) return 0;

  const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(slideCenter - viewportCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function getTargetSlideIndex(
  scroller: HTMLElement,
  slides: HTMLElement[],
  velocity: number,
  flickVelocity: number,
  loop: boolean,
) {
  const nearest = getNearestSlideIndex(scroller, slides);

  if (Math.abs(velocity) < flickVelocity) {
    return nearest;
  }

  if (velocity < 0) {
    if (nearest >= slides.length - 1) {
      return loop ? 0 : slides.length - 1;
    }

    return nearest + 1;
  }

  if (nearest <= 0) {
    return loop ? slides.length - 1 : 0;
  }

  return nearest - 1;
}

function clampScrollLeft(scroller: HTMLElement, value: number) {
  const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  return Math.min(max, Math.max(0, value));
}

function animateScrollTo(
  scroller: HTMLElement,
  targetLeft: number,
  duration: number,
  onComplete?: () => void,
): () => void {
  const startLeft = scroller.scrollLeft;
  const distance = targetLeft - startLeft;

  if (Math.abs(distance) < 1) {
    scroller.scrollLeft = targetLeft;
    onComplete?.();
    return () => undefined;
  }

  const startTime = performance.now();
  let frame = 0;

  function step(now: number) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    scroller.scrollLeft = startLeft + distance * eased;

    if (progress < 1) {
      frame = requestAnimationFrame(step);
      return;
    }

    scroller.scrollLeft = targetLeft;
    onComplete?.();
  }

  frame = requestAnimationFrame(step);

  return () => cancelAnimationFrame(frame);
}

function trackVelocity(samples: VelocitySample[]) {
  if (samples.length < 2) return 0;

  const first = samples[0];
  const last = samples[samples.length - 1];
  const elapsed = last.time - first.time;

  if (elapsed <= 0) return 0;

  return (last.x - first.x) / elapsed;
}

export function useHorizontalScroll(
  ref: RefObject<HTMLElement | null>,
  {
    drag = true,
    wheel = true,
    loop = false,
    threshold = 6,
    flickVelocity = 0.45,
    snapDuration = 340,
  }: UseHorizontalScrollOptions = {},
) {
  useEffect(() => {
    const track = ref.current;
    if (!track) return;

    let dragging = false;
    let hasMoved = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastDeltaX = 0;
    let startScrollLeft = 0;
    let velocitySamples: VelocitySample[] = [];
    let snapAnimationCancel: (() => void) | null = null;
    let wheelSnapTimer: number | null = null;

    function clearDragStyles() {
      delete track!.dataset.dragging;
      track!.style.scrollSnapType = "";
      track!.style.scrollBehavior = "";
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
    }

    function snapToSlide(index: number) {
      const slides = getSlides(track!);
      const slide = slides[index];
      if (!slide) return;

      snapAnimationCancel?.();
      track!.style.scrollSnapType = "none";
      track!.style.scrollBehavior = "auto";

      snapAnimationCancel = animateScrollTo(
        track!,
        slide.offsetLeft,
        snapDuration,
        () => {
          track!.style.scrollSnapType = "";
          track!.style.scrollBehavior = "";
          snapAnimationCancel = null;
        },
      );
    }

    function snapFromInteraction(velocity = 0, direction?: -1 | 1) {
      const slides = getSlides(track!);
      let targetIndex = getTargetSlideIndex(
        track!,
        slides,
        velocity,
        flickVelocity,
        loop,
      );

      if (loop && direction) {
        const nearest = getNearestSlideIndex(track!, slides);

        if (direction > 0 && nearest >= slides.length - 1) {
          targetIndex = 0;
        }

        if (direction < 0 && nearest <= 0) {
          targetIndex = slides.length - 1;
        }
      }

      snapToSlide(targetIndex);
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging || pointerId !== event.pointerId) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      lastDeltaX = deltaX;

      if (!hasMoved) {
        if (Math.max(absX, absY) < threshold) return;

        if (absY > absX * 1.12) {
          document.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerup", endDrag);
          document.removeEventListener("pointercancel", endDrag);
          dragging = false;
          pointerId = null;
          velocitySamples = [];
          clearDragStyles();
          return;
        }

        if (absX < absY * 1.12) return;

        hasMoved = true;
        track!.setPointerCapture(event.pointerId);
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      }

      event.preventDefault();
      snapAnimationCancel?.();
      snapAnimationCancel = null;
      track!.scrollLeft = clampScrollLeft(track!, startScrollLeft - deltaX);

      velocitySamples.push({ x: event.clientX, time: event.timeStamp });
      if (velocitySamples.length > 6) {
        velocitySamples = velocitySamples.slice(-6);
      }
    }

    function endDrag(event: PointerEvent) {
      if (!dragging || pointerId !== event.pointerId) return;

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endDrag);
      document.removeEventListener("pointercancel", endDrag);

      if (track!.hasPointerCapture(event.pointerId)) {
        track!.releasePointerCapture(event.pointerId);
      }

      dragging = false;
      pointerId = null;
      clearDragStyles();

      if (!hasMoved) return;

      const velocity = trackVelocity(velocitySamples);
      const direction =
        lastDeltaX < -threshold ? 1 : lastDeltaX > threshold ? -1 : undefined;
      velocitySamples = [];
      snapFromInteraction(velocity, direction);
    }

    function onPointerDown(event: PointerEvent) {
      if (!drag) return;
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;

      snapAnimationCancel?.();
      snapAnimationCancel = null;
      if (wheelSnapTimer !== null) {
        window.clearTimeout(wheelSnapTimer);
        wheelSnapTimer = null;
      }

      dragging = true;
      hasMoved = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      lastDeltaX = 0;
      startScrollLeft = track!.scrollLeft;
      velocitySamples = [{ x: event.clientX, time: event.timeStamp }];
      track!.dataset.dragging = "true";
      track!.style.scrollSnapType = "none";
      track!.style.scrollBehavior = "auto";

      document.addEventListener("pointermove", onPointerMove, { passive: false });
      document.addEventListener("pointerup", endDrag);
      document.addEventListener("pointercancel", endDrag);
    }

    function onWheel(event: WheelEvent) {
      if (!wheel) return;

      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;

      if (horizontalDelta === 0) return;

      event.preventDefault();
      snapAnimationCancel?.();
      snapAnimationCancel = null;
      track!.style.scrollSnapType = "none";
      track!.scrollLeft = clampScrollLeft(
        track!,
        track!.scrollLeft + horizontalDelta,
      );

      if (wheelSnapTimer !== null) {
        window.clearTimeout(wheelSnapTimer);
      }

      wheelSnapTimer = window.setTimeout(() => {
        wheelSnapTimer = null;
        snapFromInteraction(0, horizontalDelta > 0 ? 1 : -1);
      }, 120);
    }

    function onDragStart(event: DragEvent) {
      event.preventDefault();
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("dragstart", onDragStart);
    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endDrag);
      document.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("dragstart", onDragStart);
      track.removeEventListener("wheel", onWheel);
      snapAnimationCancel?.();
      if (wheelSnapTimer !== null) {
        window.clearTimeout(wheelSnapTimer);
      }
      clearDragStyles();
    };
  }, [drag, flickVelocity, loop, ref, snapDuration, threshold, wheel]);
}

export function getHorizontalSlideIndex(
  scroller: HTMLElement,
  slides: HTMLElement[],
) {
  return getNearestSlideIndex(scroller, slides);
}
