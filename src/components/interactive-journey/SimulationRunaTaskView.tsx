import { Calendar, LayoutGrid, List, Mail } from "lucide-react";
import { getCaseEmail } from "@/data/issue-story";
import { SimulationEmbeddedSheet } from "@/components/interactive-journey/SimulationEmbeddedSheet";
import { SimulationEventDetailPanel } from "@/components/interactive-journey/SimulationEventDetailPanel";
import { MiniRunaFrame } from "@/components/interactive-journey/MiniRunaFrame";
import { KanbanColumn, TaskCard, taskStatusClass } from "@/components/MockRunaShell";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { cn } from "@/lib/cn";

function ClickCue({ children }: { children: React.ReactNode }) {
  return (
    <p className="sim-click-cue mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-600">
      {children}
    </p>
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
  const showCard = kanbanColumn !== "hidden";
  const waitCardClick = phase === "kanban" && kanbanColumn === "pre_request";
  const cardStatus =
    phase === "verifying" ? "확인 중" : kanbanColumn === "done" || phase === "staff-reply" ? "조치 완료" : "확인 요청";
  const cardStatusKey =
    phase === "verifying" ? "checking" : kanbanColumn === "done" || phase === "staff-reply" ? "completed" : "requested";

  const card = showCard ? (
    <div className={cn(kanbanColumn === "pre_request" && phase === "delivery" && "sim-card-enter")}>
      <TaskCard
        title={current.title}
        code={current.code}
        author="제로티카 분석팀"
        status={cardStatus}
        statusClass={taskStatusClass(cardStatusKey)}
        highlight={waitCardClick}
        onClick={waitCardClick ? openTask : undefined}
        dataTaskOpenSwitch
      />
      {waitCardClick ? <ClickCue>업무 요청 카드를 클릭하세요</ClickCue> : null}
    </div>
  ) : (
    <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">—</div>
  );

  return (
    <div className="space-y-3">
      {showEmail ? (
        <div className={cn("sim-slide-in rounded-xl border border-slate-200 bg-white p-3 shadow-lg", "sim-email-in")}>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400">
                {email.from} · {email.time}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-900">{email.subject}</p>
              <p className="mt-1 text-[11px] text-slate-600">{email.preview}</p>
            </div>
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">NEW</span>
          </div>
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-xl">
        <MiniRunaFrame activeNav="tasks" showNotification className="min-h-[460px]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">업무 관리</p>
              <p className="text-[10px] text-slate-500">2026-05-01 ~ 2026-05-31</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 text-[10px]">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700">
                <LayoutGrid className="h-3 w-3" />
                칸반
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 text-slate-400">
                <List className="h-3 w-3" />
                목록
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 text-slate-400">
                <Calendar className="h-3 w-3" />
                기간
              </span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <KanbanColumn title="업무 요청" titleClass="text-slate-600" headerClass="bg-slate-100" count={kanbanColumn === "pre_request" ? 1 : 0} showArrow>
              {kanbanColumn === "pre_request" ? card : (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">—</div>
              )}
            </KanbanColumn>
            <KanbanColumn title="업무 확인" titleClass="text-blue-600" headerClass="bg-sky-50" count={kanbanColumn === "in_request" ? 1 : 0} showArrow>
              {kanbanColumn === "in_request" ? card : (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">—</div>
              )}
            </KanbanColumn>
            <KanbanColumn title="업무 완료" titleClass="text-green-600" headerClass="bg-emerald-50" count={kanbanColumn === "done" ? 1 : 0}>
              {kanbanColumn === "done" ? card : (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-[10px] text-slate-400">—</div>
              )}
            </KanbanColumn>
          </div>
        </MiniRunaFrame>

        <SimulationEmbeddedSheet sim={sim} open={sheetOpen} onEventClick={openEventDetail} />
        {eventDetailOpen ? (
          <SimulationEventDetailPanel detail={current.eventDetail} onClose={closeEventDetail} />
        ) : null}
      </div>
    </div>
  );
}
