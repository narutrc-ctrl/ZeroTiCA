import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  MousePointerClick,
  Radar,
  Send,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  analystSteps,
  chapterForPhase,
  emailNotification,
  incident,
  monitoringLogs,
  reportSections,
  storyChapters,
} from "@/data/issue-story";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import { BrandMark } from "@/components/BrandLogo";
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

function ClickCue({ children }: { children: React.ReactNode }) {
  return (
    <p className="sim-click-cue mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600">
      <MousePointerClick className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

export function SimulationStage({ sim }: { sim: IssueSimulationState }) {
  const { phase, analystStep, logCount, eventCount, issueCount, riskLevel, cardInColumn, replyDraft, replyTyping, taskStatus, comments } = sim;

  // ── 모니터링 / 이상 징후 ──
  if (phase === "monitoring" || phase === "anomaly") {
    const isAnomaly = phase === "anomaly";
    const logs = monitoringLogs.slice(0, isAnomaly ? monitoringLogs.length : logCount);

    return (
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300">네트워크 모니터링 · 실시간</p>
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
            <div className="sim-slide-in mt-3 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-xs font-medium text-amber-100">
                <span className="font-mono text-amber-300">{incident.srcIp}</span> → {incident.dstIp} · 이상 패턴 감지
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
                      ? "border-amber-500/50 bg-amber-950/60 text-amber-100"
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
            return (
              <div key={s.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500",
                      done
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : active
                          ? "border-blue-500 bg-blue-50 text-blue-600 sim-step-active"
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
                  <p className={cn("text-xs font-bold", active ? "text-blue-700" : done ? "text-emerald-700" : "text-slate-400")}>
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

  // ── 알림 전달 (메일 + 칸반 동시) ──
  if (phase === "delivery" || phase === "kanban") {
    const showCard = cardInColumn !== "hidden";
    const cardReady = cardInColumn === "ready" || cardInColumn === "done";
    const waitClick = phase === "kanban" && cardReady;

    return (
      <div className="space-y-3">
        <div className={cn("sim-slide-in rounded-xl border border-slate-200 bg-white p-3 shadow-lg", phase === "delivery" && "sim-email-in")}>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400">
                {emailNotification.from} · {emailNotification.time}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-900">{emailNotification.subject}</p>
              <p className="mt-1 text-[11px] text-slate-600">{emailNotification.preview}</p>
            </div>
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">NEW</span>
          </div>
        </div>

        <MiniRunaFrame activeNav="tasks" showNotification>
          <p className="mb-2 text-xs font-semibold text-slate-700">RUNA · 업무 관리</p>
          <div className="flex gap-2 overflow-x-auto">
            <KanbanColumn title="업무 요청" titleClass="text-slate-600" headerClass="bg-slate-100" count={0}>
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">—</div>
            </KanbanColumn>
            <KanbanColumn title="업무 확인" titleClass="text-blue-600" headerClass="bg-sky-50" count={showCard ? 1 : 0} showArrow>
              {showCard ? (
                <div className={cn("transition-all duration-700", cardInColumn === "entering" && "sim-card-enter")}>
                  <TaskCard
                    title={incident.title}
                    code={incident.code}
                    author="제로티카 분석팀"
                    status="확인 요청"
                    statusClass={taskStatusClass("requested")}
                    highlight={waitClick}
                    onClick={waitClick ? sim.openTask : undefined}
                  />
                  {waitClick ? <ClickCue>이 업무 카드를 클릭하세요</ClickCue> : null}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">
                  대기 중…
                </div>
              )}
            </KanbanColumn>
            <KanbanColumn title="업무 완료" titleClass="text-green-600" headerClass="bg-emerald-50" count={0}>
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">—</div>
            </KanbanColumn>
          </div>
        </MiniRunaFrame>
      </div>
    );
  }

  // ── Task 상세 / 댓글 / 검증 ──
  if (phase === "task" || phase === "reply" || phase === "verifying" || phase === "staff-reply") {
    const statusKey = phase === "verifying" || phase === "staff-reply" ? "checking" : "requested";

    return (
      <MiniRunaFrame activeNav="tasks">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">확인 요청</span>
              <span className="font-mono text-[10px] text-slate-400">{incident.code}</span>
            </div>
            <h4 className="mt-2 text-sm font-bold leading-snug text-slate-900">{incident.title}</h4>
            <span className={cn("mt-2 inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-semibold", taskStatusClass(statusKey))}>
              {phase === "verifying" ? "확인 중" : taskStatus}
            </span>
          </div>

          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">의심 통신 개요</p>
            <p className="mt-1 text-xs text-slate-700">{incident.eventType}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-3">
              <div className="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-100">
                <p className="text-slate-400">출발지</p>
                <p className="font-mono font-semibold text-slate-800">{incident.srcIp}</p>
              </div>
              <div className="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-100">
                <p className="text-slate-400">목적지</p>
                <p className="font-mono font-semibold text-slate-800">{incident.dstIp}</p>
              </div>
              <div className="col-span-2 rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-100 sm:col-span-1">
                <p className="text-slate-400">탐지 시각</p>
                <p className="font-semibold text-slate-800">{incident.detectedAt}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold text-slate-500">고객 확인 항목</p>
            <ul className="mt-2 space-y-1.5">
              {incident.customerChecks.map((item) => (
                <li key={item} className="flex gap-2 text-[11px] text-slate-600 sm:text-xs">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 border-t border-slate-100 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <MessageSquare className="h-3.5 w-3.5" />
              댓글 · 협업
            </div>
            <ul className="max-h-40 space-y-2 overflow-y-auto">
              {comments.map((c) => (
                <li key={`${c.at}-${c.body.slice(0, 12)}`} className={cn("rounded-lg p-2.5 text-xs", c.role === "staff" ? "bg-slate-50" : "bg-sky-50")}>
                  <p className="text-[10px] text-slate-500">{c.author} · {c.at}</p>
                  <p className="mt-1 leading-relaxed text-slate-700">{c.body}</p>
                </li>
              ))}
            </ul>

            {phase === "verifying" ? (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <p className="text-xs font-medium text-slate-600">분석팀이 고객 답변을 반영해 재검토 중…</p>
                <p className="text-[10px] text-slate-400">RUNA · 확인 중</p>
              </div>
            ) : null}

            {phase === "reply" ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3">
                <label className="text-[10px] font-medium text-slate-500">고객 답변</label>
                <textarea
                  readOnly
                  value={replyDraft}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-800"
                />
                {replyTyping ? (
                  <p className="mt-1 text-[10px] text-slate-400">입력 중…</p>
                ) : (
                  <button
                    type="button"
                    onClick={sim.submitReply}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    <Send className="h-4 w-4" />
                    답변 등록
                  </button>
                )}
              </div>
            ) : null}

            {phase === "staff-reply" ? (
              <button
                type="button"
                onClick={sim.completeTask}
                className="sim-click-cue-target inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                업무 완료 처리
              </button>
            ) : null}

            {phase === "task" ? (
              <button
                type="button"
                onClick={sim.startReply}
                className="sim-click-cue-target inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                맥락 답변하기
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </MiniRunaFrame>
    );
  }

  // ── 완료 (카드 이동) ──
  if (phase === "complete") {
    return (
      <MiniRunaFrame activeNav="tasks">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          조치 완료 · {incident.code}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <KanbanColumn title="업무 확인" titleClass="text-blue-600" headerClass="bg-sky-50" count={0}>
            <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
          </KanbanColumn>
          <KanbanColumn title="업무 완료" titleClass="text-green-600" headerClass="bg-emerald-50" count={1}>
            <div className="sim-card-enter">
              <TaskCard
                title={incident.title}
                code={incident.code}
                author="제로티카 분석팀"
                status="업무 완료"
                statusClass={taskStatusClass("completed")}
              />
            </div>
          </KanbanColumn>
        </div>
        <p className="mt-4 text-center text-[11px] text-slate-500">탐지 → 분석 → RUNA 확인 → 고객 답변 → 검증 → 완료</p>
      </MiniRunaFrame>
    );
  }

  // ── 월간 보고서 ──
  return (
    <div className="max-h-[540px] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-xs font-semibold text-slate-900">{reportSections.title}</p>
            <p className="text-[10px] text-slate-500">{reportSections.period}</p>
          </div>
        </div>
        <BrandMark size="sm" />
      </div>
      <div className="p-5 text-xs">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { l: "검증", v: reportSections.stats.verified },
            { l: "정상", v: reportSections.stats.normal },
            { l: "주의", v: reportSections.stats.caution },
            { l: "조치 완료", v: reportSections.stats.completed },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-slate-50 px-3 py-2 text-center">
              <p className="text-[10px] text-slate-500">{s.l}</p>
              <p className="text-lg font-bold text-slate-900">{s.v}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 font-bold text-slate-900">주요 확인 요청</h3>
        <div className="sim-report-highlight mt-2 rounded-xl border-2 border-blue-200 bg-blue-50/60 p-4 ring-2 ring-blue-100">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">방금 처리</span>
            <span className="font-mono text-[10px] text-slate-500">{incident.code}</span>
          </div>
          <p className="mt-2 font-semibold text-slate-900">{incident.title}</p>
          <p className="mt-2 text-slate-600">{incident.reportSummary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              {incident.reportVerdict}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] text-slate-600">화이트리스트 권고</span>
          </div>
        </div>

        <h3 className="mt-6 font-bold text-slate-900">정상 / 위협 / 조치 완료 요약</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
            <span className="text-slate-700">정상 (업무 통신 확인)</span>
            <span className="font-bold text-emerald-700">{reportSections.stats.normal}건</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
            <span className="text-slate-700">주의 (추가 모니터링)</span>
            <span className="font-bold text-amber-700">{reportSections.stats.caution}건</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
            <span className="text-slate-700">위협 (조치 완료)</span>
            <span className="font-bold text-red-700">{reportSections.stats.threat}건</span>
          </div>
        </div>
      </div>
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
