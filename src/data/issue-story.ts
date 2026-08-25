/** 랜딩 미니 시뮬레이션 — 정상 검증 사례 + 위협 통신 사례 */

export const simulationIntro = {
  eyebrow: "판단 과정",
  title: "관측된 변화를,",
  titleLine2: "조치할 수 있는 판단으로 바꿉니다.",
  titleAccent: "",
  description:
    "ZeroTiCA가 이상 징후를 발견하고, 고객 업무 맥락을 확인한 뒤, 분석팀 검증과 조치 보고서까지 연결하는 과정을 짧게 체험합니다.",
  coreMessage: "",
  startCta: "미니 시뮬레이션 시작하기",
};

export type StoryChapterId =
  | "observe"
  | "select"
  | "verify"
  | "customer-action"
  | "report";

export type StoryTitlePart = { text: string; accent?: boolean };

export const storyChapters = [
  {
    id: "observe" as const,
    label: "관측",
    titleParts: [
      { text: "이상 이벤트 하나가 아닌,\n" },
      { text: "연결된 흐름", accent: true },
      { text: "을 봅니다." },
    ] satisfies StoryTitlePart[],
    description: "이벤트 간 연계 분석을 통해\n네트워크 통신의 흐름을 분석합니다.",
  },
  {
    id: "select" as const,
    label: "선별",
    titleParts: [
      { text: "평소와 다른 변화", accent: true },
      { text: "를" },
      { text: "\n선별합니다." },
    ] satisfies StoryTitlePart[],
    description: "새롭게 나타난 연결과 반복되는 활동, 이전과 달라진 패턴을 찾아내\n우선적으로 분석이 필요한 통신을 구분합니다.",
  },
  {
    id: "verify" as const,
    label: "검증",
    titleParts: [
      { text: "전문가가 직접", accent: true },
      { text: "\n변화의 의미를 검증합니다." },
    ] satisfies StoryTitlePart[],
    description: "관측된 활동의 관련 자산과 고객의 업무 맥락을 분석해\n정상인지 위협인지 판단합니다.",
  },
  {
    id: "customer-action" as const,
    label: "고객 조치",
    titleParts: [
      { text: "확인할 대상과 조치 방향을\n" },
      { text: "하나의 이슈", accent: true },
      { text: "로 전달합니다." },
    ] satisfies StoryTitlePart[],
    description: "무엇이 관측됐고 어떻게 조치해야 하는지 안내하고,\n고객이 조치를 수행하고 완료될 때까지 관리합니다.",
  },
  {
    id: "report" as const,
    label: "침해 평가 보고서",
    titleParts: [
      { text: "판단과 조치의 결과를\n" },
      { text: "근거로", accent: true },
      { text: " 남깁니다." },
    ] satisfies StoryTitlePart[],
    description: "일정 기간 동안 분석한 내용과 고객의 확인, 조치 결과를\n보고서로 정리해 이후에도 참고할 수 있도록 합니다.",
  },
] as const;

export type SimCase = "normal" | "threat";

export type SimPhase =
  | "monitoring"
  | "anomaly"
  | "analyst"
  | "delivery"
  | "kanban"
  | "task"
  | "reply"
  | "verifying"
  | "staff-reply"
  | "complete"
  | "report";

export const simPhaseOrder: SimPhase[] = [
  "monitoring",
  "anomaly",
  "analyst",
  "delivery",
  "kanban",
  "task",
  "reply",
  "verifying",
  "staff-reply",
  "complete",
  "report",
];

/** 5단계 UI 챕터 인덱스 (0–4). 사례·페이즈를 함께 본다. */
export function chapterForPhase(phase: SimPhase, activeCase: SimCase = "normal"): number {
  if (phase === "report") return 4;
  if (activeCase === "threat") return 3;
  if (phase === "monitoring" || phase === "anomaly") return 0;
  if (phase === "analyst") return 1;
  return 2;
}

const VERIFY_SUB_PHASES: SimPhase[] = [
  "kanban",
  "task",
  "reply",
  "staff-reply",
  "complete",
];

const THREAT_SUB_PHASES: SimPhase[] = [
  "kanban",
  "task",
  "reply",
  "staff-reply",
  "complete",
];

/** 검증 단계 하위 설명 (오른쪽 패널 · 검증 1/5~5/5) */
export const VERIFY_CHAPTER_DETAILS = [
  "분석가가 확인이 필요하다고 판단한 활동을 근거와 함께 하나의 이슈로 정리합니다.",
  "관측된 통신과 관련 정황을 분석하고, 판단에 필요한 업무 맥락을 고객에게 확인 요청합니다.",
  "고객은 해당 자산의 용도와 당시 업무 상황을 확인해, 분석에 필요한 내부 맥락을 전달합니다.",
  "분석가는 관측 데이터와 고객의 맥락을 함께 검토해, 정상 활동인지 위협인지 최종 판단합니다.",
  "정상으로 확인된 이슈는 완료 처리하고, 검증 기록으로 남겨 이후 판단의 기준으로 삼습니다.",
] as const;

/** 고객 조치 단계 하위 설명 (오른쪽 패널 · 고객 조치 1/5~5/5) */
export const THREAT_CHAPTER_DETAILS = [
  "위협으로 판단된 활동은 조치가 필요한 이슈로 이어서 관리합니다.",
  "분석가는 위협 정황과 영향을 정리해, 고객이 확인할 대상과 필요한 조치 방향을 제안합니다.",
  "고객은 내부 환경을 확인하고 필요한 조치를 수행한 뒤, 조치 결과를 분석가에게 공유합니다.",
  "분석가는 조치 이후 관련 활동을 다시 확인해, 위협이 해소되었는지 검증합니다.",
  "조치 결과까지 확인되면 이슈를 완료하고, 판단과 조치 결과를 다음 검증의 기준으로 남깁니다.",
] as const;

function verifySubIndex(phase: SimPhase): number {
  if (phase === "delivery") return 0;
  if (phase === "verifying") return VERIFY_SUB_PHASES.indexOf("staff-reply");
  const idx = VERIFY_SUB_PHASES.indexOf(phase);
  return Math.max(idx, 0);
}

function threatSubIndex(phase: SimPhase): number {
  if (phase === "delivery") return 0;
  if (phase === "verifying") return 3; // staff-reply와 동일: 조치 후 재검증
  const idx = THREAT_SUB_PHASES.indexOf(phase);
  return Math.max(idx, 0);
}

/** 현재 챕터의 하위 단계 진행 (0-based current) */
export function getChapterSubProgress(
  phase: SimPhase,
  activeCase: SimCase,
  analystStep: number,
): { total: number; current: number } {
  const chapter = chapterForPhase(phase, activeCase);

  if (chapter === 1) {
    const total = getCaseAnalystSteps(activeCase).length;
    return { total, current: Math.min(analystStep, Math.max(total - 1, 0)) };
  }

  if (chapter === 2) {
    return { total: VERIFY_SUB_PHASES.length, current: verifySubIndex(phase) };
  }

  if (chapter === 3) {
    return { total: THREAT_SUB_PHASES.length, current: threatSubIndex(phase) };
  }

  // 관측 · 침해 평가 보고서 — 하위 단계 1개
  return { total: 1, current: 0 };
}

/** 오른쪽 패널 서브문구 — 선별/검증/고객 조치는 하위 단계별, 그 외는 챕터 기본 설명 */
export function getChapterStepDetail(
  phase: SimPhase,
  activeCase: SimCase,
  analystStep: number,
): string {
  const chapter = chapterForPhase(phase, activeCase);
  const fallback = storyChapters[chapter]?.description ?? "";

  if (chapter === 1) {
    return getCaseAnalystSteps(activeCase)[analystStep]?.detail ?? fallback;
  }
  if (chapter === 2) {
    return VERIFY_CHAPTER_DETAILS[verifySubIndex(phase)] ?? fallback;
  }
  if (chapter === 3) {
    return THREAT_CHAPTER_DETAILS[threatSubIndex(phase)] ?? fallback;
  }
  return fallback;
}

export type NarrativeAction =
  | "wait"
  | "click-card"
  | "click-reply"
  | "click-submit"
  | "click-next-case"
  | "click-report";

export type SimulationNarrative = {
  situation: string;
  why: string;
  action: string;
  actionType?: NarrativeAction;
  note?: string;
};

const sharedNarrative: Record<SimPhase, SimulationNarrative> = {
  monitoring: {
    situation: "대부분의 이벤트는 정상 범주에서 처리되고 있습니다.",
    why: "오늘도 네트워크 모니터링이 실시간으로 돌아가고 있습니다.",
    action: "잠시 후 이상 징후가 검토 대기열에 올라옵니다.",
    actionType: "wait",
  },
  anomaly: {
    situation: "하나의 장기 세션이 검토 대기열에 올라왔습니다.",
    why: "이벤트 카운트와 위험도가 동시에 상승했습니다.",
    action: "곧 분석 파이프라인으로 이동합니다.",
    actionType: "wait",
  },
  analyst: {
    situation: "후보 통신이 분석 파이프라인에 들어갔습니다.",
    why: "탐지·IOC·화이트리스트 정제를 거쳐 고객 확인 필요 여부를 판단합니다.",
    action: "분석이 끝나면 이슈로 등록됩니다.",
    actionType: "wait",
    note: "미러링 로그 수집 → 탐지 규칙 매칭 → 화이트리스트 대조 → 이슈 등록",
  },
  delivery: {
    situation: "분석이 끝났고, ZeroTica Watch가 고객 확인 요청을 등록했습니다.",
    why: "선별된 이슈 한 건이 메일과 칸반에 동시에 도착합니다.",
    action: "오른쪽에서 새 이슈 카드 생성을 확인하세요.",
    actionType: "wait",
  },
  kanban: {
    situation: "확인 요청 컬럼에 새 카드가 올라왔습니다.",
    why: "분석 결과와 위협 내역이 Sheet에 담겨 있습니다.",
    action: "강조된 카드를 클릭해 이슈 상세를 여세요.",
    actionType: "click-card",
  },
  task: {
    situation: "이슈 상세가 열렸습니다.",
    why: "의심 통신 개요와 위협 내역을 확인할 차례입니다.",
    action: "내용 확인 후 하단 「맥락 답변하기」를 누르세요.",
    actionType: "click-reply",
    note: "이벤트명 클릭 → 상세 로그 팝업",
  },
  reply: {
    situation: "고객 답변이 입력되고 있습니다.",
    why: "업무 맥락이 분석팀 검증의 근거가 됩니다.",
    action: "입력이 끝나면 「답변 등록」을 누르세요.",
    actionType: "click-submit",
  },
  verifying: {
    situation: "이슈 상태가 「확인 중」으로 바뀌었습니다.",
    why: "분석팀이 탐지 데이터와 고객 답변을 함께 검토합니다.",
    action: "검증이 끝나면 분석팀 회신이 도착합니다.",
    actionType: "wait",
  },
  "staff-reply": {
    situation: "분석팀 회신이 도착했습니다.",
    why: "검증 결과가 댓글로 기록되었습니다.",
    action: "Sheet가 닫히고 칸반 「완료」로 이동합니다.",
    actionType: "wait",
  },
  complete: {
    situation: "이 사건이 완료 처리되었습니다.",
    why: "완료된 이슈는 칸반 「완료」 컬럼에서 이력으로 관리됩니다.",
    action: "다음 단계로 이어서 진행하세요.",
    actionType: "click-report",
  },
  report: {
    situation: "이번 달 검증 결과가 보고서에 반영되었습니다.",
    why: "처리한 이슈가 월간 침해 평가 보고서에 기록됩니다.",
    action: "오른쪽에서 방금 처리한 항목을 확인하세요.",
    actionType: "wait",
  },
};

const caseNarrativeOverrides: Record<SimCase, Partial<Record<SimPhase, SimulationNarrative>>> = {
  normal: {
    anomaly: {
      situation: "10.24.18.52 → 10.24.20.10 주기적 HTTP 통신이 강조되었습니다.",
      why: "평소와 다른 장기 세션 패턴이 검토 대기열에 올라왔습니다.",
      action: "곧 분석 파이프라인으로 이동합니다.",
      actionType: "wait",
    },
    task: {
      situation: "이슈 상세가 열렸습니다.",
      why: "의심 통신이 정상 업무인지 확인이 필요합니다.",
      action: "내용 확인 후 하단 「맥락 답변하기」를 누르세요.",
      actionType: "click-reply",
      note: "이벤트명 클릭 → 상세 로그 팝업",
    },
    reply: {
      situation: "업무 맥락 답변이 입력되고 있습니다.",
      why: "고객 설명이 정상 업무 통신 판단의 핵심 근거입니다.",
      action: "입력이 끝나면 「답변 등록」을 누르세요.",
      actionType: "click-submit",
    },
    verifying: {
      situation: "이슈 상태가 「확인 중」으로 바뀌었습니다.",
      why: "분석팀이 탐지 데이터와 고객 맥락을 대조합니다.",
      action: "정상 업무 통신 여부 판단이 진행됩니다.",
      actionType: "wait",
    },
    "staff-reply": {
      situation: "정상 업무 통신으로 검증되었습니다.",
      why: "분석팀 회신이 댓글에 기록되었습니다.",
      action: "곧 Sheet가 닫히고 「완료」로 이동합니다.",
      actionType: "wait",
    },
    complete: {
      situation: "사례 1 · 정상 검증이 끝났습니다.",
      why: "완료 이슈는 칸반 「완료」에서 이력으로 관리됩니다.",
      action: "「다음」으로 고객 조치 단계를 이어가세요.",
      actionType: "click-next-case",
    },
  },
  threat: {
    anomaly: {
      situation: "10.88.12.5에서 내부망 스캔 정황이 급증했습니다.",
      why: "측면이동 Stage에서 위협 의심 → 유효 위협 상향 정황입니다.",
      action: "곧 분석 파이프라인으로 이동합니다.",
      actionType: "wait",
    },
    analyst: {
      situation: "스캔 패턴이 유효 위협으로 확정되었습니다.",
      why: "업무 통신 후보에서 제외되고 고객 조치 요청이 필요합니다.",
      action: "분석 완료 후 이슈로 등록됩니다.",
      actionType: "wait",
    },
    kanban: {
      situation: "유효 위협 이슈가 확인 요청에 등록되었습니다.",
      why: "내부망 스캔 정황 분석이 끝났고, 고객 조치 확인이 필요합니다.",
      action: "강조된 카드를 클릭해 이슈 상세를 여세요.",
      actionType: "click-card",
    },
    task: {
      situation: "유효 위협 이슈 상세가 열렸습니다.",
      why: "고객 조치가 필요한 위협 통신 사례입니다.",
      action: "내용 확인 후 「조치 내용 답변하기」를 누르세요.",
      actionType: "click-reply",
    },
    reply: {
      situation: "고객 조치 내용이 입력되고 있습니다.",
      why: "조치 결과가 분석팀 재탐지 검증의 근거가 됩니다.",
      action: "입력이 끝나면 「답변 등록」을 누르세요.",
      actionType: "click-submit",
    },
    verifying: {
      situation: "이슈 상태가 「확인 중」으로 바뀌었습니다.",
      why: "분석팀이 고객 조치와 재탐지 여부를 검증합니다.",
      action: "검증이 끝나면 분석팀 회신이 도착합니다.",
      actionType: "wait",
    },
    "staff-reply": {
      situation: "고객 조치 검증이 완료되었습니다.",
      why: "재탐지 없음이 확인되어 분석팀 회신이 도착했습니다.",
      action: "곧 Sheet가 닫히고 「완료」로 이동합니다.",
      actionType: "wait",
    },
    complete: {
      situation: "사례 2 · 위협 통신 조치·검증이 끝났습니다.",
      why: "두 사례 모두 월간 보고서에 반영됩니다.",
      action: "「다음」으로 침해 평가 보고서를 확인하세요.",
      actionType: "click-report",
    },
  },
};

export function getSimulationNarrative(phase: SimPhase, activeCase: SimCase): SimulationNarrative {
  return caseNarrativeOverrides[activeCase][phase] ?? sharedNarrative[phase];
}

export function getCaseLabel(activeCase: SimCase): string {
  return activeCase === "normal" ? "사례 1 · 정상 검증" : "사례 2 · 위협 통신";
}

/** @deprecated getSimulationNarrative(activeCase) 사용 */
export const simulationNarrative = sharedNarrative;

export type SimEventDetail = {
  eventName: string;
  date: string;
  srcIp: string;
  dstIp: string;
  stage: string;
  checked: number;
  checkedLabel: string;
  variant: "agent" | "scan";
  connLogs: Array<Record<string, string | number>>;
  chartValues: number[];
  chartLabel: string;
};

export type CaseIncident = {
  code: string;
  title: string;
  srcIp: string;
  dstIp: string;
  dstLabel: string;
  detectedAt: string;
  eventType: string;
  riskBefore: string;
  riskAfter: string;
  staffQuestion: string;
  customerChecks: string[];
  presetReply: string;
  staffReply: string;
  reportSummary: string;
  reportVerdict: string;
  reportCause: string;
  reportOutcome: string;
  emailPreview: string;
  monitoringAlertText: string;
  initialEventCount: number;
  initialIssueCount: number;
  summary: string;
  content: string[];
  assignee: string;
  requestedAt: string;
  relatedThreatAt: string;
  threatDescription: string;
  eventDetail: SimEventDetail;
  actionNotes?: string;
};

/** 선별 단계 하위 화면 (이전/다음 · analystStep 0–3) — detail은 오른쪽 설명 문구 */
export const analystSteps = [
  {
    label: "전체 이벤트",
    title: "01 전체 이벤트",
    detail:
      "다양한 모델에서 여러 이벤트가 관측됩니다. 처음에는 전체 이벤트를 그대로 확인합니다.",
  },
  {
    label: "정상 활동 제외",
    title: "02 정상 활동 제외",
    detail:
      "기존에 정상으로 확인된 활동과 화이트리스트를 반영해 분석할 필요가 없는 이벤트를 제외합니다.",
  },
  {
    label: "분석가 우선 검토",
    title: "03 분석가 우선 검토",
    detail:
      "새롭게 나타난 연결과 반복되는 활동, 이전과 달라진 패턴을 찾아내 우선적으로 분석이 필요한 통신을 구분합니다.",
  },
  {
    label: "검증 대상 사례",
    title: "04 검증 대상 사례",
    detail: "선별된 두 활동은 왜 확인이 필요한지 근거와 함께 검증 대상으로 정리됩니다.",
  },
];

/** 선별 UI는 사례와 무관하게 동일 4단계 */
export const threatAnalystSteps = analystSteps;

export const monitoringLogs = [
  { time: "10:41:02", level: "info" as const, text: "conn · 10.88.12.5 → 203.0.113.44 :443 · 정상" },
  { time: "10:41:44", level: "info" as const, text: "dns · patch-mirror.internal · 응답 OK" },
  { time: "10:42:18", level: "info" as const, text: "http · 10.200.10.8 → CDN · 업무 범주" },
  { time: "10:43:05", level: "warn" as const, text: "long session · 10.200.10.15 · 검토 대기열" },
  { time: "10:55:12", level: "alert" as const, text: "agent comm · 10.24.18.52 → 10.24.20.10 :80", ip: "10.24.18.52" },
];

export const threatMonitoringLogs = [
  { time: "08:44:02", level: "info" as const, text: "conn · 10.200.10.8 → CDN · 업무 범주" },
  { time: "08:45:18", level: "warn" as const, text: "notice · 10.88.12.5 scan burst · 검토" },
  { time: "08:46:05", level: "warn" as const, text: "reject outlier · 10.88.12.5 → 10.200.0.0/16" },
  { time: "08:47:22", level: "warn" as const, text: "stage lateral · 위협 의심 상향" },
  { time: "08:48:31", level: "alert" as const, text: "conn dst reject outlier · 10.88.12.5", ip: "10.88.12.5" },
];

/** 사례 1 — 정상 가능성 의심 통신 (고객 맥락 → 분석팀 검증) */
export const incident: CaseIncident = {
  code: "DEMO-2026-05-003",
  title: "폐쇄망 IP (10.24.18.52) C2 의심 통신 식별 문의",
  srcIp: "10.24.18.52",
  dstIp: "10.24.20.10",
  dstLabel: "내부 패치 미러 서버",
  detectedAt: "2026-05-12 10:55",
  eventType: "에이전트 통신(패킷/바이트)",
  riskBefore: "낮음",
  riskAfter: "주의",
  staffQuestion:
    "폐쇄망 호스트에서 주기적 HTTP 기계적 통신이 확인되었습니다. 정기 배포·외부 연동 테스트 등 업무 통신인지 확인 부탁드립니다.",
  customerChecks: [
    "의심 통신 개요 — 주기적 HTTP 기계적 패턴",
    "관련 IP — 10.24.18.52 → 10.24.20.10 (내부 미러)",
    "발생 시간 — 2026-05-12 10:55 전후",
    "분석팀 질문 — 업무 통신 여부 확인",
  ],
  presetReply:
    "해당 서버는 최근 정기 배포 작업이 있었고, 외부 연동 테스트가 진행 중이었습니다.",
  staffReply:
    "맥락 확인 감사합니다. 정기 배포·연동 테스트 통신으로 판단하여 「정상 업무 통신」으로 완료 처리했습니다.",
  reportSummary: "업무 맥락 확인 후 정상 통신으로 분류·완료",
  reportVerdict: "정상 (업무 통신)",
  reportCause: "폐쇄망 호스트의 주기적 HTTP 기계적 연결",
  reportOutcome: "고객 맥락 확인 후 정상 업무 통신으로 분류, 완료",
  emailPreview: "폐쇄망 IP C2 의심 통신 — 업무 맥락 확인이 필요합니다.",
  monitoringAlertText: "이상 패턴 감지",
  initialEventCount: 1184,
  initialIssueCount: 2,
  summary: "폐쇄망 호스트에서 주기적 HTTP 기계적 통신이 탐지되었습니다. 업무 용도 확인이 필요합니다.",
  content: [
    "10.24.18.52 → 내부 미러(10.24.20.10) 간 HTTP 반복 연결이 확인됩니다.",
    "정기 패치 배포용 내부 미러 서버 통신인지 고객 확인을 요청드립니다.",
    "회신 주시면 분석팀이 맥락을 검증하고 완료 처리합니다.",
  ],
  assignee: "김분석",
  requestedAt: "2026-05-12 11:00",
  relatedThreatAt: "2026-05-12 10:55",
  threatDescription: "폐쇄망 호스트 C2 의심 통신",
  eventDetail: {
    eventName: "에이전트 통신(패킷/바이트)",
    date: "2026-05-12",
    srcIp: "10.24.18.52",
    dstIp: "10.24.20.10",
    stage: "3단계: 측면이동",
    checked: 2,
    checkedLabel: "위협 의심",
    variant: "agent",
    chartLabel: "bytesTimeline",
    chartValues: [4284, 4158, 4301, 4289, 4162, 4295],
    connLogs: [
      { datetime: "2026-05-12 10:00", src_ip: "10.24.18.52", dst_ip: "10.24.20.10", dst_port: 80, service: "http", duration: "1h02m", src_pkts: 42, src_bytes: 4284 },
      { datetime: "2026-05-12 11:00", src_ip: "10.24.18.52", dst_ip: "10.24.20.10", dst_port: 80, service: "http", duration: "1h01m", src_pkts: 41, src_bytes: 4158 },
      { datetime: "2026-05-12 12:00", src_ip: "10.24.18.52", dst_ip: "10.24.20.10", dst_port: 80, service: "http", duration: "1h03m", src_pkts: 42, src_bytes: 4301 },
    ],
  },
};

/** 사례 2 — 유효 위협 확정 · 내부 포트 스캔 (demo t5 · checked=5) */
export const threatIncident: CaseIncident = {
  code: "DEMO-2026-05-005",
  title: "10.88.12.5 지속적인 포트 스캐닝 정황 식별 문의",
  srcIp: "10.88.12.5",
  dstIp: "10.200.0.0/16",
  dstLabel: "내부망 다수 호스트",
  detectedAt: "2026-05-21 08:48",
  eventType: "목적지 연결 거절 이상",
  riskBefore: "낮음",
  riskAfter: "높음",
  staffQuestion:
    "10.88.12.5에서 내부망(10.200.0.0/16) 다수 포트로 연결 거절·스캔 패턴이 확인되었습니다. 분석팀은 해당 이벤트를 「유효 위협」으로 확정했습니다. 원인 확인 및 필요 조치를 회신해 주세요.",
  customerChecks: [
    "이벤트 상태 — 유효 위협 (checked=5)",
    "의심 통신 — 목적지 연결 거절 이상",
    "출발지 — 10.88.12.5 · 내부 /16 REJ 집중",
    "조치 요청 — 원인 확인·차단·삭제 등 조치 회신",
  ],
  presetReply:
    "점검 결과 비인가 스캔 도구가 설치되어 있었습니다. 도구 삭제·실행 차단 및 해당 호스트 격리 조치를 완료했습니다.",
  staffReply:
    "고객 조치(도구 삭제·격리)를 확인했습니다. 이후 48시간 재탐지 없음을 검증하여 완료 처리합니다. 유효 위협으로 침해 평가 보고서에 기록합니다.",
  reportSummary: "유효 위협 확정 — 고객 조치 후 재탐지 없음, 분석팀 검증 완료",
  reportVerdict: "유효 위협 (완료)",
  reportCause: "단일 내부 호스트의 내부망 다수 포트 스캔·연결 거절 정황",
  reportOutcome: "고객 조치 후 재탐지 없음 확인, 분석팀 검증 완료",
  emailPreview: "내부 포트 스캔 정황(유효 위협) — 조치 내용 회신이 필요합니다.",
  monitoringAlertText: "유효 위협 정황 감지",
  initialEventCount: 1218,
  initialIssueCount: 3,
  summary:
    "단일 호스트에서 내부망 다수 포트로 스캔 패턴이 탐지되었습니다. 분석팀이 유효 위협으로 확정했으며, 고객 조치가 필요합니다.",
  content: [
    "10.88.12.5 → 10.200.0.0/16 방향 conn dst reject outlier가 집중되었습니다.",
    "Notice·conn 집계 결과 배포·점검 스크립트가 아닌 비인가 스캔 가능성이 높습니다.",
    "분석팀은 이벤트를 유효 위협(checked=5)으로 확정했습니다. 조치 내용 회신을 요청드립니다.",
  ],
  assignee: "박분석",
  requestedAt: "2026-05-21 09:00",
  relatedThreatAt: "2026-05-21 08:48",
  threatDescription: "내부망 다수 포트 스캔 정황 · REJ/S0 집중",
  actionNotes: "고객 조치: 스캔 도구 삭제·격리. 분석팀: 48시간 재탐지 모니터링 후 완료.",
  eventDetail: {
    eventName: "목적지 연결 거절 이상",
    date: "2026-05-21",
    srcIp: "10.88.12.5",
    dstIp: "10.200.0.0/16",
    stage: "3단계: 측면이동",
    checked: 5,
    checkedLabel: "유효 위협",
    variant: "scan",
    chartLabel: "rejectTimeline",
    chartValues: [8, 22, 41, 52, 48, 36],
    connLogs: [
      { datetime: "2026-05-21 08:42", src_ip: "10.88.12.5", dst_ip: "10.200.10.1", dst_port: 22, proto: "tcp", conn_state: "REJ", count: 48 },
      { datetime: "2026-05-21 08:43", src_ip: "10.88.12.5", dst_ip: "10.200.10.2", dst_port: 445, proto: "tcp", conn_state: "REJ", count: 36 },
      { datetime: "2026-05-21 08:44", src_ip: "10.88.12.5", dst_ip: "10.200.10.15", dst_port: 3389, proto: "tcp", conn_state: "REJ", count: 29 },
      { datetime: "2026-05-21 08:45", src_ip: "10.88.12.5", dst_ip: "10.200.10.88", dst_port: 80, proto: "tcp", conn_state: "S0", count: 22 },
    ],
  },
};

export function getCaseIncident(activeCase: SimCase): CaseIncident {
  return activeCase === "normal" ? incident : threatIncident;
}

export function getCaseAnalystSteps(activeCase: SimCase) {
  return activeCase === "normal" ? analystSteps : threatAnalystSteps;
}

export function getCaseMonitoringLogs(activeCase: SimCase) {
  return activeCase === "normal" ? monitoringLogs : threatMonitoringLogs;
}

export const emailNotification = {
  from: "noreply@zerotica.app",
  subject: "[ZeroTica Watch] 확인 요청",
  time: "2026-05-12 11:05",
};

export const threatEmailNotification = {
  from: "noreply@zerotica.app",
  subject: "[ZeroTica Watch] 확인 요청",
  time: "2026-05-21 09:05",
};

export function getCaseEmail(activeCase: SimCase) {
  const base = activeCase === "normal" ? emailNotification : threatEmailNotification;
  const current = getCaseIncident(activeCase);
  return { ...base, preview: current.emailPreview };
}

export const reportMeta = {
  title: "ZeroTica Watch",
  period: "2026-05-01 ~ 2026-05-31",
  purpose: "네트워크 보안 취약점 식별 및 침해사고 대응 역량 평가",
  target: "데모 고객사 내부망 (10.0.0.0/8, 172.16.0.0/12)",
  personnel: "제로티카 분석팀 2명",
};
