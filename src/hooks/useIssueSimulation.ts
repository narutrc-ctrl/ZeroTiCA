import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCaseAnalystSteps,
  getCaseIncident,
  getCaseMonitoringLogs,
  simPhaseOrder,
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

/** 단계 전환·타이핑 속도(ms) — 시뮬레이션 페이스는 여기서 조절 */
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
  const [taskStatus, setTaskStatus] = useState<"확인 요청" | "확인 중" | "조치 완료">("확인 요청");
  const [comments, setComments] = useState<Comment[]>(() => initialComments("normal"));
  const timersRef = useRef<number[]>([]);

  const current = getCaseIncident(activeCase);
  const monitoringLogs = getCaseMonitoringLogs(activeCase);
  const analystSteps = getCaseAnalystSteps(activeCase);

  const caseOffset = activeCase === "normal" ? 0 : simPhaseOrder.length;
  const chapterIndex = started ? caseOffset + simPhaseOrder.indexOf(phase) : -1;
  const progress = started ? Math.round(((chapterIndex + 1) / (simPhaseOrder.length * 2)) * 100) : 0;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const goTo = useCallback(
    (next: SimPhase) => {
      clearTimers();
      setPhase(next);
    },
    [clearTimers],
  );

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

  const resetAll = useCallback(() => {
    resetCaseState("normal");
    setStarted(false);
  }, [resetCaseState]);

  const startSimulation = useCallback(() => {
    clearTimers();
    resetCaseState("normal");
    setStarted(true);
  }, [clearTimers, resetCaseState]);

  const restart = useCallback(() => {
    clearTimers();
    resetAll();
  }, [clearTimers, resetAll]);

  const startThreatCase = useCallback(() => {
    clearTimers();
    resetCaseState("threat", { startAtKanban: true });
    setStarted(true);
  }, [clearTimers, resetCaseState]);

  const jumpToReport = useCallback(() => {
    clearTimers();
    setStarted(true);
    setActiveCase("threat");
    setTaskStatus("조치 완료");
    setKanbanColumn("done");
    setSheetOpen(false);
    setEventDetailOpen(false);
    setPhase("report");
  }, [clearTimers]);

  const openTask = useCallback(() => {
    setKanbanColumn("in_request");
    setSheetOpen(true);
    setEventDetailOpen(false);
    goTo("task");
  }, [goTo]);

  const openEventDetail = useCallback(() => {
    setEventDetailOpen(true);
  }, []);

  const closeEventDetail = useCallback(() => {
    setEventDetailOpen(false);
  }, []);

  const startReply = useCallback(() => {
    setEventDetailOpen(false);
    goTo("reply");
    setReplyTyping(true);
    setReplyDraft("");
    const text = getCaseIncident(activeCase).presetReply;
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setReplyDraft(text.slice(0, i));
        i += 1;
        schedule(type, SIM_TIMING.replyTypeChar);
      } else {
        setReplyTyping(false);
      }
    };
    schedule(type, SIM_TIMING.replyTypeStart);
  }, [goTo, schedule, activeCase]);

  const submitReply = useCallback(() => {
    if (replyTyping || !replyDraft) return;
    const caseData = getCaseIncident(activeCase);
    setComments((prev) => [
      ...prev,
      {
        author: "demo_admin",
        role: "client",
        body: caseData.presetReply,
        at: activeCase === "normal" ? "2026-05-13 09:40" : "2026-05-22 10:15",
      },
    ]);
    setTaskStatus("확인 중");
    goTo("verifying");
    schedule(() => {
      setComments((prev) => [
        ...prev,
        {
          author: "분석팀",
          role: "staff",
          at: activeCase === "normal" ? "2026-05-13 14:00" : "2026-05-22 15:30",
          body: caseData.staffReply,
        },
      ]);
      setTaskStatus("조치 완료");
      goTo("staff-reply");
      schedule(() => {
        setSheetOpen(false);
        setEventDetailOpen(false);
        setKanbanColumn("done");
        goTo("complete");
      }, SIM_TIMING.staffReplyToComplete);
    }, SIM_TIMING.verifyToStaffReply);
  }, [goTo, schedule, replyDraft, replyTyping, activeCase]);

  const openReport = useCallback(() => goTo("report"), [goTo]);

  useEffect(() => {
    if (!started || phase !== "monitoring") return;
    const logs = getCaseMonitoringLogs(activeCase);
    const caseData = getCaseIncident(activeCase);
    const logInterval = window.setInterval(() => {
      setLogCount((c) => Math.min(c + 1, logs.length - 1));
      setEventCount((c) => c + 2);
    }, SIM_TIMING.logTick);
    schedule(() => {
      setLogCount(logs.length);
      setEventCount(caseData.initialEventCount + 12);
      setIssueCount(caseData.initialIssueCount + 1);
      setRiskLevel(caseData.riskAfter);
      goTo("anomaly");
    }, SIM_TIMING.monitoringToAnomaly);
    return () => window.clearInterval(logInterval);
  }, [started, phase, activeCase, goTo, schedule]);

  useEffect(() => {
    if (!started || phase !== "anomaly") return;
    schedule(() => {
      setAnalystStep(0);
      goTo("analyst");
    }, SIM_TIMING.anomalyToAnalyst);
  }, [started, phase, goTo, schedule]);

  useEffect(() => {
    if (!started || phase !== "analyst") return;
    const steps = getCaseAnalystSteps(activeCase);
    if (analystStep >= steps.length - 1) {
      schedule(() => goTo("delivery"), SIM_TIMING.analystToDelivery);
      return;
    }
    schedule(() => setAnalystStep((s) => s + 1), SIM_TIMING.analystStep);
  }, [started, phase, analystStep, activeCase, goTo, schedule]);

  useEffect(() => {
    if (!started || phase !== "delivery") return;
    schedule(() => setKanbanColumn("pre_request"), SIM_TIMING.deliveryKanbanCard);
    schedule(() => goTo("kanban"), SIM_TIMING.deliveryToKanban);
  }, [started, phase, goTo, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    started,
    activeCase,
    phase,
    chapterIndex,
    progress,
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
    startSimulation,
    restart,
    startThreatCase,
    jumpToReport,
    goTo,
    openTask,
    openEventDetail,
    closeEventDetail,
    startReply,
    submitReply,
    openReport,
  };
}

export type IssueSimulationState = ReturnType<typeof useIssueSimulation>;
