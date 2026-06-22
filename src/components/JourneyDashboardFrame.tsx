import type { JourneyVisualId } from "@/data/journey-steps";
import { JourneyVisual } from "@/components/JourneyVisual";
import { cn } from "@/lib/cn";

export function JourneyDashboardFrame({
  visual,
  stepLabel,
  title,
  active,
  stepIndex,
  stepCount,
  onStepSelect,
}: {
  visual: JourneyVisualId;
  stepLabel?: string;
  title: string;
  active: boolean;
  /** 여정 STEP 1~3 — 미리보기 헤더에 표시 */
  stepIndex?: number;
  stepCount?: number;
  onStepSelect?: (index: number) => void;
}) {
  const showStepNav = stepIndex !== undefined && stepCount !== undefined && stepCount > 1;

  return (
    <div
      className={cn(
        "journey-dashboard-frame relative transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "journey-dashboard-active opacity-100" : "opacity-90",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.18),0_8px_24px_-8px_rgba(15,23,42,0.12)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">RUNA 대시보드</p>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-[#212529] sm:text-[15px]">{title}</p>
          </div>

          {showStepNav ? (
            <div className="flex shrink-0 gap-1 rounded-full border border-slate-200 bg-slate-50 p-0.5">
              {Array.from({ length: stepCount }, (_, i) => {
                const isActive = i === stepIndex;
                const label = String(i + 1);
                const className = cn(
                  "min-w-[2rem] rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums transition-colors",
                  isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-500",
                  onStepSelect && !isActive && "hover:bg-white hover:text-slate-700",
                );

                if (onStepSelect) {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onStepSelect(i)}
                      className={className}
                      aria-label={`STEP ${label}`}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {label}
                    </button>
                  );
                }

                return (
                  <span key={i} className={className} aria-current={isActive ? "step" : undefined}>
                    {label}
                  </span>
                );
              })}
            </div>
          ) : stepLabel ? (
            <span className="ml-2 shrink-0 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white tabular-nums">
              {stepLabel.startsWith("STEP") ? stepLabel : `STEP ${stepLabel}`}
            </span>
          ) : null}
        </div>

        <div key={visual} className="journey-preview-enter p-4 sm:p-5">
          <div className="journey-dashboard-highlight journey-preview-crisp overflow-hidden rounded-xl">
            <JourneyVisual id={visual} />
          </div>
        </div>
      </div>
    </div>
  );
}
