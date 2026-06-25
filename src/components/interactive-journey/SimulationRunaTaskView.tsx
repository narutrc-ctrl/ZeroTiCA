import { Mail } from "lucide-react";
import { getCaseEmail } from "@/data/issue-story";
import { SimulationEmbeddedSheet } from "@/components/interactive-journey/SimulationEmbeddedSheet";
import { SimulationEventDetailPanel } from "@/components/interactive-journey/SimulationEventDetailPanel";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

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
  const showCard = kanbanColumn !== "hidden";
  const waitCardClick = phase === "kanban" && kanbanColumn === "pre_request";
  const cardInConfirmColumn = kanbanColumn === "pre_request" || kanbanColumn === "in_request";
  const highlightNewCard = phase === "delivery" || waitCardClick;
  const cardStatus =
    phase === "verifying" ? "확인 중" : kanbanColumn === "done" || phase === "staff-reply" ? "조치 완료" : "확인 요청";
  const cardStatusKey =
    phase === "verifying" ? "checking" : kanbanColumn === "done" || phase === "staff-reply" ? "completed" : "requested";

  const card = showCard ? (
    <div
      className={cn(
        kanbanColumn === "pre_request" && phase === "delivery" && "sim-card-enter",
        highlightNewCard && "sim-spotlight-ring rounded-xl",
      )}
    >
      <TaskCard
        title={current.title}
        code={current.code}
        author="제로티카 분석팀"
        status={cardStatus}
        statusClass={taskStatusClass(cardStatusKey)}
        highlight={waitCardClick || highlightNewCard}
        onClick={waitCardClick ? openTask : undefined}
        dataTaskOpenSwitch
      />
    </div>
  ) : (
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
              count={cardInConfirmColumn ? 1 : 0}
              showArrow
              compact
            >
              {cardInConfirmColumn ? card : (
                <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
              )}
            </KanbanColumn>
            <KanbanColumn title="업무 완료" titleClass="text-green-600" headerClass="bg-emerald-50" count={kanbanColumn === "done" ? 1 : 0} compact>
              {kanbanColumn === "done" ? card : (
                <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">—</div>
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
