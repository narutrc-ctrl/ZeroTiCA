import { useEffect, useState } from "react";
import { formatActLabel, journeyActs } from "@/data/journey-steps";
import { cn } from "@/lib/cn";

type DockProps = {
  activeAct: number;
  drawerOpen: boolean;
  onScrollToAct: (index: number) => void;
};

export function useSectionInView(sectionId: string, rootMargin = "0px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.04, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionId, rootMargin]);

  return inView;
}

/** 모바일 — 하단 STEP 진행 표시 (세부 단계는 드로어에서) */
export function JourneyProgressDock({
  activeAct,
  drawerOpen,
  onScrollToAct,
}: DockProps) {
  const act = journeyActs[activeAct] ?? journeyActs[0];
  const pct = Math.round(((activeAct + 1) / journeyActs.length) * 100);

  if (drawerOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_-8px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden"
      role="region"
      aria-label="작업 순서 진행도"
    >
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-900">{act.title}</p>
          <p className="text-[10px] text-slate-500">
            {formatActLabel(act)} · {pct}%
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {journeyActs.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onScrollToAct(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                activeAct === i ? "scale-110 bg-blue-600 ring-2 ring-blue-200" : "bg-slate-200",
              )}
              aria-label={`STEP ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
