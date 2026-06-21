import type { TaskCaseStudy } from "@/data/customer-value-examples";
import { cn } from "@/lib/cn";

const categoryTone: Record<TaskCaseStudy["category"], string> = {
  unknown: "bg-slate-100 text-slate-700",
  cleanup: "bg-amber-50 text-amber-800",
  forbidden: "bg-red-50 text-red-800",
};

const categoryLabel: Record<TaskCaseStudy["category"], string> = {
  unknown: "알지 못했던 통신",
  cleanup: "정리 필요",
  forbidden: "있으면 안 됨",
};

export function TaskCaseStudyCard({
  study,
  compact,
}: {
  study: TaskCaseStudy;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl bg-white p-5 shadow-[0_4px_24px_-6px_rgba(15,23,42,0.1)] sm:p-6",
        compact && "p-4 sm:p-5",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", categoryTone[study.category])}>
          {categoryLabel[study.category]}
        </span>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
          {study.direction}
        </span>
        <span className="text-[11px] text-slate-400">{study.eventType}</span>
      </div>

      <h4 className="mt-3 text-base font-bold leading-snug text-[#212529] sm:text-lg [word-break:keep-all]">
        {study.taskTitle}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{study.summary}</p>

      {compact && (study.staffAsk || study.customerReply) ? (
        <div className="mt-3 space-y-2 rounded-lg bg-[#F8F9FA] px-3 py-2.5 text-xs leading-relaxed text-slate-600">
          <p>
            <span className="font-bold text-blue-700">확인 요청</span> {study.staffAsk}
          </p>
          {study.customerReply ? (
            <p>
              <span className="font-bold text-emerald-700">고객 답변</span> {study.customerReply}
            </p>
          ) : null}
        </div>
      ) : null}

      {!compact ? (
        <>
          <ul className="mt-4 space-y-1.5">
            {study.findings.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-slate-600">
                <span className="text-blue-400">·</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3 rounded-xl bg-[#F8F9FA] p-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">분석팀 확인 요청</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{study.staffAsk}</p>
            </div>
            {study.customerReply ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">고객 답변</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{study.customerReply}</p>
              </div>
            ) : null}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">조치·결과</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{study.resolution}</p>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-4 border-l-4 border-blue-600 bg-blue-50/60 px-4 py-3">
        <p className="text-[11px] font-bold text-blue-600">고객이 얻는 것</p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-[#212529]">{study.customerGain}</p>
      </div>
    </article>
  );
}
