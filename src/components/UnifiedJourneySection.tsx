import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  formatActLabel,
  journeyActs,
  journeyActAnchorId,
  type JourneyAct,
} from "@/data/journey-steps";
import { storyJourneyIntro } from "@/data/story-journey";
import { JourneyDashboardFrame } from "@/components/JourneyDashboardFrame";
import { JourneyProgressDock } from "@/components/JourneyProgress";
import { CustomerRoleCallout } from "@/components/CustomerRoleCallout";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { JourneyStepDetailDrawer } from "@/components/JourneyStepDetailDrawer";
import { cn } from "@/lib/cn";

function ActPanel({
  act,
  actIndex,
  active,
  isFirst,
  isLast,
  onOpenDetail,
  panelRef,
}: {
  act: JourneyAct;
  actIndex: number;
  active: boolean;
  isFirst: boolean;
  isLast: boolean;
  onOpenDetail: () => void;
  panelRef: (el: HTMLDivElement | null) => void;
}) {
  const isEven = actIndex % 2 === 1;

  return (
    <article
      id={journeyActAnchorId(act)}
      ref={panelRef}
      data-journey-act={act.id}
      className={cn(
        "journey-act-panel flex min-h-screen flex-col justify-center scroll-mt-20 border-b border-slate-200/80 py-16 sm:py-20 lg:border-b-0 lg:py-0",
        isFirst
          ? "journey-act-panel-first snap-start"
          : isLast
            ? "journey-act-panel-last snap-start"
            : "snap-start snap-always",
        isEven ? "bg-[#F8F9FA]" : "bg-white",
        active && "is-active",
      )}
    >
      <div className="zt-container-journey min-w-0 lg:pr-8 xl:pr-12">
        <p className="text-[clamp(3.5rem,8vw,6rem)] font-extralight leading-none tabular-nums text-blue-100">
          {String(act.act).padStart(2, "0")}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-bold text-white">
            {formatActLabel(act)}
          </span>
        </div>
        <h3
          className={cn(
            "mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem] [word-break:keep-all]",
            active ? "text-blue-800" : "text-zinc-800",
          )}
        >
          {act.title}
        </h3>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">{act.summary}</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {act.highlights.map((h) => (
            <li
              key={h}
              className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5 text-sm text-slate-700 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              {h}
            </li>
          ))}
        </ul>

        <CustomerRoleCallout note={act.customerNote} />

        <div className="mt-10">
          <button
            type="button"
            onClick={onOpenDetail}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 hover:shadow-md"
          >
            Detail
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function StickyPreview({
  activeAct,
  contentVisible,
  onScrollToAct,
}: {
  activeAct: number;
  contentVisible: boolean;
  onScrollToAct: (index: number) => void;
}) {
  const act = journeyActs[activeAct] ?? journeyActs[0];

  return (
    <div className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col justify-center gap-3 py-6">
      <JourneyDashboardFrame
        visual={act.visual}
        title={act.title}
        active={contentVisible}
        stepIndex={activeAct}
        stepCount={journeyActs.length}
        onStepSelect={onScrollToAct}
      />
      <p className="text-center text-xs leading-relaxed text-slate-400">
        {act.customerNote.replace(/^고객님이 하시는 일:?\s*/u, "")}
      </p>
    </div>
  );
}

export function UnifiedJourneySection() {
  const [activeAct, setActiveAct] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerActIndex, setDrawerActIndex] = useState(0);
  const [drawerStepInAct, setDrawerStepInAct] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(false);

  const stepsZoneRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActive = useRef(0);

  const intro = storyJourneyIntro.act;
  const currentAct = journeyActs[activeAct];

  const openDetail = useCallback((actIndex: number) => {
    setDrawerActIndex(actIndex);
    setDrawerStepInAct(0);
    setDrawerOpen(true);
  }, []);

  const closeStepDetail = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const scrollToAct = useCallback((i: number) => {
    panelRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (activeAct !== prevActive.current) {
      setContentVisible(false);
      const t = window.setTimeout(() => {
        setContentVisible(true);
        prevActive.current = activeAct;
      }, 120);
      return () => window.clearTimeout(t);
    }
    setContentVisible(true);
    return undefined;
  }, [activeAct]);

  useEffect(() => {
    const firstPanel = panelRefs.current[0];
    const lastPanel = panelRefs.current[journeyActs.length - 1];
    if (!firstPanel || !lastPanel) return;

    const outcomesSection = document.getElementById("outcomes");
    let raf = 0;

    const updateSnap = () => {
      const firstRect = firstPanel.getBoundingClientRect();
      const lastRect = lastPanel.getBoundingClientRect();
      const vh = window.innerHeight;

      const inJourneySteps =
        firstRect.top < vh * 0.92 && lastRect.bottom > vh * 0.08;

      // STEP 1 상단(인트로 → STEP 1 진입)에서는 스냅 해제
      const enteringFromIntro = firstRect.top > vh * 0.4;

      // STEP 3 하단이 올라오면(고객 가치 섹션으로 내려갈 때) 스냅 해제
      const leavingToOutcomes = lastRect.bottom < vh * 0.48;

      const outcomesEntering =
        outcomesSection != null &&
        outcomesSection.getBoundingClientRect().top < vh * 0.72;

      setSnapEnabled(
        inJourneySteps && !enteringFromIntro && !leavingToOutcomes && !outcomesEntering,
      );
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(updateSnap);
    };

    updateSnap();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const panelObservers: IntersectionObserver[] = [];
    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveAct(i);
        },
        { threshold: 0.55, rootMargin: "-20% 0px -20% 0px" },
      );
      io.observe(el);
      panelObservers.push(io);
    });

    return () => panelObservers.forEach((io) => io.disconnect());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("journey-snap-active", snapEnabled);
    return () => document.documentElement.classList.remove("journey-snap-active");
  }, [snapEnabled]);

  return (
    <section id="journey" className="relative border-b border-slate-100 bg-white pb-20 lg:pb-0">
      <div className="zt-container-journey border-b border-slate-100 py-12 sm:py-16 lg:py-20">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <p className="text-[16px] font-semibold text-blue-600">{storyJourneyIntro.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold text-[#212529] sm:text-4xl lg:text-5xl [word-break:keep-all]">
              {intro.title}
              <span className="text-blue-600"> {intro.titleAccent}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl">{intro.lead}</p>
          </div>
        </RevealOnScroll>
      </div>

      <div
        id="journey-steps"
        ref={stepsZoneRef}
        className="lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)] lg:gap-8 xl:gap-12"
      >
        <div className="min-w-0">
          {journeyActs.map((act, i) => (
            <ActPanel
              key={act.id}
              act={act}
              actIndex={i}
              isFirst={i === 0}
              isLast={i === journeyActs.length - 1}
              active={activeAct === i && !drawerOpen}
              onOpenDetail={() => openDetail(i)}
              panelRef={(el) => {
                panelRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        <div className="hidden min-w-0 lg:block">
          <StickyPreview
            activeAct={activeAct}
            contentVisible={contentVisible && !drawerOpen}
            onScrollToAct={scrollToAct}
          />
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-6 lg:hidden">
        <JourneyDashboardFrame
          visual={currentAct.visual}
          title={currentAct.title}
          active={contentVisible && !drawerOpen}
          stepIndex={activeAct}
          stepCount={journeyActs.length}
          onStepSelect={scrollToAct}
        />
      </div>

      <JourneyProgressDock
        activeAct={activeAct}
        drawerOpen={drawerOpen}
        onScrollToAct={scrollToAct}
      />

      <JourneyStepDetailDrawer
        open={drawerOpen}
        actIndex={drawerActIndex}
        stepInAct={drawerStepInAct}
        onClose={closeStepDetail}
        onStepInActChange={setDrawerStepInAct}
      />
    </section>
  );
}
