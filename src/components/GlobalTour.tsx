import { useState } from "react";
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
  const steps = resolveTour(location.pathname, tour, tab);
  const index = Math.min(Math.max(0, Number(params.get("step") ?? 0)), (steps?.length ?? 1) - 1);

  if (!steps?.length || !tour) return null;

  const goToStep = (nextIndex: number) => {
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
    closeTour();
    if (tour === "full") setShowComplete(true);
  };

  return (
    <>
      <TutorialOverlay
        steps={steps}
        active
        index={index}
        onIndexChange={goToStep}
        onClose={closeTour}
        onComplete={handleComplete}
      />
      {showComplete && <TourCompleteModal onClose={() => setShowComplete(false)} />}
    </>
  );
}
