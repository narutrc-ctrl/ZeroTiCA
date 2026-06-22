import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import {
  formatActLabel,
  journeyActs,
  journeyActAnchorId,
  journeyStepAnchorId,
  unifiedJourneySteps,
  type JourneyAct,
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
import { JourneyProgressDock, JourneyProgressRail } from "@/components/JourneyProgress";
import { CustomerRoleCallout } from "@/components/CustomerRoleCallout";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  CommunicationDirectionGrid,
  DetectionTopicCard,
  KeyTakeaway,
  RoleSplitBox,
  SensorFlowStrip,
  visualForTopic,
  WhitelistLayersGrid,
} from "@/components/JourneyRichBlocks";
import { cn } from "@/lib/cn";

const TOPICS_BY_STEP: Record<string, string[]> = {
  "02": ["beacon", "longsession"],
  "03": ["ioc"],
  "04": ["coverage"],
};

function NdrComparisonBlock() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 bg-[#F8F9FA]">
      <div className="zt-container-wide py-8 sm:py-10">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div>
            <p className="text-sm font-bold text-blue-600">분석 · 차별점</p>
            <h3 className="mt-1 text-xl font-bold text-[#212529] sm:text-2xl [word-break:keep-all]">
              {ndrComparison.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">일반 NDR과 제로티카 운영 방식 비교 — 심화 설명</p>
          </div>
          {open ? <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" /> : <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />}
        </button>
        {open && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {ndrComparison.rows.map((row, i) => (
              <RevealOnScroll key={row.typical} delay={i * 60} variant="fade-up">
                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.1)]">
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
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActPanel({
  act,
  active,
  actRef,
}: {
  act: JourneyAct;
  active: boolean;
  actRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <article
      id={journeyActAnchorId(act)}
      ref={actRef}
      data-journey-act={act.id}
      className={cn("journey-act-panel scroll-mt-24 py-12 lg:py-16", active && "is-active")}
    >
      <div
        className={cn(
          "rounded-2xl transition-all duration-500",
          active ? "bg-blue-50/40 p-6 ring-1 ring-blue-100" : "bg-transparent",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-sm font-bold text-white">
            {formatActLabel(act)}
          </span>
        </div>
        <h3 className={cn("mt-4 text-2xl font-bold sm:text-3xl [word-break:keep-all]", active ? "text-blue-800" : "text-slate-900")}>
          {act.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{act.summary}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {act.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-sm text-slate-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              {h}
            </li>
          ))}
        </ul>
        <CustomerRoleCallout note={act.customerNote} />
      </div>
    </article>
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

function StepHeader({ step, active }: { step: JourneyStep; active: boolean }) {
  const actForStep = journeyActs.find((a) => a.stepRange.includes(step.step));
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-bold tracking-widest text-blue-700">
          STEP {step.step}
        </span>
        {actForStep && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {formatActLabel(actForStep)}
          </span>
        )}
        <ActorBadge actor={step.actor} label={step.actorLabel} />
      </div>
      <h3
        className={cn(
          "mt-5 text-2xl font-bold leading-tight sm:text-3xl [word-break:keep-all]",
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
      id={journeyStepAnchorId(step.step)}
      ref={stepRef}
      data-journey-step={step.step}
      className={cn("journey-step-panel scroll-mt-24 py-12 lg:py-16", active && "is-active")}
    >
      <div className={cn("transition-all duration-500", active && "rounded-2xl bg-white/60 p-1 lg:-mx-2 lg:px-2")}>
        <StepHeader step={step} active={active} />
        {step.step === "01" ? <Step01Content /> : null}
        {step.step === "02" && topics.length > 0 ? (
          <Step02Content topics={topics} active={active} activeTopicId={activeTopicId} onTopicRef={onTopicRef} />
        ) : null}
        {step.step === "04" ? (
          <div className="mt-8 space-y-6">
            <p className="text-base leading-relaxed text-slate-600">{whitelistApproach.lead}</p>
            <p className="text-lg font-bold text-[#212529]">{whitelistApproach.title}</p>
            <WhitelistLayersGrid />
            <JourneyStepExamples step="04" />
          </div>
        ) : null}
        {topics.length > 0 && step.step !== "02" && step.step !== "04" ? (
          <div className="mt-10 space-y-6">
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
      </div>
    </article>
  );
}

export function UnifiedJourneySection() {
  const [deepMode, setDeepMode] = useState(false);
  const [activeAct, setActiveAct] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(true);
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topicRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevActive = useRef(0);

  const intro = deepMode ? storyJourneyIntro.deep : storyJourneyIntro.act;
  const currentAct = journeyActs[activeAct];
  const currentStep = unifiedJourneySteps[activeStep];

  const previewVisual: JourneyVisualId = useMemo(() => {
    if (deepMode) {
      if (activeTopicId) {
        const v = visualForTopic(activeTopicId);
        if (v) return v;
      }
      return currentStep?.visual ?? "sensor";
    }
    return currentAct?.visual ?? "sensor";
  }, [deepMode, activeTopicId, currentStep, currentAct]);

  const previewLabel = deepMode ? currentStep?.step ?? "01" : formatActLabel(currentAct ?? journeyActs[0]);
  const previewTitle = deepMode ? currentStep?.title ?? "" : currentAct?.title ?? "";
  const previewActor = deepMode ? currentStep?.actorLabel : currentAct?.customerNote.replace(/^고객님이 하시는 일:?\s*/u, "");

  const scrollToAct = useCallback((i: number) => {
    actRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToStep = useCallback((i: number) => {
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    if (!deepMode) return;
    const topicIds = TOPICS_BY_STEP[currentStep?.step ?? ""];
    if (topicIds?.length) {
      setActiveTopicId((prev) => (prev && topicIds.includes(prev) ? prev : topicIds[0]));
    } else {
      setActiveTopicId(null);
    }
  }, [deepMode, activeStep, currentStep?.step]);

  useEffect(() => {
    const idx = deepMode ? activeStep : activeAct;
    if (idx !== prevActive.current) {
      setContentVisible(false);
      const t = window.setTimeout(() => {
        setContentVisible(true);
        prevActive.current = idx;
      }, 150);
      return () => window.clearTimeout(t);
    }
    setContentVisible(true);
    return undefined;
  }, [deepMode, activeStep, activeAct]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const refs = deepMode ? stepRefs : actRefs;
    const setter = deepMode ? setActiveStep : setActiveAct;

    refs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setter(i);
        },
        { threshold: 0.4, rootMargin: "-22% 0px -30% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });

    if (deepMode) {
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
    }

    return () => observers.forEach((io) => io.disconnect());
  }, [deepMode]);

  const toggleDeep = () => {
    setDeepMode((v) => !v);
    if (!deepMode) {
      setActiveStep(0);
      prevActive.current = 0;
    } else {
      setActiveAct(0);
      prevActive.current = 0;
    }
  };

  return (
    <section id="journey" className="relative border-b border-slate-100 bg-white">
      <NdrComparisonBlock />

      <div className="zt-container-wide pb-28 pt-10 sm:pb-28 sm:pt-14 lg:pb-20">
        <RevealOnScroll>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold text-blue-600">{storyJourneyIntro.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold text-[#212529] sm:text-3xl lg:text-4xl [word-break:keep-all]">
              {intro.title}
              <span className="text-blue-600"> {intro.titleAccent}</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{intro.lead}</p>
            {!deepMode && (
              <p className="mt-3 text-sm text-slate-500">
                Zeek·IOC·화이트리스트 등 기술 상세가 필요하면{" "}
                <span className="hidden lg:inline">우측 패널</span>
                <span className="lg:hidden">하단 진행 표시줄</span>
                에서{" "}
                <button type="button" onClick={toggleDeep} className="font-semibold text-blue-600 hover:underline">
                  8단계 전체 보기
                </button>
                를 선택하세요.
              </p>
            )}
          </div>
        </RevealOnScroll>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-10 xl:gap-14">
          <div className="min-w-0">
            {!deepMode
              ? journeyActs.map((act, i) => (
                  <ActPanel
                    key={act.id}
                    act={act}
                    active={activeAct === i}
                    actRef={(el) => {
                      actRefs.current[i] = el;
                    }}
                  />
                ))
              : unifiedJourneySteps.map((step, i) => (
                  <StepPanel
                    key={step.step}
                    step={step}
                    active={activeStep === i}
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

          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4 py-4">
              <JourneyProgressRail
                deepMode={deepMode}
                activeAct={activeAct}
                activeStep={activeStep}
                onToggleDeep={toggleDeep}
                onScrollToAct={scrollToAct}
                onScrollToStep={scrollToStep}
              />
              <JourneyDashboardFrame
                visual={previewVisual}
                stepLabel={previewLabel}
                title={previewTitle}
                active={contentVisible}
              />
              <p className="text-center text-xs text-slate-400">{previewActor}</p>
            </div>
          </div>
        </div>
      </div>

      <JourneyProgressDock
        deepMode={deepMode}
        activeAct={activeAct}
        activeStep={activeStep}
        onToggleDeep={toggleDeep}
        onScrollToAct={scrollToAct}
        onScrollToStep={scrollToStep}
      />
    </section>
  );
}
