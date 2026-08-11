import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { TourCompleteModal } from "@/components/DemoTourPrompt";
import { resolveTour } from "@/data/demo-tour";

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

  const goToStep = (nextIndex: number) => {
    if (!steps?.length || !tour) return;
    const step = steps[nextIndex];
    navigate(
      { pathname: step.route, search: buildSearch(tour, nextIndex, step.search) },
      { replace: true },
    );
  };

  const closeTour = () => {
    const keep = new URLSearchParams();
    if (tab) keep.set("tab", tab);
    const qs = keep.toString();
    navigate({ pathname: location.pathname, search: qs || undefined }, { replace: true });
  };

  const handleComplete = () => {
    const wasFull = tour === "full";
    closeTour();
    if (wasFull) setShowComplete(true);
  };

  return (
    <>
      {steps?.length && tour ? (
        <TutorialOverlay
          steps={steps}
          active
          index={index}
          onIndexChange={goToStep}
          onClose={closeTour}
          onComplete={handleComplete}
        />
      ) : null}
      {showComplete ? <TourCompleteModal onClose={() => setShowComplete(false)} /> : null}
    </>
  );
}
