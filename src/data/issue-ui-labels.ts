/** RUNA 이슈 관리 UI 공통 라벨 (객체명=이슈, 상태·단계=자연어) */

export const ISSUE_MENU = "이슈 관리";

export const KANBAN_COLUMNS = {
  pre_request: "요청 전",
  in_request: "확인 요청",
  done: "완료",
} as const;

export const ISSUE_STATUS = {
  draft: "요청 전",
  requested: "확인 요청",
  checking: "확인 중",
  needsUpdate: "보완 필요",
  completed: "완료",
} as const;
