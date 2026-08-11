import { ChevronRight } from "lucide-react";
import { chapterForPhase, storyChapters } from "@/data/issue-story";
import { SimulationStageShell } from "@/components/interactive-journey/SimulationConsole";
import { SimulationReport } from "@/components/interactive-journey/SimulationReport";
import { SimulationRunaTaskView } from "@/components/interactive-journey/SimulationRunaTaskView";
import { ObserveDirectionsPanel } from "@/components/interactive-journey/ObserveDirectionsPanel";
import { SelectStagePanel } from "@/components/interactive-journey/SelectStagePanel";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

export function SimulationStage({ sim }: { sim: IssueSimulationState }) {
  const { phase, analystStep } = sim;

  // 관측 단계: Outbound / Inbound / Lateral 카드
  if (phase === "monitoring" || phase === "anomaly") {
    return (
      <SimulationStageShell scrollable flushMobile>
        <ObserveDirectionsPanel />
      </SimulationStageShell>
    );
  }

  // 선별 단계: 전체 이벤트 → 정상 제외 → 우선 검토 → 검증 대상 사례
  if (phase === "analyst") {
    return (
      <SimulationStageShell flushMobile>
        <SelectStagePanel step={analystStep} />
      </SimulationStageShell>
    );
  }

  if (
    phase === "delivery" ||
    phase === "kanban" ||
    phase === "task" ||
    phase === "reply" ||
    phase === "verifying" ||
    phase === "staff-reply" ||
    phase === "complete"
  ) {
    return (
      <SimulationStageShell scrollable>
        <SimulationRunaTaskView sim={sim} showEmail={false} />
      </SimulationStageShell>
    );
  }

  return (
    <SimulationStageShell scrollable>
      <SimulationReport highlightNormal highlightThreat />
    </SimulationStageShell>
  );
}

export function SimulationChapterIndex({
  phase,
  activeCase = "normal",
}: {
  phase: IssueSimulationState["phase"];
  activeCase?: IssueSimulationState["activeCase"];
}) {
  const active = chapterForPhase(phase, activeCase);
  return (
    <div className="flex flex-wrap gap-1">
      {storyChapters.map((ch, i) => (
        <div key={ch.id} className="flex items-center">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              i < active ? "bg-emerald-100 text-emerald-700" : i === active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400",
            )}
          >
            {ch.label}
          </span>
          {i < storyChapters.length - 1 ? <ChevronRight className="mx-0.5 h-3 w-3 text-slate-300" /> : null}
        </div>
      ))}
    </div>
  );
}
