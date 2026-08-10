import { useCallback, useEffect, useRef, useState } from "react";
import {
  chapterForPhase,
  getCaseAnalystSteps,
  getCaseIncident,
  getCaseMonitoringLogs,
  getChapterSubProgress,
  storyChapters,
  type SimCase,
  type SimPhase,
} from "@/data/issue-story";

type Comment = {
  author: string;
  role: "staff" | "client";
  at: string;
  body: string;
};

export type SimKanbanColumn = "hidden" | "pre_request" | "in_request" | "done";

/** @deprecated 자동 진행 제거 — 타이밍 상수는 호환용으로만 유지 */
export const SIM_TIMING = {
  monitoringToAnomaly: 4800,
  logTick: 1750,
  anomalyToAnalyst: 3200,
  analystStep: 2000,
  analystToDelivery: 1600,
  deliveryKanbanCard: 600,
  deliveryToKanban: 2200,
  verifyToStaffReply: 2400,
  staffReplyToComplete: 1800,
  replyTypeChar: 28,
  replyTypeStart: 400,
} as const;

const initialComments = (activeCase: SimCase): Comment[] => {
  const current = getCaseIncident(activeCase);
  return [
    {
      author: "분석팀",
      role: "staff",
      at: activeCase === "normal" ? "2026-05-12 11:20" : "2026-05-21 09:10",
      body: current.staffQuestion,
    },
  ];
};

const clientComment = (activeCase: SimCase): Comment => {
  const caseData = getCaseIncident(activeCase);
  return {
    author: "demo_admin",
    role: "client",
    body: caseData.presetReply,
    at: activeCase === "normal" ? "2026-05-13 09:40" : "2026-05-22 10:15",
  };
};

const staffReplyComment = (activeCase: SimCase): Comment => {
  const caseData = getCaseIncident(activeCase);
  return {
    author: "분석팀",
    role: "staff",
    at: activeCase === "normal" ? "2026-05-13 14:00" : "2026-05-22 15:30",
    body: caseData.staffReply,
  };
};

export function useIssueSimulation() {
  const [started, setStarted] = useState(false);
  const [activeCase, setActiveCase] = useState<SimCase>("normal");
  const [phase, setPhase] = useState<SimPhase>("monitoring");
  const [analystStep, setAnalystStep] = useState(0);
  const [logCount, setLogCount] = useState(2);
  const [eventCount, setEventCount] = useState(getCaseIncident("normal").initialEventCount);
  const [issueCount, setIssueCount] = useState(getCaseIncident("normal").initialIssueCount);
  const [riskLevel, setRiskLevel] = useState(getCaseIncident("normal").riskBefore);
  const [kanbanColumn, setKanbanColumn] = useState<SimKanbanColumn>("hidden");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyTyping, setReplyTyping] = useState(false);
  const [taskStatus, setTaskStatus] = useState<"확인 요청" | "확인 중" | "완료">("확인 요청");
  const [comments, setComments] = useState<Comment[]>(() => initialComments("normal"));
  const timersRef = useRef<number[]>([]);

  const current = getCaseIncident(activeCase);
  const monitoringLogs = getCaseMonitoringLogs(activeCase);
  const analystSteps = getCaseAnalystSteps(activeCase);

  const chapterIndex = chapterForPhase(phase, activeCase);
  const progress = Math.round(((chapterIndex + 1) / storyChapters.length) * 100);
  const subProgress = getChapterSubProgress(phase, activeCase, analystStep);
  const isAtStart = activeCase === "normal" && (phase === "monitoring" || phase === "anomaly");
  const isAtEnd = phase === "report";

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const applyAnomalyStats = useCallback((nextCase: SimCase) => {
    const logs = getCaseMonitoringLogs(nextCase);
    const caseData = getCaseIncident(nextCase);
    setLogCount(logs.length);
    setEventCount(caseData.initialEventCount + 12);
    setIssueCount(caseData.initialIssueCount + 1);
    setRiskLevel(caseData.riskAfter);
  }, []);

  const resetCaseState = useCallback((nextCase: SimCase, options?: { startAtKanban?: boolean }) => {
    const caseData = getCaseIncident(nextCase);
    setActiveCase(nextCase);
    setAnalystStep(0);
    setLogCount(2);
    setEventCount(caseData.initialEventCount);
    setIssueCount(caseData.initialIssueCount);
    setRiskLevel(caseData.riskBefore);
    setKanbanColumn(options?.startAtKanban ? "pre_request" : "hidden");
    setSheetOpen(false);
    setEventDetailOpen(false);
    setReplyDraft("");
    setReplyTyping(false);
    setTaskStatus("확인 요청");
    setComments(initialComments(nextCase));
    setPhase(options?.startAtKanban ? "kanban" : "monitoring");
  }, []);

  const startSimulation = useCallback(() => {
    clearTimers();
    resetCaseState("normal");
    setStarted(true);
  }, [clearTimers, resetCaseState]);

  const restart = useCallback(() => {
    clearTimers();
    resetCaseState("normal");
    setStarted(true);
  }, [clearTimers, resetCaseState]);

  const startThreatCase = useCallback(() => {
    clearTimers();
    resetCaseState("threat", { startAtKanban: true });
    setStarted(true);
  }, [clearTimers, resetCaseState]);

  const jumpToReport = useCallback(() => {
    clearTimers();
    setStarted(true);
    setActiveCase("threat");
    setTaskStatus("완료");
    setKanbanColumn("done");
    setSheetOpen(false);
    setEventDetailOpen(false);
    setReplyDraft("");
    setReplyTyping(false);
    setComments([...initialComments("threat"), clientComment("threat"), staffReplyComment("threat")]);
    setPhase("report");
  }, [clearTimers]);

  /** 5단계 UI 챕터로 점프 (탭) — 자동 진행 없이 해당 챕터 시작 상태 */
  const goToChapter = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(storyChapters.length - 1, index));
      clearTimers();
      setStarted(true);

      if (clamped === 0) {
        resetCaseState("normal");
        return;
      }
      if (clamped === 1) {
        const caseData = getCaseIncident("normal");
        setActiveCase("normal");
        setAnalystStep(0);
        applyAnomalyStats("normal");
        setKanbanColumn("hidden");
        setSheetOpen(false);
        setEventDetailOpen(false);
        setReplyDraft("");
        setReplyTyping(false);
        setTaskStatus("확인 요청");
        setComments(initialComments("normal"));
        setEventCount(caseData.initialEventCount + 12);
        setIssueCount(caseData.initialIssueCount + 1);
        setRiskLevel(caseData.riskAfter);
        setPhase("analyst");
        return;
      }
      if (clamped === 2) {
        resetCaseState("normal", { startAtKanban: true });
        return;
      }
      if (clamped === 3) {
        resetCaseState("threat", { startAtKanban: true });
        return;
      }
      jumpToReport();
    },
    [applyAnomalyStats, clearTimers, jumpToReport, resetCaseState],
  );

  const openTask = useCallback(() => {
    setKanbanColumn("in_request");
    setSheetOpen(true);
    setEventDetailOpen(false);
    setPhase("task");
  }, []);

  const openEventDetail = useCallback(() => {
    setEventDetailOpen(true);
  }, []);

  const closeEventDetail = useCallback(() => {
    setEventDetailOpen(false);
  }, []);

  const startReply = useCallback(() => {
    const text = getCaseIncident(activeCase).presetReply;
    setEventDetailOpen(false);
    setReplyTyping(false);
    setReplyDraft(text);
    setPhase("reply");
  }, [activeCase]);

  const submitReply = useCallback(() => {
    setComments([
      ...initialComments(activeCase),
      clientComment(activeCase),
      staffReplyComment(activeCase),
    ]);
    setTaskStatus("완료");
    setPhase("staff-reply");
  }, [activeCase]);

  const openReport = useCallback(() => {
    setPhase("report");
  }, []);

  const goNext = useCallback(() => {
    clearTimers();
    setStarted(true);

    if (phase === "monitoring" || phase === "anomaly") {
      applyAnomalyStats(activeCase);
      setAnalystStep(0);
      setPhase("analyst");
      return;
    }
    if (phase === "analyst") {
      const steps = getCaseAnalystSteps(activeCase);
      if (analystStep < steps.length - 1) {
        setAnalystStep((s) => s + 1);
        return;
      }
      setKanbanColumn("pre_request");
      setSheetOpen(false);
      setEventDetailOpen(false);
      setPhase("kanban");
      return;
    }
    if (phase === "delivery") {
      // 알림 단계 제거 — 바로 칸반으로
      setKanbanColumn("pre_request");
      setPhase("kanban");
      return;
    }
    if (phase === "kanban") {
      openTask();
      return;
    }
    if (phase === "task") {
      startReply();
      return;
    }
    if (phase === "reply") {
      submitReply();
      return;
    }
    if (phase === "verifying") {
      // 분석중 단계 제거 — 바로 회신으로
      setComments([
        ...initialComments(activeCase),
        clientComment(activeCase),
        staffReplyComment(activeCase),
      ]);
      setTaskStatus("완료");
      setPhase("staff-reply");
      return;
    }
    if (phase === "staff-reply") {
      // 검증 단계: 완료 화면 없이 바로 고객 조치로
      if (activeCase === "normal") {
        resetCaseState("threat", { startAtKanban: true });
        return;
      }
      setSheetOpen(false);
      setEventDetailOpen(false);
      setKanbanColumn("done");
      setPhase("complete");
      return;
    }
    if (phase === "complete") {
      setPhase("report");
      return;
    }
  }, [
    activeCase,
    analystStep,
    applyAnomalyStats,
    clearTimers,
    openTask,
    phase,
    resetCaseState,
    startReply,
    submitReply,
  ]);

  const goPrev = useCallback(() => {
    clearTimers();
    setStarted(true);

    if (phase === "report") {
      setActiveCase("threat");
      setTaskStatus("완료");
      setKanbanColumn("done");
      setSheetOpen(false);
      setEventDetailOpen(false);
      setReplyDraft("");
      setReplyTyping(false);
      setComments([...initialComments("threat"), clientComment("threat"), staffReplyComment("threat")]);
      setPhase("complete");
      return;
    }
    if (phase === "complete") {
      if (activeCase === "threat") {
        setSheetOpen(true);
        setKanbanColumn("in_request");
        setTaskStatus("완료");
        setComments([...initialComments("threat"), clientComment("threat"), staffReplyComment("threat")]);
        setReplyDraft(getCaseIncident("threat").presetReply);
        setPhase("staff-reply");
        return;
      }
      setSheetOpen(true);
      setKanbanColumn("in_request");
      setTaskStatus("완료");
      setComments([...initialComments("normal"), clientComment("normal"), staffReplyComment("normal")]);
      setReplyDraft(getCaseIncident("normal").presetReply);
      setPhase("staff-reply");
      return;
    }
    if (phase === "staff-reply" || phase === "verifying") {
      setComments(initialComments(activeCase));
      setTaskStatus("확인 요청");
      setReplyDraft(getCaseIncident(activeCase).presetReply);
      setReplyTyping(false);
      setSheetOpen(true);
      setKanbanColumn("in_request");
      setPhase("reply");
      return;
    }
    if (phase === "reply") {
      setReplyDraft("");
      setReplyTyping(false);
      setEventDetailOpen(false);
      setSheetOpen(true);
      setKanbanColumn("in_request");
      setTaskStatus("확인 요청");
      setComments(initialComments(activeCase));
      setPhase("task");
      return;
    }
    if (phase === "task") {
      setSheetOpen(false);
      setEventDetailOpen(false);
      setKanbanColumn("pre_request");
      setPhase("kanban");
      return;
    }
    if (phase === "kanban" || phase === "delivery") {
      if (activeCase === "threat") {
        // 위협 사례 칸반 이전 = 정상 사례 분석팀 회신
        setActiveCase("normal");
        setTaskStatus("완료");
        setKanbanColumn("in_request");
        setSheetOpen(true);
        setEventDetailOpen(false);
        setReplyDraft(getCaseIncident("normal").presetReply);
        setComments([...initialComments("normal"), clientComment("normal"), staffReplyComment("normal")]);
        setPhase("staff-reply");
        return;
      }
      const steps = getCaseAnalystSteps(activeCase);
      setKanbanColumn("hidden");
      setSheetOpen(false);
      setAnalystStep(steps.length - 1);
      setPhase("analyst");
      return;
    }
    if (phase === "analyst") {
      if (analystStep > 0) {
        setAnalystStep((s) => s - 1);
        return;
      }
      const caseData = getCaseIncident(activeCase);
      setLogCount(2);
      setEventCount(caseData.initialEventCount);
      setIssueCount(caseData.initialIssueCount);
      setRiskLevel(caseData.riskBefore);
      setPhase("monitoring");
    }
  }, [activeCase, analystStep, clearTimers, phase]);

  /** @deprecated goNext 사용 */
  const goNextChapter = goNext;
  /** @deprecated goPrev 사용 */
  const goPrevChapter = goPrev;

  const goTo = useCallback((next: SimPhase) => {
    clearTimers();
    setPhase(next);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    started,
    activeCase,
    phase,
    chapterIndex,
    progress,
    subProgress,
    analystStep,
    logCount,
    eventCount,
    issueCount,
    riskLevel,
    kanbanColumn,
    sheetOpen,
    eventDetailOpen,
    replyDraft,
    replyTyping,
    taskStatus,
    comments,
    current,
    monitoringLogs,
    analystSteps,
    isAtStart,
    isAtEnd,
    startSimulation,
    restart,
    startThreatCase,
    jumpToReport,
    goTo,
    goToChapter,
    goNext,
    goPrev,
    goNextChapter,
    goPrevChapter,
    openTask,
    openEventDetail,
    closeEventDetail,
    startReply,
    submitReply,
    openReport,
  };
}

export type IssueSimulationState = ReturnType<typeof useIssueSimulation>;
