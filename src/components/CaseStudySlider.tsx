import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { caseById } from "@/data/customer-value-examples";
import { TaskCaseStudyCard } from "@/components/TaskCaseStudyCard";
import { cn } from "@/lib/cn";

const AUTO_MS = 9000;

type SlideItem = { caseId: string; tabLabel: string };

export function CaseStudySlider({ slides }: { slides: SlideItem[] }) {
  const items = useMemo(
    () =>
      slides
        .map((slide) => {
          const study = caseById(slide.caseId);
          return study ? { ...slide, study } : null;
        })
        .filter((item): item is SlideItem & { study: NonNullable<ReturnType<typeof caseById>> } => item != null),
    [slides],
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | "none">("none");
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const current = items[index] ?? items[0];

  const goTo = useCallback(
    (next: number, dir: "left" | "right" | "none" = "none") => {
      if (total === 0) return;
      setDirection(dir);
      setIndex((next + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(index - 1, "left"), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1, "right"), [goTo, index]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = window.setInterval(() => goTo(index + 1, "right"), AUTO_MS);
    return () => window.clearInterval(t);
  }, [paused, index, goTo, total]);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 48) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  if (!current) return null;

  return (
    <div
      ref={regionRef}
      className="mx-auto w-full max-w-[960px] outline-none"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="대표 사례"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex flex-wrap gap-2 sm:justify-center">
        {items.map((slide, i) => (
          <button
            key={slide.caseId}
            type="button"
            onClick={() => goTo(i, i > index ? "right" : i < index ? "left" : "none")}
            className={cn(
              "rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
              i === index
                ? "border-blue-500/50 bg-blue-500/20 text-white"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-slate-200",
            )}
            aria-current={i === index ? "true" : undefined}
          >
            {slide.tabLabel}
          </button>
        ))}
      </div>

      <div className="relative mt-6">
        <button
          type="button"
          onClick={goPrev}
          className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-slate-900/90 p-2.5 text-slate-300 shadow-lg transition hover:border-white/30 hover:bg-slate-800 hover:text-white sm:-left-4 lg:flex"
          aria-label="이전 사례"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={goNext}
          className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-slate-900/90 p-2.5 text-slate-300 shadow-lg transition hover:border-white/30 hover:bg-slate-800 hover:text-white sm:-right-4 lg:flex"
          aria-label="다음 사례"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          key={current.caseId}
          className={cn(
            "case-slide-enter min-h-[420px]",
            direction === "left" && "case-slide-from-left",
            direction === "right" && "case-slide-from-right",
          )}
        >
          <TaskCaseStudyCard study={current.study} />
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="flex rounded-full border border-white/15 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="이전 사례"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="사례 선택">
            {items.map((slide, i) => (
              <button
                key={slide.caseId}
                type="button"
                onClick={() => goTo(i, i > index ? "right" : i < index ? "left" : "none")}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-blue-500" : "w-2 bg-white/20 hover:bg-white/40",
                )}
                aria-label={slide.tabLabel}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="flex rounded-full border border-white/15 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="다음 사례"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
