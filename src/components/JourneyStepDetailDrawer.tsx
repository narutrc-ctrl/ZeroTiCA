import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  formatActLabel,
  journeyActs,
  journeyStepShortLabel,
  unifiedJourneySteps,
  type JourneyStep,
  type JourneyVisualId,
} from "@/data/journey-steps";
import { JourneyStepContent } from "@/components/JourneyStepContent";
import { JourneyDashboardFrame } from "@/components/JourneyDashboardFrame";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  actIndex: number;
  stepInAct: number;
  onClose: () => void;
  onStepInActChange: (index: number) => void;
};

export function JourneyStepDetailDrawer({
  open,
  actIndex,
  stepInAct,
  onClose,
  onStepInActChange,
}: Props) {
  const act = journeyActs[actIndex] ?? journeyActs[0];
  const stepsInAct = act.stepIndices.map((i) => unifiedJourneySteps[i]);
  const step = stepsInAct[stepInAct] ?? stepsInAct[0];
  const canPrev = stepInAct > 0;
  const canNext = stepInAct < stepsInAct.length - 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canPrev) onStepInActChange(stepInAct - 1);
      if (e.key === "ArrowRight" && canNext) onStepInActChange(stepInAct + 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, canPrev, canNext, stepInAct, onClose, onStepInActChange]);

  if (!open || !step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 lg:p-10" role="dialog" aria-modal>
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="닫기"
      />

      <div className="relative flex max-h-[94vh] w-full max-w-[1600px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl lg:flex-row">
        <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{formatActLabel(act)}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{act.title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {stepsInAct.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canPrev}
                onClick={() => onStepInActChange(stepInAct - 1)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                aria-label="이전 세부 단계"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-1 justify-center gap-1.5 overflow-x-auto">
                {stepsInAct.map((s, i) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => onStepInActChange(i)}
                    className={cn(
                      "flex h-8 max-w-[7rem] items-center justify-center truncate rounded-lg px-2 text-[11px] font-semibold transition",
                      stepInAct === i
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    )}
                    aria-label={journeyStepShortLabel[s.step] ?? s.title}
                    title={journeyStepShortLabel[s.step] ?? s.title}
                    aria-current={stepInAct === i ? "step" : undefined}
                  >
                    {journeyStepShortLabel[s.step] ?? s.title}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!canNext}
                onClick={() => onStepInActChange(stepInAct + 1)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                aria-label="다음 세부 단계"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div key={step.step} className="journey-step-slide-enter">
              <JourneyStepContent step={step} />
            </div>
          </div>

          <div className="hidden shrink-0 border-t border-slate-100 bg-[#F8F9FA] p-5 lg:block lg:w-[min(420px,38%)] lg:border-l lg:border-t-0">
            <JourneyDashboardFrame visual={step.visual} stepLabel={formatActLabel(act)} title={step.title} active />
            <p className="mt-3 text-center text-xs text-slate-400">{step.actorLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function previewVisualForStep(step: JourneyStep | undefined): JourneyVisualId {
  if (!step) return "sensor";
  return step.visual;
}
