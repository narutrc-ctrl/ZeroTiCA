import { useEffect, useState } from "react";
import { Calendar, Hash, MessageSquare, Shield, User, X } from "lucide-react";
import type { DemoRelatedThreat, DemoTask } from "@/data/demo-runa-data";
import { SimulationEventDetailPanel } from "@/components/interactive-journey/SimulationEventDetailPanel";
import { taskStatusClass } from "@/components/MockRunaShell";
import type { DemoExplorationMode } from "@/lib/analytics";
import { trackDemoThreatDetailView } from "@/lib/analytics";
import { cn } from "@/lib/cn";

function DetailInfoField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export function TaskDetailSheet({
  task,
  open,
  onClose,
  hideBackdrop = false,
  explorationMode = "self",
}: {
  task: DemoTask | null;
  open: boolean;
  onClose: () => void;
  hideBackdrop?: boolean;
  explorationMode?: DemoExplorationMode;
}) {
  const [showContent, setShowContent] = useState(false);
  const [entered, setEntered] = useState(false);
  const [eventDetail, setEventDetail] = useState<DemoRelatedThreat["eventDetail"] | null>(null);

  useEffect(() => {
    if (open) {
      setEntered(false);
      setShowContent(false);
      setEventDetail(null);
      const enterTimer = window.setTimeout(() => setEntered(true), 20);
      const contentTimer = window.setTimeout(() => setShowContent(true), 180);
      return () => {
        window.clearTimeout(enterTimer);
        window.clearTimeout(contentTimer);
      };
    }
    setEntered(false);
    setShowContent(false);
    setEventDetail(null);
  }, [open, task?.id]);

  if (!task) return null;

  return (
    <>
      {open && !hideBackdrop && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/20"
          aria-label="시트 닫기"
          onClick={onClose}
        />
      )}

      <aside
        data-tour="task-detail"
        data-task-detail-sheet
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-3xl flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out",
          open && entered ? "translate-x-0" : "translate-x-full pointer-events-none",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-xl font-bold leading-tight text-zinc-800 sm:text-2xl">
              {task.title}
            </h2>
            <span
              className={cn(
                "mt-2 inline-flex rounded-xl border px-3 py-1 text-xs font-semibold",
                taskStatusClass(task.status),
              )}
            >
              {task.statusLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {!showContent ? (
              <div className="flex items-center justify-center py-12 text-sm text-slate-500">
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                내용을 불러오는 중...
              </div>
            ) : (
              <div className="space-y-6">
                <section className="rounded-xl bg-white">
                  <DetailInfoField icon={<Calendar className="h-4 w-4" />} label="요청일시">
                    <span className="text-sm text-slate-700">{task.requestedAt}</span>
                  </DetailInfoField>
                  <DetailInfoField icon={<Calendar className="h-4 w-4" />} label="최근 업데이트">
                    <span className="text-sm text-slate-700">{task.updatedAt}</span>
                  </DetailInfoField>
                  <DetailInfoField icon={<User className="h-4 w-4" />} label="분석 담당자">
                    <span className="text-sm text-slate-700">{task.author}</span>
                  </DetailInfoField>
                  <DetailInfoField icon={<User className="h-4 w-4" />} label="검토 담당자">
                    <span className="text-sm text-slate-700">{task.assignee}</span>
                  </DetailInfoField>
                  <DetailInfoField icon={<Hash className="h-4 w-4" />} label="관리코드">
                    <span className="font-mono text-sm text-slate-700">{task.code}</span>
                  </DetailInfoField>

                  <div className="border-b border-slate-100 py-2">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-slate-400">
                        <Shield className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-400 sm:text-sm">위협 내역</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/90">
                      <table className="w-full min-w-full border-collapse text-left text-xs sm:text-sm">
                        <thead className="text-[11px] font-medium text-zinc-800/80">
                          <tr>
                            <th className="px-2 py-1.5 sm:px-3">일시</th>
                            <th className="border-l border-slate-200/80 px-2 py-1.5 sm:px-3">이벤트 명</th>
                            <th className="border-l border-slate-200/80 px-2 py-1.5">출발지 IP</th>
                            <th className="border-l border-slate-200/80 px-2 py-1.5">목적지 IP</th>
                            <th className="border-l border-slate-200/80 px-2 py-1.5">설명</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white text-slate-700">
                          {task.relatedThreats.map((row, threatIndex) => (
                            <tr key={`${row.at}-${row.event}`} className="border-t border-sky-100/90">
                              <td className="whitespace-nowrap px-2 py-1.5 text-[11px] sm:px-3">{row.at}</td>
                              <td className="border-l border-slate-100 px-2 py-1.5 font-medium sm:px-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEventDetail(row.eventDetail);
                                    trackDemoThreatDetailView({
                                      issue_id: task.id,
                                      threat_id: `${task.id}-threat-${threatIndex}`,
                                      exploration_mode: explorationMode,
                                    });
                                  }}
                                  className="text-left text-blue-600 underline-offset-2 hover:underline [word-break:keep-all]"
                                >
                                  {row.event}
                                </button>
                              </td>
                              <td className="border-l border-slate-100 px-2 py-1.5 font-mono text-[11px]">{row.srcIp}</td>
                              <td className="border-l border-slate-100 px-2 py-1.5 font-mono text-[11px]">{row.dstIp}</td>
                              <td className="border-l border-slate-100 px-2 py-1.5 text-slate-600">{row.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {task.actionNotes && (
                    <DetailInfoField icon={<Shield className="h-4 w-4" />} label="조치 내역">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{task.actionNotes}</p>
                    </DetailInfoField>
                  )}
                </section>

                <section>
                  <div className="mb-3 border-b border-slate-100" />
                  <div className="space-y-2 text-sm leading-relaxed text-slate-800">
                    {task.content.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </section>

                <section data-tour="task-comments">
                  <div className="mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    <h3 className="text-sm font-semibold text-zinc-800">댓글</h3>
                  </div>
                  {task.comments.length === 0 ? (
                    <p className="text-sm text-slate-400">아직 댓글이 없습니다.</p>
                  ) : (
                    <ul className="space-y-3">
                      {task.comments.map((c) => (
                        <li
                          key={`${c.at}-${c.author}`}
                          className={cn(
                            "rounded-xl p-3 text-sm",
                            c.role === "staff" ? "bg-slate-50" : "bg-sky-50/70",
                          )}
                        >
                          <div className="mb-1 flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                              {c.author}
                              {c.role === "staff" ? " · 분석팀" : " · 고객"}
                            </span>
                            <span>{c.at}</span>
                          </div>
                          <p className="leading-relaxed text-slate-700">{c.body}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </div>

          <nav
            aria-label="목차"
            className="hidden w-12 shrink-0 flex-col items-center border-l border-slate-100 bg-slate-50/80 py-6 sm:flex"
          >
            {["제목", "위협", "본문", "댓글"].map((label) => (
              <span
                key={label}
                title={label}
                className="mb-3 flex h-8 w-1.5 rounded-full bg-slate-300"
              />
            ))}
          </nav>
        </div>
      </aside>

      {eventDetail ? (
        <SimulationEventDetailPanel
          detail={eventDetail}
          onClose={() => setEventDetail(null)}
          overlay="fixed"
        />
      ) : null}
    </>
  );
}
