import { useEffect, useRef } from "react";
import {
  Calendar,
  Hash,
  MessageSquare,
  Send,
  Shield,
  User,
  X,
} from "lucide-react";
import type { IssueSimulationState } from "@/hooks/useIssueSimulation";
import { ISSUE_STATUS } from "@/data/issue-ui-labels";
import { taskStatusClass } from "@/components/MockRunaShell";
import { cn } from "@/lib/cn";

export function SimulationEmbeddedSheet({
  sim,
  open,
  /** overlay: 데스크톱 사이드 시트 / inline: 모바일 본문 펼침(내부 스크롤 없음) */
  variant = "overlay",
}: {
  sim: IssueSimulationState;
  open: boolean;
  variant?: "overlay" | "inline";
}) {
  const { phase, current, activeCase, taskStatus, comments, replyDraft } = sim;
  const isThreat = activeCase === "threat";
  const statusKey =
    phase === "verifying" ? "checking" : phase === "staff-reply" || taskStatus === ISSUE_STATUS.completed ? "completed" : "requested";
  const statusLabel =
    phase === "verifying" ? ISSUE_STATUS.checking : phase === "staff-reply" || taskStatus === ISSUE_STATUS.completed ? ISSUE_STATUS.completed : ISSUE_STATUS.requested;

  /** 검증 3·4단계(reply / staff-reply): 하단(댓글·답변)으로 시선 유도 */
  const pinBottom = phase === "reply" || phase === "staff-reply";
  const bodyRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const inline = variant === "inline";
  /** 모바일 인라인: 메타 필드 생략 */
  const hideMetaFields = inline;

  useEffect(() => {
    if (!open || !pinBottom) return;
    if (inline) {
      const el = bottomAnchorRef.current;
      if (!el) return;
      const snap = () => {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      };
      requestAnimationFrame(snap);
      return;
    }
    const el = bodyRef.current;
    if (!el) return;
    const snap = () => {
      el.scrollTop = el.scrollHeight;
    };
    snap();
    requestAnimationFrame(snap);
  }, [open, pinBottom, phase, comments, replyDraft, inline]);

  if (!open) return null;

  const body = (
    <div className="space-y-3 text-xs">
      {!hideMetaFields ? (
        <>
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
        </>
      ) : null}

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
                  <span className={cn("font-medium [word-break:keep-all]", isThreat ? "text-red-700" : "text-blue-700")}>
                    {current.eventType}
                  </span>
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
      </div>

      <div className="space-y-1.5 leading-relaxed text-slate-700">
        {current.content.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {current.actionNotes && phase !== "task" ? (
        <p className="rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600">{current.actionNotes}</p>
      ) : null}

      <div ref={bottomAnchorRef}>
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
  );

  const replyFooter =
    phase === "reply" ? (
      <div className={cn(inline ? "mt-3 border-t border-slate-100 pt-3" : "shrink-0 border-t border-slate-100 p-3")}>
        <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3">
          <label className="text-[10px] font-medium text-slate-500">
            {isThreat ? "고객 조치 내용" : "고객 답변"}
          </label>
          <textarea
            readOnly
            value={replyDraft}
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
          />
          <div className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            <Send className="h-4 w-4" />
            답변 등록
          </div>
        </div>
      </div>
    ) : null;

  if (inline) {
    return (
      <article className="sim-slide-in flex w-full flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-bold leading-snug text-zinc-800 [word-break:keep-all]">
            {current.title}
          </h2>
          <span
            className={cn(
              "mt-1.5 inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-semibold",
              taskStatusClass(statusKey),
            )}
          >
            {statusLabel}
          </span>
        </div>
        <div className="px-4 py-3">
          {body}
          {replyFooter}
        </div>
      </article>
    );
  }

  return (
    <>
      <div className="absolute inset-0 z-10 bg-slate-900/15" aria-hidden />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 z-20 flex w-[min(92%,440px)] flex-col border-l border-slate-200 bg-white shadow-2xl sim-slide-in",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-snug text-zinc-800 sm:text-base">{current.title}</h2>
            <span
              className={cn(
                "mt-1.5 inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-semibold",
                taskStatusClass(statusKey),
              )}
            >
              {statusLabel}
            </span>
          </div>
          <span className="rounded-lg p-1.5 text-slate-400" aria-hidden>
            <X className="h-4 w-4" />
          </span>
        </div>

        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {body}
        </div>

        {replyFooter}
      </aside>
    </>
  );
}
