import { whitelistApproach } from "@/data/methodology";
import { sensorCollectionSection } from "@/data/sensor-collection";
import type { DetectionTopic } from "@/data/methodology";
import type { JourneyVisualId } from "@/data/journey-steps";
import { communicationDirections, directionAnalysisNote } from "@/data/methodology";
import { cn } from "@/lib/cn";

export function CommunicationDirectionGrid() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-lg font-bold text-[#212529]">{directionAnalysisNote.title}</p>
        <p className="mt-2 text-base leading-relaxed text-slate-600">{directionAnalysisNote.body}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {communicationDirections.map((dir) => (
          <div
            key={dir.id}
            className="rounded-2xl bg-[#F8F9FA] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {dir.label}
              </span>
              <span className="text-xs font-medium text-slate-500">{dir.flow}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{dir.summary}</p>
            <ul className="mt-4 space-y-1.5">
              {dir.examples.map((ex) => (
                <li key={ex} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-blue-400">·</span>
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="journey-key-takeaway rounded-2xl border-l-4 border-blue-600 bg-blue-50/80 px-5 py-4 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.1)]">
      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">핵심 · 고객이 얻는 것</p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#212529] sm:text-base">{children}</p>
    </div>
  );
}

export function InsightPair({ problem, approach }: { problem: string; approach: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl bg-[#F8F9FA] p-4 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-bold text-amber-700">왜 중요한가</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{problem}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-bold text-blue-600">제로티카가 보는 방식</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{approach}</p>
      </div>
    </div>
  );
}

export function DetectionTopicCard({
  topic,
  active,
  topicRef,
}: {
  topic: DetectionTopic;
  active?: boolean;
  topicRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={topicRef}
      data-topic-id={topic.id}
      className={cn(
        "detection-topic-card rounded-2xl p-5 transition-all duration-500 sm:p-6",
        active
          ? "bg-white shadow-[0_12px_40px_-8px_rgba(37,99,235,0.18)] ring-1 ring-blue-200/80"
          : "bg-[#F8F9FA] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]",
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">{topic.tag}</p>
      <h4 className="mt-2 text-xl font-bold text-[#212529] [word-break:keep-all]">{topic.name}</h4>
      <div className="mt-5 space-y-5">
        <InsightPair problem={topic.problem} approach={topic.approach} />
        <KeyTakeaway>{topic.outcome}</KeyTakeaway>
        <p className="text-sm leading-relaxed text-slate-400">서비스 화면: {topic.screenNote}</p>
      </div>
    </div>
  );
}

export function WhitelistLayersGrid() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {whitelistApproach.layers.map((layer) => (
          <div
            key={layer.name}
            className="rounded-2xl bg-[#F8F9FA] p-4 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)]"
          >
            <p className="font-semibold text-[#212529]">{layer.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{layer.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-blue-700">{whitelistApproach.closing}</p>
    </div>
  );
}

export function RoleSplitBox({ analyst, customer }: { analyst: string; customer: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl bg-blue-50/80 p-4 shadow-[0_4px_16px_-4px_rgba(37,99,235,0.08)]">
        <p className="text-xs font-bold text-blue-700">분석팀</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{analyst}</p>
      </div>
      <div className="rounded-2xl bg-emerald-50/80 p-4 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.08)]">
        <p className="text-xs font-bold text-emerald-700">고객</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{customer}</p>
      </div>
    </div>
  );
}

export function SensorFlowStrip() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sensorCollectionSection.flowSteps.map((s, i, arr) => (
        <span key={s.label} className="flex items-center gap-2">
          <span className="rounded-xl bg-[#F8F9FA] px-3 py-2 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.08)]">
            <span className="block text-sm font-semibold text-[#212529]">{s.label}</span>
            <span className="text-xs text-slate-500">{s.sub}</span>
          </span>
          {i < arr.length - 1 ? <span className="text-blue-400">→</span> : null}
        </span>
      ))}
    </div>
  );
}

export function visualForTopic(id: string): JourneyVisualId | undefined {
  const map: Record<string, JourneyVisualId> = {
    beacon: "event-detail-agent",
    longsession: "long-session",
    ioc: "ioc-batch",
    coverage: "event-dashboard",
  };
  return map[id];
}
