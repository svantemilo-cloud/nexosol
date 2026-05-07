"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeftRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as PE,
} from "react";

export type ImageComparisonProps = {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
  /**
   * false: före till vänster om reglaget, efter till höger.
   * true: efter till vänster, före till höger.
   */
  afterOnLeft?: boolean;
};

/**
 * Before/after-jämförelse. Underbilden i flödet ger stabil höjd; övre klippts.
 * Yttre får oftast `aspect-video` från föräldern — `min-h` skyddar mot höjd 0 om clip/aspect strular.
 */
export function ImageComparison({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
  className,
  afterOnLeft = false,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const flushPosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );
    setSliderPosition(pct);
  }, []);

  const schedulePosition = useCallback(
    (clientX: number) => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        flushPosition(clientX);
      });
    },
    [flushPosition],
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const stopDrag = useCallback((e: PE<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /** ignore */
    }
  }, []);

  const onLostPointerCapture = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  const onPointerDown = useCallback(
    (e: PE<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggingRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /** ignore */
      }
      flushPosition(e.clientX);
    },
    [flushPosition],
  );

  const onPointerMove = useCallback(
    (e: PE<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      schedulePosition(e.clientX);
    },
    [schedulePosition],
  );

  const clipAfter = afterOnLeft
    ? `inset(0 ${100 - sliderPosition}% 0 0)`
    : `inset(0 0 0 ${sliderPosition}%)`;

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      aria-orientation="horizontal"
      aria-label="Jämför före och efter"
      className={cn(
        "relative w-full cursor-ew-resize select-none overflow-hidden rounded-xl shadow-soft-lg touch-none",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onLostPointerCapture={onLostPointerCapture}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 2;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          setSliderPosition((p) => Math.max(0, p - step));
        }
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          setSliderPosition((p) => Math.min(100, p + step));
        }
        if (e.key === "Home") {
          e.preventDefault();
          setSliderPosition(0);
        }
        if (e.key === "End") {
          e.preventDefault();
          setSliderPosition(100);
        }
      }}
    >
      <img
        src={beforeImage}
        alt={altBefore}
        className="relative z-0 block h-full w-full cursor-ew-resize object-cover object-center sm:object-left"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        style={{ clipPath: clipAfter }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="absolute inset-0 h-full w-full object-cover object-center sm:object-left"
          draggable={false}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 flex w-12 -translate-x-1/2 items-center justify-center sm:w-14"
        style={{ left: `${sliderPosition}%` }}
      >
        <span className="absolute inset-y-0 w-1 bg-white/90 shadow-sm" />
        <div
          className={cn(
            "relative flex size-11 items-center justify-center rounded-full border border-white/70 bg-white text-forest shadow-md transition-transform duration-200 ease-out sm:size-12",
            isDragging && "scale-110 shadow-lg",
          )}
        >
          <ChevronsLeftRight className="size-5 sm:size-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
