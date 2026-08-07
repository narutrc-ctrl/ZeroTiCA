import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  Radar,
  Shield,
  Sparkles,
} from "lucide-react";
import { chapterForPhase, getCaseIncident, storyChapters } from "@/data/issue-story";
import { SimulationStageShell } from "@/components/interactive-journey/SimulationConsole";
import { SimulationReport } from "@/components/interactive-journey/SimulationReport";
import { SimulationRunaTaskView } from "@/components/interactive-journey/SimulationRunaTaskView";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { ObserveDirectionsPanel } from "@/components/interactive-journey/ObserveDirectionsPanel";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { KANBAN_COLUMNS, ISSUE_STATUS } from "@/data/issue-ui-labels";
import { cn } from "@/lib/cn";

export function SimulationStage({ sim }: { sim: IssueSimulationState }) {
  const {
    activeCase,
    phase,
    analystStep,
    current,
    analystSteps,
  } = sim;
  const isThreat = activeCase === "threat";

  // 관측 단계: Outbound / Inbound / Lateral 카드 (첨부 1번째 화면)
  if (phase === "monitoring" || phase === "anomaly") {
    return (
      <SimulationStageShell>
        <ObserveDirectionsPanel />
      </SimulationStageShell>
    );
  }

  if (phase === "analyst") {
    const icons = [Database, Radar, Shield, Sparkles, CheckCircle2];

    return (
      <SimulationStageShell>
        <div className="flex h-full flex-col bg-white p-3">
          <p className="shrink-0 text-[11px] font-semibold text-slate-700">분석 파이프라인</p>
          <div className="mt-2 min-h-0 flex-1 space-y-0 overflow-y-auto">
            {analystSteps.map((s, i) => {
              const Icon = icons[i] ?? Activity;
              const done = i < analystStep;
              const active = i === analystStep;
              const isValidThreatStep = isThreat && i === 2;
              return (
                <div key={s.label} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-500",
                        done
                          ? isValidThreatStep
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-emerald-500 bg-emerald-50 text-emerald-600"
                          : active
                            ? isValidThreatStep
                              ? "border-red-500 bg-red-50 text-red-600 sim-step-active sim-spotlight-ring"
                              : "border-blue-500 bg-blue-50 text-blue-600 sim-step-active sim-spotlight-ring"
                            : "border-slate-200 bg-slate-50 text-slate-300",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3 w-3" />}
                    </div>
                    {i < analystSteps.length - 1 ? (
                      <div className={cn("w-0.5 flex-1 min-h-[0.85rem]", done ? "bg-emerald-300" : "bg-slate-200")} />
                    ) : null}
                  </div>
                  <div className={cn("pb-3 min-w-0 flex-1", active && "sim-expand-in")}>
                    <p
                      className={cn(
                        "text-[11px] font-bold",
                        active ? (isValidThreatStep ? "text-red-700" : "text-blue-700") : done ? "text-emerald-700" : "text-slate-400",
                      )}
                    >
                      {s.title}
                    </p>
                    {active ? (
                      <div className="mt-1 rounded-lg border border-blue-100 bg-blue-50/50 px-2 py-1.5">
                        <p className="text-[10px] leading-relaxed text-slate-600">{s.detail}</p>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="sim-progress-bar h-full rounded-full bg-blue-500" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SimulationStageShell>
    );
  }

  if (
    phase === "delivery" ||
    phase === "kanban" ||
    phase === "task" ||
    phase === "reply" ||
    phase === "verifying" ||
    phase === "staff-reply"
  ) {
    return (
      <SimulationStageShell scrollable>
        <SimulationRunaTaskView sim={sim} showEmail={phase === "delivery"} />
      </SimulationStageShell>
    );
  }

  if (phase === "complete") {
    const previousIncident = isThreat ? getCaseIncident("normal") : null;

    return (
      <SimulationStageShell scrollable>
        <MiniRunaFrame activeNav="tasks" variant="cropped" className="h-full">
          <div
            className={cn(
              "mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold sim-spotlight-glow",
              isThreat ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            완료 · {current.code}
          </div>
          <div className="flex gap-2">
            <KanbanColumn title={KANBAN_COLUMNS.pre_request} titleClass="text-slate-600" headerClass="bg-slate-100" count={0} compact>
              <div className="rounded-lg border border-dashed border-slate-200 py-4 text-center text-[10px] text-slate-400">—</div>
            </KanbanColumn>
            <KanbanColumn title={KANBAN_COLUMNS.in_request} titleClass="text-blue-600" headerClass="bg-sky-50" count={0} compact>
              <div className="rounded-lg border border-dashed border-slate-200 py-4 text-center text-[10px] text-slate-400">—</div>
            </KanbanColumn>
            <KanbanColumn
              title={KANBAN_COLUMNS.done}
              titleClass="text-green-600"
              headerClass="bg-emerald-50"
              count={previousIncident ? 2 : 1}
              compact
            >
              <div className="space-y-2">
                {previousIncident ? (
                  <TaskCard
                    title={previousIncident.title}
                    code={previousIncident.code}
                    author="제로티카 분석팀"
                    status={ISSUE_STATUS.completed}
                    statusClass={taskStatusClass("completed")}
                  />
                ) : null}
                <div className="sim-card-enter sim-spotlight-ring rounded-xl">
                  <TaskCard
                    title={current.title}
                    code={current.code}
                    author="제로티카 분석팀"
                    status={ISSUE_STATUS.completed}
                    statusClass={taskStatusClass("completed")}
                    highlight={!previousIncident}
                  />
                </div>
              </div>
            </KanbanColumn>
          </div>
          <div className="h-10" />
          {activeCase === "normal" ? (
            <button
              type="button"
              onClick={sim.startThreatCase}
              className="sim-click-cue-target mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              <AlertTriangle className="h-4 w-4" />
              고객 조치 단계 이어서 보기
            </button>
          ) : (
            <button
              type="button"
              onClick={sim.openReport}
              className="sim-click-cue-target mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              <FileText className="h-4 w-4" />
              침해평가 보고서 확인하기
            </button>
          )}
        </MiniRunaFrame>
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
