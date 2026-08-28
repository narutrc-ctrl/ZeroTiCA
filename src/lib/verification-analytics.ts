import type { SimCase, SimPhase } from "@/data/issue-story";
import { getCaseAnalystSteps } from "@/data/issue-story";
import type { VerificationChapterId, VerificationStepId } from "@/lib/analytics";

export type VerificationSimState = {
  phase: SimPhase;
  analystStep: number;
  activeCase: SimCase;
};

const VERIFY_FLOW_PHASES = ["kanban", "task", "reply", "staff-reply", "complete"] as const satisfies readonly SimPhase[];

function selectStepId(analystStep: number): VerificationStepId | null {
  const n = analystStep + 1;
  if (n < 1 || n > 4) return null;
  return (`select_0${n}` as VerificationStepId);
}

function verifyStepId(phase: SimPhase): VerificationStepId | null {
  const idx = VERIFY_FLOW_PHASES.indexOf(phase as (typeof VERIFY_FLOW_PHASES)[number]);
  if (idx < 0) return null;
  return (`verify_0${idx + 1}` as VerificationStepId);
}

function actionStepId(phase: SimPhase): VerificationStepId | null {
  const idx = VERIFY_FLOW_PHASES.indexOf(phase as (typeof VERIFY_FLOW_PHASES)[number]);
  if (idx < 0) return null;
  return (`action_0${idx + 1}` as VerificationStepId);
}

/** phase / analystStep / activeCase → analytics step (legacy phase는 null) */
export function getVerificationAnalyticsStep(
  state: VerificationSimState,
): { stepId: VerificationStepId; chapterId: VerificationChapterId } | null {
  const { phase, analystStep, activeCase } = state;

  if (phase === "monitoring") {
    return { stepId: "observe", chapterId: "observe" };
  }
  if (phase === "report") {
    return { stepId: "report", chapterId: "report" };
  }
  if (phase === "analyst") {
    const stepId = selectStepId(analystStep);
    return stepId ? { stepId, chapterId: "select" } : null;
  }
  if (activeCase === "normal") {
    const stepId = verifyStepId(phase);
    return stepId ? { stepId, chapterId: "verify" } : null;
  }
  if (activeCase === "threat") {
    const stepId = actionStepId(phase);
    return stepId ? { stepId, chapterId: "customer_action" } : null;
  }
  return null;
}

/** JourneyNavFooter 「다음」 — goNext와 동일 전이 */
export function previewVerificationGoNext(state: VerificationSimState): VerificationSimState | null {
  const { phase, analystStep, activeCase } = state;

  if (phase === "monitoring" || phase === "anomaly") {
    return { phase: "analyst", analystStep: 0, activeCase };
  }
  if (phase === "analyst") {
    const steps = getCaseAnalystSteps(activeCase);
    if (analystStep < steps.length - 1) {
      return { phase, analystStep: analystStep + 1, activeCase };
    }
    return { phase: "kanban", analystStep: 0, activeCase };
  }
  if (phase === "delivery") {
    return { phase: "kanban", analystStep: 0, activeCase };
  }
  if (phase === "kanban") {
    return { phase: "task", analystStep, activeCase };
  }
  if (phase === "task") {
    return { phase: "reply", analystStep, activeCase };
  }
  if (phase === "reply") {
    return { phase: "staff-reply", analystStep, activeCase };
  }
  if (phase === "verifying") {
    return { phase: "staff-reply", analystStep, activeCase };
  }
  if (phase === "staff-reply") {
    return { phase: "complete", analystStep, activeCase };
  }
  if (phase === "complete") {
    if (activeCase === "normal") {
      return { phase: "kanban", analystStep: 0, activeCase: "threat" };
    }
    return { phase: "report", analystStep: 0, activeCase: "threat" };
  }
  return null;
}

/** JourneyNavFooter 「이전」 — goPrev와 동일 전이 */
export function previewVerificationGoPrev(state: VerificationSimState): VerificationSimState | null {
  const { phase, analystStep, activeCase } = state;

  if (phase === "report") {
    return { phase: "complete", analystStep: 0, activeCase: "threat" };
  }
  if (phase === "complete") {
    return { phase: "staff-reply", analystStep: 0, activeCase };
  }
  if (phase === "staff-reply" || phase === "verifying") {
    return { phase: "reply", analystStep, activeCase };
  }
  if (phase === "reply") {
    return { phase: "task", analystStep, activeCase };
  }
  if (phase === "task") {
    return { phase: "kanban", analystStep, activeCase };
  }
  if (phase === "kanban" || phase === "delivery") {
    if (activeCase === "threat") {
      return { phase: "complete", analystStep: 0, activeCase: "normal" };
    }
    const steps = getCaseAnalystSteps(activeCase);
    return { phase: "analyst", analystStep: steps.length - 1, activeCase };
  }
  if (phase === "analyst") {
    if (analystStep > 0) {
      return { phase, analystStep: analystStep - 1, activeCase };
    }
    return { phase: "monitoring", analystStep: 0, activeCase };
  }
  return null;
}

/** JourneyStepTabs / 처음으로 — goToChapter·restart 목표 상태 */
export function previewVerificationGoToChapter(chapterIndex: number): VerificationSimState | null {
  const clamped = Math.max(0, Math.min(4, chapterIndex));
  if (clamped === 0) {
    return { phase: "monitoring", analystStep: 0, activeCase: "normal" };
  }
  if (clamped === 1) {
    return { phase: "analyst", analystStep: 0, activeCase: "normal" };
  }
  if (clamped === 2) {
    return { phase: "kanban", analystStep: 0, activeCase: "normal" };
  }
  if (clamped === 3) {
    return { phase: "kanban", analystStep: 0, activeCase: "threat" };
  }
  return { phase: "report", analystStep: 0, activeCase: "threat" };
}

export function previewVerificationRestart(): VerificationSimState {
  return { phase: "monitoring", analystStep: 0, activeCase: "normal" };
}
