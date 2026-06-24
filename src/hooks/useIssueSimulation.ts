import { useCallback, useEffect, useRef, useState } from "react";
import {
  analystSteps,
  incident,
  monitoringLogs,
  simPhaseOrder,
  type SimPhase,
} from "@/data/issue-story";

export function useIssueSimulation() {
  const [phase, setPhase] = useState<SimPhase>("monitoring");
  const [analystStep, setAnalystStep] = useState(0);
  const [logCount, setLogCount] = useState(2);
  const [eventCount, setEventCount] = useState(1184);
  const [issueCount, setIssueCount] = useState(2);
  const [riskLevel, setRiskLevel] = useState(incident.riskBefore);
  const [cardInColumn, setCardInColumn] = useState<"hidden" | "entering" | "ready" | "done">("hidden");
  const [replyDraft, setReplyDraft] = useState("");
  const [replyTyping, setReplyTyping] = useState(false);
  const [taskStatus, setTaskStatus] = useState<"확인 요청" | "확인 중" | "업무 완료">("확인 요청");
  const [comments, setComments] = useState<
    { author: string; role: "staff" | "client"; body: string; at: string }[]
  >([
    {
      author: "분석팀",
      role: "staff",
      at: "2026-05-12 11:20",
      body: incident.staffQuestion,
    },
  ]);
  const timersRef = useRef<number[]>([]);

  const phaseIndex = simPhaseOrder.indexOf(phase);
  const progress = Math.round(((phaseIndex + 1) / simPhaseOrder.length) * 100);

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

  const restart = useCallback(() => {
    clearTimers();
    setPhase("monitoring");
    setAnalystStep(0);
    setLogCount(2);
    setEventCount(1184);
    setIssueCount(2);
    setRiskLevel(incident.riskBefore);
    setCardInColumn("hidden");
    setReplyDraft("");
    setReplyTyping(false);
    setTaskStatus("확인 요청");
    setComments([
      { author: "분석팀", role: "staff", at: "2026-05-12 11:20", body: incident.staffQuestion },
    ]);
  }, [clearTimers]);

  const openTask = useCallback(() => goTo("task"), [goTo]);

  const startReply = useCallback(() => {
    goTo("reply");
    setReplyTyping(true);
    setReplyDraft("");
    const text = incident.presetReply;
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setReplyDraft(text.slice(0, i));
        i += 1;
        schedule(type, 28);
      } else {
        setReplyTyping(false);
      }
    };
    schedule(type, 400);
  }, [goTo, schedule]);

  const submitReply = useCallback(() => {
    if (replyTyping || !replyDraft) return;
    setComments((prev) => [
      ...prev,
      { author: "demo_admin", role: "client", body: incident.presetReply, at: "2026-05-13 09:40" },
    ]);
    setTaskStatus("확인 중");
    goTo("verifying");
    schedule(() => {
      setComments((prev) => [
        ...prev,
        { author: "분석팀", role: "staff", at: "2026-05-13 14:00", body: incident.staffReply },
      ]);
      goTo("staff-reply");
    }, 2200);
  }, [goTo, schedule, replyDraft, replyTyping]);

  const completeTask = useCallback(() => {
    setTaskStatus("업무 완료");
    setCardInColumn("done");
    goTo("complete");
    schedule(() => goTo("report"), 2800);
  }, [goTo, schedule]);

  const skipToAnalyst = useCallback(() => {
    setLogCount(monitoringLogs.length);
    setEventCount(1196);
    setIssueCount(3);
    setRiskLevel(incident.riskAfter);
    setAnalystStep(0);
    goTo("analyst");
  }, [goTo]);

  useEffect(() => {
    if (phase !== "monitoring") return;
    const logInterval = window.setInterval(() => {
      setLogCount((c) => Math.min(c + 1, monitoringLogs.length - 1));
      setEventCount((c) => c + 2);
    }, 750);
    schedule(() => {
      setLogCount(monitoringLogs.length);
      setEventCount(1196);
      setIssueCount(3);
      setRiskLevel(incident.riskAfter);
      goTo("anomaly");
    }, 4800);
    return () => window.clearInterval(logInterval);
  }, [phase, goTo, schedule]);

  useEffect(() => {
    if (phase !== "anomaly") return;
    schedule(() => {
      setAnalystStep(0);
      goTo("analyst");
    }, 3200);
  }, [phase, goTo, schedule]);

  useEffect(() => {
    if (phase !== "analyst") return;
    if (analystStep >= analystSteps.length - 1) {
      schedule(() => goTo("delivery"), 1600);
      return;
    }
    schedule(() => setAnalystStep((s) => s + 1), 2000);
  }, [phase, analystStep, goTo, schedule]);

  useEffect(() => {
    if (phase !== "delivery") return;
    schedule(() => setCardInColumn("entering"), 500);
    schedule(() => {
      setCardInColumn("ready");
      goTo("kanban");
    }, 2200);
  }, [phase, goTo, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    phase,
    phaseIndex,
    progress,
    analystStep,
    logCount,
    eventCount,
    issueCount,
    riskLevel,
    cardInColumn,
    replyDraft,
    replyTyping,
    taskStatus,
    comments,
    goTo,
    restart,
    openTask,
    startReply,
    submitReply,
    completeTask,
    skipToAnalyst,
  };
}

export type IssueSimulationState = ReturnType<typeof useIssueSimulation>;
