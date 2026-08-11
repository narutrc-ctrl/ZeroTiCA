/** 이슈 관리 UI 공통 라벨 (객체명=이슈, 상태·단계=자연어) */

export const ISSUE_MENU = "이슈 관리";

export const KANBAN_COLUMNS = {
  pre_request: "확인 요청",
  in_request: "확인 중",
  done: "완료",
} as const;

/** 랜딩 검증 과정(관측~보고서) 칸반 컬럼 라벨 */
export const JOURNEY_KANBAN_COLUMNS = {
  pre_request: "확인 요청",
  in_request: "확인 중",
  done: "확인 완료",
} as const;

export const ISSUE_STATUS = {
  draft: "요청 전",
  requested: "확인 요청",
  checking: "확인 중",
  needsUpdate: "보완 필요",
  completed: "완료",
} as const;
