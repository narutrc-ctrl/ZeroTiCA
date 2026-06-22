import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import {
  formatActLabel,
  journeyActs,
  journeyFlowPills,
  unifiedJourneySteps,
} from "@/data/journey-steps";
import { cn } from "@/lib/cn";

type ProgressProps = {
  deepMode: boolean;
  activeAct: number;
  activeStep: number;
  onToggleDeep: () => void;
  onScrollToAct: (index: number) => void;
  onScrollToStep: (index: number) => void;
};

function useProgressState(deepMode: boolean, activeAct: number, activeStep: number) {
  const total = deepMode ? unifiedJourneySteps.length : journeyActs.length;
  const active = deepMode ? activeStep : activeAct;
  const pct = Math.round(((active + 1) / total) * 100);

  const currentTitle = deepMode
    ? unifiedJourneySteps[activeStep]?.title ?? ""
    : journeyActs[activeAct]?.title ?? "";

  const currentMeta = deepMode
    ? `STEP ${unifiedJourneySteps[activeStep]?.step ?? "01"} · ${activeStep + 1}/8`
    : `${formatActLabel(journeyActs[activeAct] ?? journeyActs[0])} · ${activeAct + 1}/3`;

  return { active, pct, currentTitle, currentMeta };
}

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

/** 데스크톱 — RUNA 프리뷰 위 사이드 레일 (본문을 가리지 않음) */
export function JourneyProgressRail({
  deepMode,
  activeAct,
  activeStep,
  onToggleDeep,
  onScrollToAct,
  onScrollToStep,
}: ProgressProps) {
  const { pct, currentTitle, currentMeta } = useProgressState(
    deepMode,
    activeAct,
    activeStep,
  );

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">진행</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{currentTitle}</p>
          <p className="text-xs text-slate-500">{currentMeta}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold tabular-nums text-blue-700">
          {pct}%
        </span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {!deepMode
          ? journeyActs.map((act, i) => (
              <button
                key={act.id}
                type="button"
                onClick={() => onScrollToAct(i)}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                  activeAct === i
                    ? "bg-blue-600 text-white"
                    : i < activeAct
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                )}
              >
                {act.act}막
              </button>
            ))
          : journeyFlowPills.map((p, i) => (
              <button
                key={p.step}
                type="button"
                onClick={() => onScrollToStep(i)}
                title={p.label}
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors",
                  activeStep === i ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500",
                )}
              >
                {p.step}
              </button>
            ))}
      </div>

      <button
        type="button"
        onClick={onToggleDeep}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <Layers className="h-3.5 w-3.5" />
        {deepMode ? "3막 요약으로" : "8단계 전체 보기"}
      </button>
    </div>
  );
}

/** 모바일 — 하단 도크 (본문·프리뷰와 겹치지 않음) */
export function JourneyProgressDock({
  deepMode,
  activeAct,
  activeStep,
  onToggleDeep,
  onScrollToAct,
  onScrollToStep,
}: ProgressProps) {
  const { pct, currentTitle, currentMeta } = useProgressState(deepMode, activeAct, activeStep);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_-8px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden"
      role="region"
      aria-label="작업 순서 진행도"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-900">{currentTitle}</p>
          <p className="text-[10px] text-slate-500">
            {currentMeta} · {pct}%
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {!deepMode
            ? journeyActs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onScrollToAct(i)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all",
                    activeAct === i ? "scale-110 bg-blue-600 ring-2 ring-blue-200" : "bg-slate-200",
                  )}
                  aria-label={`${i + 1}막`}
                />
              ))
            : journeyFlowPills.slice(0, 8).map((p, i) => (
                <button
                  key={p.step}
                  type="button"
                  onClick={() => onScrollToStep(i)}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold tabular-nums",
                    activeStep === i ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {p.step.replace("0", "")}
                </button>
              ))}
        </div>
        <button
          type="button"
          onClick={onToggleDeep}
          className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-2 text-[10px] font-semibold text-slate-700"
        >
          {deepMode ? "3막" : "8단계"}
        </button>
      </div>
    </div>
  );
}
