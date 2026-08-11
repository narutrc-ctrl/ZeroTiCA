/** 랜딩 스크롤 — 3단계 요약 / 8세부 단계 */

import { journeyFlowPills } from "@/data/journey-steps";

export const storyJourneyIntro = {
  eyebrow: "서비스가 돌아가는 순서",
  act: {
    title: "3단계로 보는",
    titleAccent: "운영 흐름",
    lead:
      "수집·탐지·정제 → 고객 협업 → 검증·보고. 각 STEP 요약을 먼저 읽고, Detail을 눌러 세부 단계를 확인하세요.",
  },
  deep: {
    title: "8단계 전체 —",
    titleAccent: "실제 운영 순서 그대로",
    lead:
      "미러링·수집(01)부터 침해 평가 보고(08)까지, 왼쪽 설명과 오른쪽 서비스 화면이 한 세트로 이어집니다. 분석팀의 일과 고객이 확인하는 일을 구분해 읽어 주세요.",
  },
};

export const journeyPhases = journeyFlowPills.map((p) => ({
  step: p.step,
  label: p.label,
  anchor: "journey" as const,
}));
