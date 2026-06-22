import { useLocation, useSearchParams } from "react-router-dom";
import { resolveTour, resolveTourUiState, type TourStep, type TourUiState } from "@/data/demo-tour";

export function useDemoTour(): {
  active: boolean;
  tour: string | null;
  stepIndex: number;
  step: TourStep | null;
  ui: TourUiState;
} {
  const location = useLocation();
  const [params] = useSearchParams();
  const tour = params.get("tour");
  const tab = params.get("tab");
  const steps = resolveTour(location.pathname, tour, tab);
  const stepIndex = Math.min(
    Math.max(0, Number(params.get("step") ?? 0)),
    Math.max(0, (steps?.length ?? 1) - 1),
  );
  const step = steps?.[stepIndex] ?? null;

  return {
    active: Boolean(tour && step),
    tour,
    stepIndex,
    step,
    ui: resolveTourUiState(step?.id),
  };
}
