import { Mail } from "lucide-react";
import { getCaseEmail, getCaseIncident, type CaseIncident } from "@/data/issue-story";
import { JOURNEY_KANBAN_COLUMNS, ISSUE_STATUS } from "@/data/issue-ui-labels";
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
  const email = getCaseEmail(activeCase);
  const previousIncident = activeCase === "threat" ? getCaseIncident("normal") : null;

  const showActiveCard = kanbanColumn !== "hidden";
  const highlightNewCard = phase === "delivery" || (phase === "kanban" && kanbanColumn === "pre_request");

  const isDoneColumn = kanbanColumn === "done" || phase === "complete";
  const activeStatus =
    phase === "verifying"
      ? ISSUE_STATUS.checking
      : isDoneColumn || phase === "staff-reply"
        ? ISSUE_STATUS.completed
        : ISSUE_STATUS.requested;
  const activeStatusKey =
    phase === "verifying" ? "checking" : isDoneColumn || phase === "staff-reply" ? "completed" : "requested";

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
    <KanbanTaskCard incident={previousIncident} status={ISSUE_STATUS.completed} statusKey="completed" className="opacity-90" />
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
              <p className="truncate text-[10px] font-semibold text-zinc-800">{email.subject}</p>
            </div>
          </div>
        </div>
      ) : null}

      <MiniRunaFrame activeNav="tasks" showNotification variant="cropped" className="h-full border-0 shadow-none">
        <div className="flex h-full flex-col">
          <div className="flex min-h-0 w-full flex-1 gap-1.5 p-1">
            <KanbanColumn
              title={JOURNEY_KANBAN_COLUMNS.pre_request}
              titleClass="text-slate-600"
              headerClass="bg-slate-100"
              count={kanbanColumn === "pre_request" && phase !== "complete" ? 1 : 0}
              showArrow
              compact
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
            >
              {kanbanColumn === "in_request" && phase !== "complete" ? activeCard : emptySlot}
            </KanbanColumn>
            <KanbanColumn
              title={JOURNEY_KANBAN_COLUMNS.done}
              titleClass="text-green-600"
              headerClass="bg-emerald-50"
              count={isDoneColumn ? (previousIncident ? 2 : 1) : previousIncident ? 1 : 0}
              compact
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

      <SimulationEmbeddedSheet sim={sim} open={sheetOpen} />
      {eventDetailOpen ? (
        <SimulationEventDetailPanel detail={current.eventDetail} onClose={closeEventDetail} />
      ) : null}
    </div>
  );
}
