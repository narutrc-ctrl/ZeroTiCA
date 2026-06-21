/** 랜딩 스크롤 — 실제 운영 순서 (8단계, unifiedJourneySteps와 동일) */

import { journeyFlowPills } from "@/data/journey-steps";

export const storyJourneyIntro = {
  eyebrow: "서비스가 돌아가는 순서",
  title: "스크롤하면, 실제로 일이 진행되는",
  titleAccent: "8단계 그 순서 그대로를 따라갑니다",
  lead:
    "미러링·수집(01)부터 침해 평가 보고(08)까지, 왼쪽 설명과 오른쪽 RUNA 화면이 한 세트로 이어집니다. 분석팀의 일과 고객이 확인하는 일을 구분해 읽어 주세요.",
};

export const journeyPhases = journeyFlowPills.map((p) => ({
  step: p.step,
  label: p.label,
  anchor: "journey" as const,
}));
