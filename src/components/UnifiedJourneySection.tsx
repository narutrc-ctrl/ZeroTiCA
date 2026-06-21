import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  journeyFlowPills,
  unifiedJourneySteps,
  type JourneyStep,
  type JourneyVisualId,
} from "@/data/journey-steps";
import {
  detectionTopics,
  ndrComparison,
  runaCollaborationPoints,
  whitelistApproach,
} from "@/data/methodology";
import { sensorCollectionSection } from "@/data/sensor-collection";
import { storyJourneyIntro } from "@/data/story-journey";
import { JourneyStepExamples } from "@/components/JourneyStepSnippet";
import { AnalyzePipelineStrip } from "@/components/AnalyzePipelineStrip";
import { ActorBadge } from "@/components/ActorBadge";
import { JourneyDashboardFrame } from "@/components/JourneyDashboardFrame";
import {
  CommunicationDirectionGrid,
  DetectionTopicCard,
  KeyTakeaway,
  RoleSplitBox,
  SensorFlowStrip,
  visualForTopic,
  WhitelistLayersGrid,
} from "@/components/JourneyRichBlocks";
import { JourneyVisual } from "@/components/JourneyVisual";
import { cn } from "@/lib/cn";

const TOPICS_BY_STEP: Record<string, string[]> = {
  "02": ["beacon", "longsession"],
  "03": ["ioc"],
  "04": ["coverage"],
};

function NdrComparisonBlock() {
  return (
    <div className="border-b border-slate-100 bg-[#F8F9FA] py-14 sm:py-16">
      <div className="zt-container-wide">
        <p className="text-sm font-bold text-blue-600">분석 · 차별점</p>
        <h3 className="mt-2 text-2xl font-bold text-[#212529] sm:text-3xl [word-break:keep-all]">
          {ndrComparison.title}
        </h3>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {ndrComparison.rows.map((row) => (
            <div
              key={row.typical}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.1)]"
            >
              <div className="grid sm:grid-cols-2">
                <div className="border-b border-slate-100 p-5 sm:border-b-0 sm:border-r">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">일반 NDR</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{row.typical}</p>
                </div>
                <div className="bg-blue-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">제로티카</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#212529]">{row.zerotica}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step02Content({
  topics,
  active,
  activeTopicId,
  onTopicRef,
}: {
  topics: typeof detectionTopics;
  active: boolean;
  activeTopicId: string | null;
  onTopicRef: (topicId: string, el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="mt-8 space-y-10">
      <CommunicationDirectionGrid />
      <AnalyzePipelineStrip />
      <JourneyStepExamples step="02" />
      <div className="space-y-6">
        <p className="text-base font-bold text-[#212529]">대표 탐지 유형 — 왜 중요한지, 어떻게 보는지</p>
        {topics.map((topic) => (
          <DetectionTopicCard
            key={topic.id}
            topic={topic}
            active={active && activeTopicId === topic.id}
            topicRef={(el) => onTopicRef(topic.id, el)}
          />
        ))}
      </div>
    </div>
  );
}

function JourneyStepOverview({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="mt-8 flex flex-wrap gap-2" aria-label="8단계 작업 순서">
      {journeyFlowPills.map((p, i) => (
        <li
          key={p.step}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
            activeIndex === i
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : i < activeIndex
                ? "bg-blue-50 text-blue-800"
                : "bg-[#F8F9FA] text-slate-500",
          )}
        >
          <span className="tabular-nums font-bold">{p.step}</span>
          <span>{p.label}</span>
        </li>
      ))}
    </ol>
  );
}

function StepHeader({ step, active }: { step: JourneyStep; active: boolean }) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-bold tracking-widest text-blue-700">
          STEP {step.step}
        </span>
        <ActorBadge actor={step.actor} label={step.actorLabel} />
      </div>
      <h3
        className={cn(
          "mt-5 text-2xl font-bold leading-tight sm:text-3xl lg:text-[2rem] [word-break:keep-all]",
          active ? "text-blue-700" : "text-[#212529]",
        )}
      >
        {step.title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{step.body}</p>
    </header>
  );
}

function Step01Content() {
  return (
    <div className="mt-8 space-y-5">
      <SensorFlowStrip />
      <div className="grid gap-3 sm:grid-cols-3">
        {sensorCollectionSection.points.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl bg-[#F8F9FA] p-4 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)]"
          >
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
      <div className="mt-8 space-y-4">
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
      <div className="mt-8">
        <RoleSplitBox
          analyst="질문 정리·추가 확인·위협 내역 테이블 업데이트"
          customer="업무 Sheet·댓글로 「정기 배포 통신입니다」 등 맥락 답변"
        />
      </div>
    );
  }
  if (step.step === "07") {
    return (
      <div className="mt-8 space-y-4">
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
      <div className="mt-8">
        <KeyTakeaway>
          사건 흐름·판단 근거·조치 결과가 한 문서로 남아, 감사·경영 보고·재발 방지에 바로 쓸 수 있습니다.
        </KeyTakeaway>
      </div>
    );
  }
  return null;
}

function StepPanel({
  step,
  active,
  activeTopicId,
  stepRef,
  onTopicRef,
}: {
  step: JourneyStep;
  active: boolean;
  activeTopicId: string | null;
  stepRef: (el: HTMLDivElement | null) => void;
  onTopicRef: (topicId: string, el: HTMLDivElement | null) => void;
}) {
  const topicIds = TOPICS_BY_STEP[step.step] ?? [];
  const topics = detectionTopics.filter((t) => topicIds.includes(t.id));

  return (
    <article
      ref={stepRef}
      data-journey-step={step.step}
      className={cn("journey-step-panel py-12 lg:py-16", active && "is-active")}
    >
      <div
        className={cn(
          "transition-all duration-500",
          active && "rounded-2xl bg-white/60 p-1 lg:-mx-2 lg:px-2",
        )}
      >
        <StepHeader step={step} active={active} />

        {step.step === "01" ? <Step01Content /> : null}

        {step.step === "02" && topics.length > 0 ? (
          <Step02Content
            topics={topics}
            active={active}
            activeTopicId={activeTopicId}
            onTopicRef={onTopicRef}
          />
        ) : null}

        {step.step === "04" ? (
          <div className="mt-8 space-y-6">
            <p className="text-base leading-relaxed text-slate-600">{whitelistApproach.lead}</p>
            <p className="text-lg font-bold text-[#212529]">{whitelistApproach.title}</p>
            <WhitelistLayersGrid />
            <JourneyStepExamples step="04" />
            {topics.length > 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <ArrowRight className="h-3 w-3" />
                정제 후 남는 이벤트 유형별 현황
              </div>
            ) : null}
          </div>
        ) : null}

        {topics.length > 0 && step.step !== "02" && step.step !== "04" ? (
          <div className={cn("space-y-6", step.step === "04" ? "mt-8" : "mt-10")}>
            {topics.map((topic) => (
              <DetectionTopicCard
                key={topic.id}
                topic={topic}
                active={active && activeTopicId === topic.id}
                topicRef={(el) => onTopicRef(topic.id, el)}
              />
            ))}
            {step.step === "03" ? <JourneyStepExamples step="03" /> : null}
          </div>
        ) : null}

        {step.detail && step.step !== "01" && !TOPICS_BY_STEP[step.step]?.length ? (
          <p className="mt-6 rounded-2xl bg-[#F8F9FA] px-5 py-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {step.detail}
          </p>
        ) : null}

        {step.detail && TOPICS_BY_STEP[step.step]?.length ? (
          <p className="mt-6 text-sm leading-relaxed text-slate-500 sm:text-base">{step.detail}</p>
        ) : null}

        {(step.phase === "collaborate" || step.phase === "close") && <CollaborateExtras step={step} />}

        {step.step !== "02" && step.step !== "03" && step.step !== "04" ? (
          <JourneyStepExamples step={step.step} />
        ) : null}

        <div className="mt-10 border-t border-dashed border-slate-200 pt-8 lg:hidden">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">RUNA 화면</p>
          <JourneyVisual id={step.visual} large={false} />
        </div>
      </div>
    </article>
  );
}

export function UnifiedJourneySection() {
  const [active, setActive] = useState(0);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(true);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topicRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevActive = useRef(0);

  const activeStep = unifiedJourneySteps[active];

  const previewVisual: JourneyVisualId = useMemo(() => {
    if (activeTopicId) {
      const v = visualForTopic(activeTopicId);
      if (v) return v;
    }
    return activeStep?.visual ?? "sensor";
  }, [activeTopicId, activeStep]);

  useEffect(() => {
    const topicIds = TOPICS_BY_STEP[activeStep?.step ?? ""];
    if (topicIds?.length) {
      setActiveTopicId((prev) => (prev && topicIds.includes(prev) ? prev : topicIds[0]));
    } else {
      setActiveTopicId(null);
    }
  }, [active, activeStep?.step]);

  useEffect(() => {
    if (active !== prevActive.current) {
      setContentVisible(false);
      const t = window.setTimeout(() => {
        setContentVisible(true);
        prevActive.current = active;
      }, 120);
      return () => window.clearTimeout(t);
    }
    setContentVisible(true);
    return undefined;
  }, [active]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.35, rootMargin: "-12% 0px -38% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });

    const topicObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.topicId) {
          setActiveTopicId(visible.target.dataset.topicId);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-15% 0px -30% 0px" },
    );

    topicRefs.current.forEach((el) => topicObserver.observe(el));
    observers.push(topicObserver);

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return (
    <section id="journey" className="relative border-b border-slate-100 bg-white">
      <NdrComparisonBlock />

      <div className="zt-container-wide pb-24 pt-10 sm:pb-32 sm:pt-14">
        <div className="mb-10 max-w-4xl">
          <p className="text-sm font-semibold text-blue-600">{storyJourneyIntro.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-[#212529] sm:text-3xl [word-break:keep-all]">
            {storyJourneyIntro.title}
            <span className="text-blue-600"> {storyJourneyIntro.titleAccent}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{storyJourneyIntro.lead}</p>
          <JourneyStepOverview activeIndex={active} />
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-10 xl:gap-14">
          {/* 좌 — 넓은 설명 스크롤 */}
          <div className="min-w-0">
            {unifiedJourneySteps.map((step, i) => (
              <StepPanel
                key={step.step}
                step={step}
                active={active === i}
                activeTopicId={activeTopicId}
                stepRef={(el) => {
                  stepRefs.current[i] = el;
                }}
                onTopicRef={(topicId, el) => {
                  if (el) topicRefs.current.set(topicId, el);
                  else topicRefs.current.delete(topicId);
                }}
              />
            ))}
          </div>

          {/* 우 — RUNA 대시보드 (보조) */}
          <div className="hidden lg:block">
            <div className="sticky top-20 flex min-h-[calc(100vh-5rem)] items-start py-8">
              <div className="w-full">
                <JourneyDashboardFrame
                  visual={previewVisual}
                  stepLabel={activeStep?.step ?? "01"}
                  title={activeStep?.title ?? ""}
                  active={contentVisible}
                />
                <p className="mt-4 text-center text-xs text-slate-400">{activeStep?.actorLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
