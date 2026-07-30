import {
  ArrowRight,
  Calendar,
  Hash,
  Loader2,
  MessageSquare,
  MousePointerClick,
  Send,
  Shield,
  User,
  X,
} from "lucide-react";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { ISSUE_STATUS } from "@/data/issue-ui-labels";
import { taskStatusClass } from "@/components/MockRunaShell";
import { cn } from "@/lib/cn";

function ClickCue({ children }: { children: React.ReactNode }) {
  return (
    <p className="sim-click-cue mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-600">
      <MousePointerClick className="h-3 w-3" />
      {children}
    </p>
  );
}

export function SimulationEmbeddedSheet({
  sim,
  open,
  onEventClick,
}: {
  sim: IssueSimulationState;
  open: boolean;
  onEventClick: () => void;
}) {
  const { phase, current, activeCase, taskStatus, comments, replyDraft, replyTyping } = sim;
  const isThreat = activeCase === "threat";
  const statusKey =
    phase === "verifying" ? "checking" : phase === "staff-reply" || taskStatus === ISSUE_STATUS.completed ? "completed" : "requested";
  const statusLabel =
    phase === "verifying" ? ISSUE_STATUS.checking : phase === "staff-reply" || taskStatus === ISSUE_STATUS.completed ? ISSUE_STATUS.completed : ISSUE_STATUS.requested;

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-10 bg-slate-900/15"
        aria-label="시트 배경"
        onClick={() => undefined}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 z-20 flex w-[min(92%,440px)] flex-col border-l border-slate-200 bg-white shadow-2xl sim-slide-in",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-snug text-zinc-800 sm:text-base">{current.title}</h2>
            <span className={cn("mt-1.5 inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-semibold", taskStatusClass(statusKey))}>
              {statusLabel}
            </span>
          </div>
          <button type="button" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="닫기">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-3 text-xs">
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <Calendar className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400">요청일시</p>
                <p className="text-slate-700">{current.requestedAt}</p>
              </div>
            </div>
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <User className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400">검토 담당자</p>
                <p className="text-slate-700">{current.assignee}</p>
              </div>
            </div>
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <Hash className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400">관리코드</p>
                <p className="font-mono text-slate-700">{current.code}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-medium text-slate-500">위협 내역</span>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-2 py-1.5">일시</th>
                      <th className="border-l border-slate-100 px-2 py-1.5">이벤트 명</th>
                      <th className="border-l border-slate-100 px-2 py-1.5">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1.5">{current.relatedThreatAt}</td>
                      <td className="border-l border-slate-100 px-2 py-1.5">
                        <button
                          type="button"
                          onClick={onEventClick}
                          className={cn(
                            "sim-click-cue-target text-left font-medium underline-offset-2 hover:underline",
                            isThreat ? "text-red-700" : "text-blue-700",
                          )}
                        >
                          {current.eventType}
                        </button>
                      </td>
                      <td className="border-l border-slate-100 px-2 py-1.5">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                            current.eventDetail.checked === 5
                              ? "bg-red-950 text-red-300"
                              : "bg-yellow-50 text-yellow-700",
                          )}
                        >
                          {current.eventDetail.checkedLabel}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {phase === "task" ? <ClickCue>이벤트명을 클릭해 상세 로그를 확인하세요</ClickCue> : null}
            </div>

            <div className="space-y-1.5 leading-relaxed text-slate-700">
              {current.content.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {current.actionNotes && phase !== "task" ? (
              <p className="rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600">{current.actionNotes}</p>
            ) : null}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-[11px] font-semibold text-slate-800">댓글</h3>
              </div>
              <ul className="space-y-2">
                {comments.map((c, idx) => {
                  const isLatestStaff = phase === "staff-reply" && c.role === "staff" && idx === comments.length - 1;
                  return (
                  <li
                    key={`${c.at}-${c.body.slice(0, 12)}`}
                    className={cn(
                      "rounded-lg p-2 text-[11px]",
                      c.role === "staff" ? "bg-slate-50" : "bg-sky-50",
                      isLatestStaff && "sim-spotlight-glow border border-emerald-200",
                    )}
                  >
                    <p className="text-[10px] text-slate-500">
                      {c.author} · {c.at}
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-700">{c.body}</p>
                  </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-3">
          {phase === "verifying" ? (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <p className="text-xs font-medium text-slate-600">
                {isThreat ? "분석팀이 고객 조치 결과를 검증 중…" : "분석팀이 업무 맥락을 검증 중…"}
              </p>
            </div>
          ) : null}

          {phase === "reply" ? (
            <div className="sim-spotlight-ring rounded-lg border border-blue-200 bg-blue-50/30 p-3">
              <label className="text-[10px] font-medium text-slate-500">{isThreat ? "고객 조치 내용" : "고객 답변"}</label>
              <textarea
                readOnly
                value={replyDraft}
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
              />
              {!replyTyping ? (
                <button
                  type="button"
                  onClick={sim.submitReply}
                  className="sim-click-cue-target mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  <Send className="h-4 w-4" />
                  답변 등록
                </button>
              ) : null}
            </div>
          ) : null}

          {phase === "task" ? (
            <button
              type="button"
              onClick={sim.startReply}
              className="sim-click-cue-target inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700"
            >
              {isThreat ? "조치 내용 답변하기" : "맥락 답변하기"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
}
