import { CheckCircle2 } from "lucide-react";
import {
  detectionTopics,
  runaCollaborationPoints,
  whitelistApproach,
} from "@/data/methodology";
import { sensorCollectionSection } from "@/data/sensor-collection";
import { formatActLabel, journeyActs, type JourneyStep } from "@/data/journey-steps";
import { JourneyStepExamples } from "@/components/JourneyStepSnippet";
import { AnalyzePipelineStrip } from "@/components/AnalyzePipelineStrip";
import { ActorBadge } from "@/components/ActorBadge";
import {
  CommunicationDirectionGrid,
  DetectionTopicCard,
  KeyTakeaway,
  RoleSplitBox,
  SensorFlowStrip,
  WhitelistLayersGrid,
} from "@/components/JourneyRichBlocks";

const TOPICS_BY_STEP: Record<string, string[]> = {
  "02": ["beacon", "longsession"],
  "03": ["ioc"],
  "04": ["coverage"],
};

const STEPS_WITHOUT_EXAMPLES = new Set(["02", "03", "04"]);

function Step02Content({ topics }: { topics: typeof detectionTopics }) {
  return (
    <div className="space-y-10">
      <CommunicationDirectionGrid />
      <AnalyzePipelineStrip />
      <div className="space-y-6">
        <p className="text-base font-bold text-[#212529]">대표 탐지 유형 — 왜 중요한지, 어떻게 보는지</p>
        {topics.map((topic) => (
          <DetectionTopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

function Step01Content() {
  return (
    <div className="space-y-5">
      <SensorFlowStrip />
      <div className="grid gap-3 sm:grid-cols-3">
        {sensorCollectionSection.points.map((p) => (
          <div key={p.title} className="rounded-2xl bg-[#F8F9FA] p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#212529]">{p.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
          </div>
        ))}
      </div>
      <KeyTakeaway>
        인라인 장비 없이 미러링만으로 전 구간 트래픽을 로그화합니다. 수집이 끊기면 분석도 멈추므로 대시보드에서
        먼저 확인합니다.
      </KeyTakeaway>
    </div>
  );
}

function CollaborateExtras({ step }: { step: JourneyStep }) {
  if (step.step === "05") {
    return (
      <div className="space-y-4">
        <ul className="space-y-2">
          {runaCollaborationPoints.slice(0, 2).map((p) => (
            <li key={p} className="flex gap-2 text-sm text-slate-700 sm:text-base">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              {p}
            </li>
          ))}
        </ul>
        <RoleSplitBox
          analyst="위협 내역·근거 데이터를 업무로 등록하고 확인 요청"
          customer="RUNA 알림·업무관리 칸반에서 새 요청 확인"
        />
      </div>
    );
  }
  if (step.step === "06") {
    return (
      <RoleSplitBox
        analyst="질문 정리·추가 확인·위협 내역 테이블 업데이트"
        customer="업무 Sheet·댓글로 「정기 배포 통신입니다」 등 맥락 답변"
      />
    );
  }
  if (step.step === "07") {
    return (
      <div className="space-y-4">
        <RoleSplitBox
          analyst="정상·주의·위협 판단, 화이트리스트·차단·모니터링 권고, 재탐지 추적"
          customer="조치 권고 확인·실행(서비스 중지, 프로세스 삭제 등)"
        />
        <ul className="space-y-2">
          {runaCollaborationPoints.slice(2).map((p) => (
            <li key={p} className="flex gap-2 text-sm text-slate-700 sm:text-base">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (step.step === "08") {
    return (
      <KeyTakeaway>
        사건 흐름·판단 근거·조치 결과가 한 문서로 남아, 감사·경영 보고·재발 방지에 바로 쓸 수 있습니다.
      </KeyTakeaway>
    );
  }
  return null;
}

export function JourneyStepContent({ step }: { step: JourneyStep }) {
  const actForStep = journeyActs.find((a) => a.stepRange.includes(step.step));
  const topicIds = TOPICS_BY_STEP[step.step] ?? [];
  const topics = detectionTopics.filter((t) => topicIds.includes(t.id));

  return (
    <div className="journey-step-detail space-y-8">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          {actForStep ? (
            <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-bold tracking-widest text-blue-700">
              {formatActLabel(actForStep)}
            </span>
          ) : null}
          <ActorBadge actor={step.actor} label={step.actorLabel} />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-[#212529] sm:text-3xl [word-break:keep-all]">{step.title}</h3>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{step.body}</p>
      </header>

      {step.step === "01" ? <Step01Content /> : null}
      {step.step === "02" && topics.length > 0 ? <Step02Content topics={topics} /> : null}
      {step.step === "04" ? (
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-slate-600">{whitelistApproach.lead}</p>
          <p className="text-lg font-bold text-[#212529]">{whitelistApproach.title}</p>
          <WhitelistLayersGrid />
        </div>
      ) : null}
      {topics.length > 0 && step.step !== "02" && step.step !== "04" ? (
        <div className="space-y-6">
          {topics.map((topic) => (
            <DetectionTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : null}
      {step.detail && step.step !== "01" && !TOPICS_BY_STEP[step.step]?.length ? (
        <p className="rounded-2xl bg-[#F8F9FA] px-5 py-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {step.detail}
        </p>
      ) : null}
      {step.detail && TOPICS_BY_STEP[step.step]?.length ? (
        <p className="text-sm leading-relaxed text-slate-500 sm:text-base">{step.detail}</p>
      ) : null}
      {(step.phase === "collaborate" || step.phase === "close") && <CollaborateExtras step={step} />}
      {!STEPS_WITHOUT_EXAMPLES.has(step.step) ? <JourneyStepExamples step={step.step} /> : null}
    </div>
  );
}
