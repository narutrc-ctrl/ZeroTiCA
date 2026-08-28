import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  trackVerificationNavigation,
  trackVerificationStepView,
  type VerificationNavigationAction,
  type VerificationStepId,
} from "@/lib/analytics";
import {
  getVerificationAnalyticsStep,
  type VerificationSimState,
} from "@/lib/verification-analytics";

type HomeVerificationVisitContextValue = {
  gateOpen: boolean;
  /** HomeSectionViewTracker — verification_process section_view 직후 호출 */
  notifyVerificationProcessSectionView: () => void;
  tryTrackStepForState: (state: VerificationSimState) => void;
  trackNavigation: (
    action: VerificationNavigationAction,
    from: VerificationSimState,
    to: VerificationSimState,
  ) => void;
};

const HomeVerificationVisitContext = createContext<HomeVerificationVisitContextValue | null>(
  null,
);

export function HomeVerificationVisitProvider({ children }: { children: ReactNode }) {
  const [gateOpen, setGateOpen] = useState(false);
  const firedStepsRef = useRef<Set<VerificationStepId>>(new Set());

  useEffect(() => {
    return () => {
      firedStepsRef.current.clear();
      setGateOpen(false);
    };
  }, []);

  const notifyVerificationProcessSectionView = useCallback(() => {
    setGateOpen(true);
  }, []);

  const tryTrackStepForState = useCallback(
    (state: VerificationSimState) => {
      if (!gateOpen) return;
      const parsed = getVerificationAnalyticsStep(state);
      if (!parsed) return;
      if (firedStepsRef.current.has(parsed.stepId)) return;
      firedStepsRef.current.add(parsed.stepId);
      trackVerificationStepView(parsed.stepId, parsed.chapterId);
    },
    [gateOpen],
  );

  const trackNavigation = useCallback(
    (
      action: VerificationNavigationAction,
      from: VerificationSimState,
      to: VerificationSimState,
    ) => {
      if (!gateOpen) return;
      const fromParsed = getVerificationAnalyticsStep(from);
      const toParsed = getVerificationAnalyticsStep(to);
      if (!fromParsed || !toParsed) return;
      trackVerificationNavigation({
        action,
        from_step_id: fromParsed.stepId,
        to_step_id: toParsed.stepId,
      });
    },
    [gateOpen],
  );

  const value = useMemo(
    () => ({
      gateOpen,
      notifyVerificationProcessSectionView,
      tryTrackStepForState,
      trackNavigation,
    }),
    [gateOpen, notifyVerificationProcessSectionView, tryTrackStepForState, trackNavigation],
  );

  return (
    <HomeVerificationVisitContext.Provider value={value}>
      {children}
    </HomeVerificationVisitContext.Provider>
  );
}

export function useHomeVerificationVisit(): HomeVerificationVisitContextValue {
  const ctx = useContext(HomeVerificationVisitContext);
  if (!ctx) {
    throw new Error("useHomeVerificationVisit must be used within HomeVerificationVisitProvider");
  }
  return ctx;
}
