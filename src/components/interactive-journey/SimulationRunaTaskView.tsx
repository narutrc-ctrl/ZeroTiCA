import { Mail } from "lucide-react";
import { getCaseEmail, getCaseIncident, type CaseIncident } from "@/data/issue-story";
import { SimulationEmbeddedSheet } from "@/components/interactive-journey/SimulationEmbeddedSheet";
import { SimulationEventDetailPanel } from "@/components/interactive-journey/SimulationEventDetailPanel";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

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
        author="제로티카 분석팀"
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
    openTask,
    openEventDetail,
    closeEventDetail,
  } = sim;
  const email = getCaseEmail(activeCase);
  const previousIncident = activeCase === "threat" ? getCaseIncident("normal") : null;

  const showActiveCard = kanbanColumn !== "hidden";
  const waitCardClick = phase === "kanban" && kanbanColumn === "pre_request";
  const activeInConfirm = kanbanColumn === "pre_request" || kanbanColumn === "in_request";
  const activeInDone = kanbanColumn === "done";
  const highlightNewCard = phase === "delivery" || waitCardClick;

  const activeStatus =
    phase === "verifying" ? "확인 중" : activeInDone || phase === "staff-reply" ? "조치 완료" : "확인 요청";
  const activeStatusKey =
    phase === "verifying" ? "checking" : activeInDone || phase === "staff-reply" ? "completed" : "requested";

  const confirmCount = activeInConfirm ? 1 : 0;
  const doneCount = previousIncident ? (activeInDone ? 2 : 1) : activeInDone ? 1 : 0;

  const activeCard = showActiveCard ? (
    <KanbanTaskCard
      incident={current}
      status={activeStatus}
      statusKey={activeStatusKey}
      highlight={waitCardClick || highlightNewCard}
      onClick={waitCardClick ? openTask : undefined}
      className={cn(
        kanbanColumn === "pre_request" && (phase === "delivery" || phase === "kanban") && "sim-card-enter",
        highlightNewCard && "sim-spotlight-ring rounded-xl",
        activeInDone && "sim-card-enter",
      )}
    />
  ) : null;

  const previousDoneCard = previousIncident ? (
    <KanbanTaskCard
      incident={previousIncident}
      status="조치 완료"
      statusKey="completed"
      className="opacity-90"
    />
  ) : null;

  const emptySlot = (
    <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
  );

  return (
    <div className="relative h-full">
      {showEmail ? (
        <div className="sim-email-in absolute right-2 top-2 z-10 max-w-[220px] overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400">메일 알림</p>
              <p className="truncate text-[10px] font-semibold text-slate-900">{email.subject}</p>
            </div>
          </div>
        </div>
      ) : null}

      <MiniRunaFrame activeNav="tasks" showNotification variant="cropped" className="h-full border-0 shadow-none">
        <div className="flex h-full flex-col">
          <p className="mb-2 text-[10px] font-semibold text-slate-500">업무 확인 · 칸반</p>
          <div className="flex min-h-0 flex-1 gap-2">
            <KanbanColumn
              title="업무 확인"
              titleClass="text-blue-600"
              headerClass="bg-sky-50"
              count={confirmCount}
              showArrow
              compact
            >
              {activeInConfirm ? activeCard : emptySlot}
            </KanbanColumn>
            <KanbanColumn
              title="업무 완료"
              titleClass="text-green-600"
              headerClass="bg-emerald-50"
              count={doneCount}
              compact
            >
              {doneCount > 0 ? (
                <div className="space-y-2">
                  {previousDoneCard}
                  {activeInDone ? activeCard : null}
                </div>
              ) : (
                emptySlot
              )}
            </KanbanColumn>
          </div>
        </div>
      </MiniRunaFrame>

      <SimulationEmbeddedSheet sim={sim} open={sheetOpen} onEventClick={openEventDetail} />
      {eventDetailOpen ? (
        <SimulationEventDetailPanel detail={current.eventDetail} onClose={closeEventDetail} />
      ) : null}
    </div>
  );
}
