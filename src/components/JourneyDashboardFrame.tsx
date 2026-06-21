import type { JourneyVisualId } from "@/data/journey-steps";
import { JourneyVisual } from "@/components/JourneyVisual";
import { cn } from "@/lib/cn";

export function JourneyDashboardFrame({
  visual,
  stepLabel,
  title,
  active,
}: {
  visual: JourneyVisualId;
  stepLabel: string;
  title: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "journey-dashboard-frame relative transition-all duration-500",
        active ? "journey-dashboard-active scale-[1.01]" : "scale-100 opacity-90",
      )}
    >
      {/* 하이라이트 글로우 */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-orange-400/10 transition-opacity duration-700",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.18),0_8px_24px_-8px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">RUNA 대시보드</p>
            <p className="mt-0.5 text-sm font-semibold text-[#212529]">{title}</p>
          </div>
          <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white">
            STEP {stepLabel}
          </span>
        </div>

        <div key={visual} className="journey-preview-enter p-3 sm:p-4">
          <div className="journey-dashboard-highlight overflow-hidden rounded-xl">
            <JourneyVisual id={visual} />
          </div>
        </div>
      </div>
    </div>
  );
}
