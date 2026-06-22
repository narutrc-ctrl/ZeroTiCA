/** 랜딩 스크롤 — 3막 요약 / 8단계 심화 */

import { journeyFlowPills } from "@/data/journey-steps";

export const storyJourneyIntro = {
  eyebrow: "서비스가 돌아가는 순서",
  act: {
    title: "3막으로 먼저 보는",
    titleAccent: "운영 흐름",
    lead:
      "수집·탐지 → RUNA 협업 → 검증·보고. 흐름을 파악한 뒤, PoC·기술 검토가 필요하면 8단계 전체를 펼칠 수 있습니다.",
  },
  deep: {
    title: "8단계 전체 —",
    titleAccent: "실제 운영 순서 그대로",
    lead:
      "미러링·수집(01)부터 침해 평가 보고(08)까지, 왼쪽 설명과 오른쪽 RUNA 화면이 한 세트로 이어집니다. 분석팀의 일과 고객이 확인하는 일을 구분해 읽어 주세요.",
  },
};

export const journeyPhases = journeyFlowPills.map((p) => ({
  step: p.step,
  label: p.label,
  anchor: "journey" as const,
}));
