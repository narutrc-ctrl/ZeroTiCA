import { useEffect, useState } from "react";
import { Check, Mail } from "lucide-react";
import { getCaseEmail, getCaseIncident, type CaseIncident } from "@/data/issue-story";
import { JOURNEY_KANBAN_COLUMNS, ISSUE_STATUS } from "@/data/issue-ui-labels";
import { SimulationEmbeddedSheet } from "@/components/interactive-journey/SimulationEmbeddedSheet";
import { SimulationEventDetailPanel } from "@/components/interactive-journey/SimulationEventDetailPanel";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

function KanbanTaskCard({
  incident,
  status,
  statusKey,
  highlight,
  onClick,
  className,
}: {
  incident: CaseIncident;
  status: string;
  statusKey: string;
  highlight?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <TaskCard
        title={incident.title}
        code={incident.code}
        status={status}
        statusClass={taskStatusClass(statusKey)}
        highlight={highlight}
        onClick={onClick}
        dataTaskOpenSwitch={Boolean(onClick)}
      />
    </div>
  );
}

export function SimulationRunaTaskView({
  sim,
  showEmail = false,
}: {
  sim: IssueSimulationState;
  showEmail?: boolean;
}) {
  const {
    phase,
    activeCase,
    current,
    kanbanColumn,
    sheetOpen,
    eventDetailOpen,
    closeEventDetail,
  } = sim;
  const isMobile = useIsMobile();
  const email = getCaseEmail(activeCase);
  const previousIncident = activeCase === "threat" ? getCaseIncident("normal") : null;
  /** 모바일 + 시트 열림: 칸반 대신 인라인 상세 */
  const mobileInlineDetail = isMobile && sheetOpen;

  const showActiveCard = kanbanColumn !== "hidden";
  const highlightNewCard = phase === "delivery" || (phase === "kanban" && kanbanColumn === "pre_request");

  const isDoneColumn = kanbanColumn === "done" || phase === "complete";
  const doneLabel = activeCase === "threat" ? "유효 위협" : "정상";
  const doneStatusKey = activeCase === "threat" ? "threat" : "normal";
  const activeStatus =
    phase === "verifying"
      ? ISSUE_STATUS.checking
      : isDoneColumn
        ? doneLabel
        : phase === "staff-reply"
          ? ISSUE_STATUS.completed
          : ISSUE_STATUS.requested;
  const activeStatusKey =
    phase === "verifying"
      ? "checking"
      : isDoneColumn
        ? doneStatusKey
        : phase === "staff-reply"
          ? "completed"
          : "requested";

  const activeCard = showActiveCard || phase === "complete" ? (
    <KanbanTaskCard
      incident={current}
      status={activeStatus}
      statusKey={activeStatusKey}
      highlight={highlightNewCard}
      className={cn(
        "min-w-0",
        kanbanColumn === "pre_request" && (phase === "delivery" || phase === "kanban") && "sim-card-enter",
        isDoneColumn && "sim-card-enter",
      )}
    />
  ) : null;

  const previousDoneCard = previousIncident ? (
    <KanbanTaskCard incident={previousIncident} status="정상" statusKey="normal" className="opacity-90" />
  ) : null;

  const emptySlot = (
    <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
  );

  /** 검증 5/5 — 사례 A 검증 결과 플로팅 카드 */
  const showCaseAResult = !sheetOpen && activeCase === "normal" && phase === "complete";

  /** 모바일: 활성 단계 컬럼만 (확인 요청 / 확인 완료) */
  const mobileOnlyPre = kanbanColumn === "pre_request" && phase !== "complete";
  const mobileOnlyDone = isDoneColumn;
  const hideOnMobileWhenFocused = (focus: "pre" | "done" | "other") => {
    if (focus === "pre") return mobileOnlyDone ? "hidden sm:flex" : undefined;
    if (focus === "done") return mobileOnlyPre ? "hidden sm:flex" : undefined;
    return mobileOnlyPre || mobileOnlyDone ? "hidden sm:flex" : undefined;
  };

  return (
    <div className="relative h-auto sm:h-full">
      {mobileInlineDetail ? (
        <SimulationEmbeddedSheet sim={sim} open variant="inline" />
      ) : (
        <div className="relative h-full">
          {showEmail ? (
            <div className="sim-email-in absolute right-2 top-2 z-10 max-w-[220px] overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400">메일 알림</p>
                  <p className="truncate text-[10px] font-semibold text-zinc-800">{email.subject}</p>
                </div>
              </div>
            </div>
          ) : null}

          <MiniRunaFrame activeNav="tasks" showNotification variant="cropped" className="h-full border-0 shadow-none">
            <div className="relative flex h-full flex-col">
              {showCaseAResult ? (
                <div className="sim-email-in absolute bottom-2 left-[30%] z-10 hidden w-[min(92%,288px)] -translate-x-1/2 rounded-full border border-emerald-100 bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.1)] sm:block">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-4 w-4" strokeWidth={2.75} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium leading-none text-slate-400">사례 A 검증 결과</p>
                      <p className="mt-1 text-[13px] font-bold leading-snug text-emerald-700 [word-break:keep-all]">
                        정상 업무 통신으로 확인
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex min-h-0 w-full flex-1 gap-1.5 p-1">
                {/* 모바일: 확인 요청(1/5) 또는 확인 완료(5/5)만 — 3열 압착 방지 */}
                <KanbanColumn
                  title={JOURNEY_KANBAN_COLUMNS.pre_request}
                  titleClass="text-slate-600"
                  headerClass="bg-slate-100"
                  count={kanbanColumn === "pre_request" && phase !== "complete" ? 1 : 0}
                  showArrow
                  compact
                  className={hideOnMobileWhenFocused("pre")}
                  arrowClassName={
                    mobileOnlyPre || mobileOnlyDone ? "hidden sm:flex" : undefined
                  }
                >
                  {kanbanColumn === "pre_request" && phase !== "complete" ? activeCard : emptySlot}
                </KanbanColumn>
                <KanbanColumn
                  title={JOURNEY_KANBAN_COLUMNS.in_request}
                  titleClass="text-blue-600"
                  headerClass="bg-sky-50"
                  count={kanbanColumn === "in_request" && phase !== "complete" ? 1 : 0}
                  showArrow
                  compact
                  className={hideOnMobileWhenFocused("other")}
                  arrowClassName={
                    mobileOnlyPre || mobileOnlyDone ? "hidden sm:flex" : undefined
                  }
                >
                  {kanbanColumn === "in_request" && phase !== "complete" ? activeCard : emptySlot}
                </KanbanColumn>
                <KanbanColumn
                  title={JOURNEY_KANBAN_COLUMNS.done}
                  titleClass="text-green-600"
                  headerClass="bg-emerald-50"
                  count={isDoneColumn ? (previousIncident ? 2 : 1) : previousIncident ? 1 : 0}
                  compact
                  className={hideOnMobileWhenFocused("done")}
                >
                  {isDoneColumn || previousIncident ? (
                    <div className="space-y-2">
                      {previousDoneCard}
                      {isDoneColumn ? activeCard : null}
                    </div>
                  ) : (
                    emptySlot
                  )}
                </KanbanColumn>
              </div>
            </div>
          </MiniRunaFrame>

          {!isMobile ? <SimulationEmbeddedSheet sim={sim} open={sheetOpen} variant="overlay" /> : null}
        </div>
      )}

      {eventDetailOpen ? (
        <SimulationEventDetailPanel detail={current.eventDetail} onClose={closeEventDetail} />
      ) : null}
    </div>
  );
}
