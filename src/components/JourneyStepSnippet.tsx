import {
  caseById,
  collectionLogSnapshots,
  stepExample,
  type JourneyStepFocus,
  type TaskCaseStudy,
} from "@/data/customer-value-examples";
import { cn } from "@/lib/cn";

const focusLabel: Record<JourneyStepFocus, string> = {
  collect: "수집",
  detect: "탐지 근거",
  ioc: "IOC 매칭",
  whitelist: "화이트리스트",
  notify: "확인 요청",
  reply: "고객 답변",
  verify: "조치·권고",
  report: "보고서",
};

function SnippetShell({
  study,
  children,
  tone = "default",
}: {
  study?: TaskCaseStudy;
  children: React.ReactNode;
  tone?: "default" | "notify" | "reply" | "verify";
}) {
  const toneClass =
    tone === "notify"
      ? "border-blue-200 bg-blue-50/40"
      : tone === "reply"
        ? "border-emerald-200 bg-emerald-50/40"
        : tone === "verify"
          ? "border-amber-200 bg-amber-50/40"
          : "border-slate-200 bg-white";

  return (
    <div className={cn("rounded-xl border p-4", toneClass)}>
      {study ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {study.direction}
          </span>
          <span className="text-[11px] text-slate-400">{study.eventType}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function CollectSnapshots() {
  return (
    <div className="space-y-3">
      {collectionLogSnapshots.map((snap) => (
        <div key={snap.logType} className="rounded-xl border border-slate-200 bg-[#F8F9FA] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">{snap.logType} 로그</p>
          <p className="mt-1 text-xs text-slate-500">{snap.caption}</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-slate-300">
            {snap.fields.join("\n")}
          </pre>
        </div>
      ))}
    </div>
  );
}

function DetectSnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <SnippetShell study={study}>
      <p className="text-sm font-semibold text-[#212529]">{study.taskTitle.split(" 문의")[0]}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{study.summary}</p>
      <ul className="mt-3 space-y-1">
        {study.findings.map((f) => (
          <li key={f} className="flex gap-2 text-xs text-slate-700">
            <span className="text-blue-500">→</span>
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-slate-400">
        이 단계에서는 후보 등록까지만 — RUNA 이슈·고객 확인은 이후 단계
      </p>
    </SnippetShell>
  );
}

function IocSnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <SnippetShell study={study}>
      <p className="text-sm font-semibold text-[#212529]">IocIP ↔ conn 일일 매칭</p>
      <ul className="mt-2 space-y-1">
        {study.findings.map((f) => (
          <li key={f} className="flex gap-2 text-xs text-slate-700">
            <span className="text-violet-500">·</span>
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-slate-600">{study.summary}</p>
    </SnippetShell>
  );
}

function WhitelistSnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <SnippetShell study={study}>
      <p className="text-sm font-semibold text-[#212529]">{study.taskTitle.split(" 문의")[0]}</p>
      {study.customerReply ? (
        <p className="mt-2 text-xs text-emerald-800">
          <span className="font-bold">확인 결과</span> {study.customerReply}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-slate-700">
        <span className="font-bold text-blue-700">등록·제외</span> {study.resolution}
      </p>
    </SnippetShell>
  );
}

function NotifySnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <SnippetShell study={study} tone="notify">
      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">RUNA 이슈 · 확인 요청</p>
      <p className="mt-2 text-sm font-bold text-[#212529]">{study.taskTitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{study.staffAsk}</p>
    </SnippetShell>
  );
}

function ReplySnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <SnippetShell study={study} tone="reply">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">분석팀 질문</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{study.staffAsk}</p>
      {study.customerReply ? (
        <>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">고객 답변</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-[#212529]">{study.customerReply}</p>
        </>
      ) : null}
    </SnippetShell>
  );
}

function VerifySnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <SnippetShell study={study} tone="verify">
      <p className="text-sm font-semibold text-[#212529]">{study.taskTitle.split(" 문의")[0]}</p>
      {study.customerReply ? (
        <p className="mt-2 text-xs text-slate-600">
          <span className="font-bold">고객 확인</span> {study.customerReply}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-[#212529]">
        <span className="font-bold text-amber-800">판단·조치</span> {study.resolution}
      </p>
    </SnippetShell>
  );
}

function ReportSnippet({ study }: { study: TaskCaseStudy }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">침해 평가 보고서 · 사건 요약</p>
      <h4 className="mt-2 text-lg font-bold text-[#212529]">{study.taskTitle}</h4>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-[#F8F9FA] p-3">
          <p className="text-[11px] font-bold text-blue-600">1. 탐지</p>
          <ul className="mt-2 space-y-1">
            {study.findings.slice(0, 2).map((f) => (
              <li key={f} className="text-xs text-slate-600">
                · {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-[#F8F9FA] p-3">
          <p className="text-[11px] font-bold text-emerald-600">2. 고객 답변</p>
          <p className="mt-2 text-xs text-slate-600">{study.customerReply ?? "—"}</p>
        </div>
        <div className="rounded-lg bg-[#F8F9FA] p-3 sm:col-span-2">
          <p className="text-[11px] font-bold text-amber-700">3. 조치·결과</p>
          <p className="mt-2 text-xs text-slate-600">{study.resolution}</p>
        </div>
      </div>
      <div className="mt-4 border-l-4 border-blue-600 bg-blue-50/60 px-4 py-3">
        <p className="text-[11px] font-bold text-blue-600">기록으로 남는 가치</p>
        <p className="mt-1 text-sm text-[#212529]">{study.customerGain}</p>
      </div>
    </article>
  );
}

function renderSnippet(focus: JourneyStepFocus, study: TaskCaseStudy) {
  switch (focus) {
    case "detect":
      return <DetectSnippet key={study.id} study={study} />;
    case "ioc":
      return <IocSnippet key={study.id} study={study} />;
    case "whitelist":
      return <WhitelistSnippet key={study.id} study={study} />;
    case "notify":
      return <NotifySnippet key={study.id} study={study} />;
    case "reply":
      return <ReplySnippet key={study.id} study={study} />;
    case "verify":
      return <VerifySnippet key={study.id} study={study} />;
    case "report":
      return <ReportSnippet key={study.id} study={study} />;
    default:
      return null;
  }
}

export function JourneyStepExamples({ step }: { step: string }) {
  const config = stepExample(step);
  if (!config) return null;

  const studies = config.caseIds.map((id) => caseById(id)).filter(Boolean) as TaskCaseStudy[];

  if (config.focus === "collect") {
    return (
      <div className="mt-8 space-y-4">
        <StepExampleHeader focus={config.focus} headline={config.headline} />
        <CollectSnapshots />
        <p className="text-xs leading-relaxed text-slate-500">
          conn·DNS·HTTP 등 원시 로그가 RUNA로 전달된 뒤, STEP 02부터 방향별 탐지 규칙이 실행됩니다.
        </p>
      </div>
    );
  }

  if (studies.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <StepExampleHeader focus={config.focus} headline={config.headline} />
      <div
        className={cn(
          "grid gap-3",
          config.focus === "report" ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
        )}
      >
        {studies.map((study) => renderSnippet(config.focus, study))}
      </div>
    </div>
  );
}

function StepExampleHeader({ focus, headline }: { focus: JourneyStepFocus; headline: string }) {
  return (
    <div>
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
        {focusLabel[focus]} 예시
      </span>
      <p className="mt-2 text-sm font-bold text-[#212529] sm:text-base">{headline}</p>
    </div>
  );
}
