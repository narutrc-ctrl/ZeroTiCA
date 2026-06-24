import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  Radar,
  RotateCcw,
  Shield,
  Sparkles,
} from "lucide-react";
import { chapterForPhase, storyChapters } from "@/data/issue-story";
import { SimulationReport } from "@/components/interactive-journey/SimulationReport";
import { SimulationRunaTaskView } from "@/components/interactive-journey/SimulationRunaTaskView";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

function MetricCard({
  label,
  value,
  highlight,
  pulse,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  pulse?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white px-3 py-2 transition-all duration-700",
        highlight ? "border-amber-300 bg-amber-50 shadow-md shadow-amber-100" : "border-slate-100",
        pulse && "sim-risk-pulse",
      )}
    >
      <p className="text-[10px] font-medium text-slate-400">{label}</p>
      <p className={cn("mt-0.5 text-lg font-bold tabular-nums", highlight ? "text-amber-700" : "text-slate-800")}>
        {value}
      </p>
    </div>
  );
}

export function SimulationStage({ sim }: { sim: IssueSimulationState }) {
  const {
    activeCase,
    phase,
    analystStep,
    logCount,
    eventCount,
    issueCount,
    riskLevel,
    current,
    monitoringLogs,
    analystSteps,
  } = sim;
  const isThreat = activeCase === "threat";

  // ── 모니터링 / 이상 징후 ──
  if (phase === "monitoring" || phase === "anomaly") {
    const isAnomaly = phase === "anomaly";
    const logs = monitoringLogs.slice(0, isAnomaly ? monitoringLogs.length : logCount);

    return (
      <div className={cn("overflow-hidden rounded-xl border bg-slate-950 shadow-2xl", isThreat ? "border-red-900/60" : "border-slate-800")}>
        <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300">
              네트워크 모니터링 · 실시간
              {isThreat ? <span className="ml-2 text-red-400">위험 통신 사례</span> : null}
            </p>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <MetricCard label="오늘 이벤트" value={eventCount.toLocaleString()} highlight={isAnomaly} />
            <MetricCard label="오픈 이슈" value={issueCount} highlight={isAnomaly} pulse={isAnomaly} />
            <MetricCard label="위험도" value={riskLevel} highlight={isAnomaly} pulse={isAnomaly} />
          </div>

          {isAnomaly ? (
            <div
              className={cn(
                "sim-slide-in mt-3 flex items-center gap-2 rounded-lg border px-3 py-2",
                isThreat ? "border-red-500/40 bg-red-500/10" : "border-amber-500/40 bg-amber-500/10",
              )}
            >
              <AlertTriangle className={cn("h-4 w-4 shrink-0", isThreat ? "text-red-400" : "text-amber-400")} />
              <p className={cn("text-xs font-medium", isThreat ? "text-red-100" : "text-amber-100")}>
                <span className={cn("font-mono", isThreat ? "text-red-300" : "text-amber-300")}>{current.srcIp}</span> →{" "}
                {current.dstIp} · {current.monitoringAlertText}
              </p>
            </div>
          ) : null}

          <div className="mt-4 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">로그 스트림</p>
            {logs.map((ev, i) => {
              const isAlert = ev.level === "alert";
              const showGlow = isAnomaly && isAlert;
              return (
                <div
                  key={ev.time}
                  className={cn(
                    "rounded-md border px-2.5 py-2 font-mono text-[10px] transition-all duration-500 sm:text-[11px]",
                    ev.level === "alert"
                      ? isThreat
                        ? "border-red-500/50 bg-red-950/60 text-red-100"
                        : "border-amber-500/50 bg-amber-950/60 text-amber-100"
                      : ev.level === "warn"
                        ? "border-slate-700 bg-slate-900 text-slate-300"
                        : "border-slate-800 bg-slate-900/50 text-slate-400",
                    showGlow && "sim-alert-glow",
                    !isAnomaly && "sim-log-in",
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-slate-500">{ev.time}</span> {ev.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── 분석 파이프라인 ──
  if (phase === "analyst") {
    const icons = [Database, Radar, Shield, Sparkles, CheckCircle2];

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-5">
        <p className="text-xs font-semibold text-slate-700">분석팀 · 검증 파이프라인</p>
        <div className="mt-4 space-y-0">
          {analystSteps.map((s, i) => {
            const Icon = icons[i] ?? Activity;
            const done = i < analystStep;
            const active = i === analystStep;
            const isValidThreatStep = isThreat && i === 2;
            return (
              <div key={s.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500",
                      done
                        ? isValidThreatStep
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : active
                          ? isValidThreatStep
                            ? "border-red-500 bg-red-50 text-red-600 sim-step-active"
                            : "border-blue-500 bg-blue-50 text-blue-600 sim-step-active"
                          : "border-slate-200 bg-slate-50 text-slate-300",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  {i < analystSteps.length - 1 ? (
                    <div className={cn("w-0.5 flex-1 min-h-[1.25rem]", done ? "bg-emerald-300" : "bg-slate-200")} />
                  ) : null}
                </div>
                <div className={cn("pb-4 min-w-0 flex-1", active && "sim-expand-in")}>
                  <p className={cn("text-xs font-bold", active ? (isValidThreatStep ? "text-red-700" : "text-blue-700") : done ? "text-emerald-700" : "text-slate-400")}>
                    {s.title}
                  </p>
                  {active ? (
                    <>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 sm:text-xs">{s.detail}</p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="sim-progress-bar h-full rounded-full bg-blue-500" />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── 알림 · 칸반 · Sheet 협업 ──
  if (
    phase === "delivery" ||
    phase === "kanban" ||
    phase === "task" ||
    phase === "reply" ||
    phase === "verifying" ||
    phase === "staff-reply"
  ) {
    return <SimulationRunaTaskView sim={sim} showEmail={phase === "delivery"} />;
  }

  // ── 완료 (카드 이동) ──
  if (phase === "complete") {
    return (
      <MiniRunaFrame activeNav="tasks">
        <div
          className={cn(
            "mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold",
            isThreat ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isThreat ? "고객 조치 검증 완료" : "정상 업무 통신 검증 완료"} · {current.code}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <KanbanColumn title="업무 요청" titleClass="text-slate-600" headerClass="bg-slate-100" count={0}>
            <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
          </KanbanColumn>
          <KanbanColumn title="업무 확인" titleClass="text-blue-600" headerClass="bg-sky-50" count={0}>
            <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
          </KanbanColumn>
          <KanbanColumn title="업무 완료" titleClass="text-green-600" headerClass="bg-emerald-50" count={1}>
            <div className="sim-card-enter">
              <TaskCard
                title={current.title}
                code={current.code}
                author="제로티카 분석팀"
                status="조치 완료"
                statusClass={taskStatusClass("completed")}
              />
            </div>
          </KanbanColumn>
        </div>
        <p className="mt-4 text-center text-[11px] text-slate-500">
          {isThreat
            ? "고객 조치 → 분석팀 검증 → 완료 처리"
            : "고객 맥락 답변 → 분석팀 검증 → 완료 처리"}
        </p>
        {activeCase === "normal" ? (
          <button
            type="button"
            onClick={sim.startThreatCase}
            className="sim-click-cue-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
          >
            <AlertTriangle className="h-4 w-4" />
            위험 통신 사례 이어서 보기
          </button>
        ) : (
          <button
            type="button"
            onClick={sim.openReport}
            className="sim-click-cue-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4" />
            보고서에서 확인하기
          </button>
        )}
      </MiniRunaFrame>
    );
  }

  // ── 월간 보고서 (두 사례 통합) ──
  return (
    <div className="space-y-4">
      <SimulationReport highlightNormal highlightThreat />
      <button
        type="button"
        onClick={sim.restart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" />
        처음부터 다시 체험
      </button>
    </div>
  );
}

/** 챕터 인디케이터용 */
export function SimulationChapterIndex({ phase }: { phase: IssueSimulationState["phase"] }) {
  const active = chapterForPhase(phase);
  return (
    <div className="flex gap-1">
      {storyChapters.map((ch, i) => (
        <div key={ch.id} className="flex items-center">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs",
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
