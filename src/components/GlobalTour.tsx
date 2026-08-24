import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { TourCompleteModal } from "@/components/DemoTourPrompt";
import { fullDemoTour, resolveTour } from "@/data/demo-tour";
import {
  endFullGuideRun,
  guideGroupFromStepId,
  trackDemoGuideComplete,
  trackDemoGuideNavigation,
  trackDemoGuideStepView,
} from "@/lib/analytics";

function buildSearch(tour: string, step: number, extra?: string) {
  const base = new URLSearchParams(extra ?? "");
  base.set("tour", tour);
  base.set("step", String(step));
  return base.toString();
}

export function GlobalTour() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [showComplete, setShowComplete] = useState(false);

  const tour = params.get("tour");
  const tab = params.get("tab");
  const stepParam = params.get("step");
  const steps = resolveTour(location.pathname, tour, tab);
  const index = Math.min(Math.max(0, Number(stepParam ?? 0)), (steps?.length ?? 1) - 1);

  // 새 가이드 시작 시 이전 완료 모달 상태 초기화
  useEffect(() => {
    if (tour === "full" && stepParam === "0") {
      setShowComplete(false);
    }
  }, [tour, stepParam]);

  // full guide step 최초 도달만 측정 (뒤로가기 재진입 제외)
  useEffect(() => {
    if (tour !== "full" || !steps?.length) return;
    const step = steps[index];
    if (!step) return;
    trackDemoGuideStepView({
      guide_step: index + 1,
      guide_step_id: step.id,
      guide_group: guideGroupFromStepId(step.id),
      guide_total: fullDemoTour.length,
    });
  }, [tour, index, steps]);

  const goToStep = (nextIndex: number) => {
    if (!steps?.length || !tour) return;
    const step = steps[nextIndex];
    navigate(
      { pathname: step.route, search: buildSearch(tour, nextIndex, step.search) },
      { replace: true },
    );
  };

  const handleIndexChange = (nextIndex: number) => {
    if (!steps?.length) return;
    if (tour === "full" && nextIndex !== index) {
      const from = steps[index];
      const to = steps[nextIndex];
      if (from && to) {
        trackDemoGuideNavigation({
          action: nextIndex > index ? "next" : "previous",
          from_step: index + 1,
          to_step: nextIndex + 1,
          from_step_id: from.id,
          to_step_id: to.id,
        });
      }
    }
    goToStep(nextIndex);
  };

  const closeTour = () => {
    if (tour === "full") endFullGuideRun();
    const keep = new URLSearchParams();
    if (tab) keep.set("tab", tab);
    const qs = keep.toString();
    navigate({ pathname: location.pathname, search: qs || undefined }, { replace: true });
  };

  const handleComplete = () => {
    const wasFull = tour === "full";
    if (wasFull) {
      trackDemoGuideComplete(fullDemoTour.length);
      endFullGuideRun();
      // 완료 모달 뒤 배경을 이슈 관리로 맞춤 — 모달 닫은 뒤에도 동일 화면에서 시작
      navigate({ pathname: "/demo/task" }, { replace: true });
      setShowComplete(true);
      return;
    }
    closeTour();
  };

  return (
    <>
      {steps?.length && tour ? (
        <TutorialOverlay
          steps={steps}
          active
          index={index}
          onIndexChange={handleIndexChange}
          onClose={closeTour}
          onComplete={handleComplete}
        />
      ) : null}
      {showComplete ? <TourCompleteModal onClose={() => setShowComplete(false)} /> : null}
    </>
  );
}
