/** 랜딩 미니 시뮬레이션 — 정상 검증 사례 + 위협 통신 사례 */

export const simulationIntro = {
  eyebrow: "직접 따라가 보기",
  title: "의심 통신 한 건을",
  titleAccent: "끝까지 처리해보세요",
  description:
    "Zerotica/RUNA가 이상 징후를 발견하고, 고객 업무 맥락을 확인한 뒤, 분석팀 검증과 조치 보고서까지 연결하는 과정을 짧게 체험합니다.",
  coreMessage:
    "Zerotica는 단순히 이상 통신을 탐지하는 서비스가 아니라, RUNA를 통해 고객의 업무 맥락을 확인하고, 분석팀이 이를 검증해 정상·위협 여부를 판단하며, 필요한 조치와 보고서까지 연결하는 서비스입니다.",
  startCta: "미니 시뮬레이션 시작하기",
};

export const storyChapters = [
  { id: "discover", label: "발견" },
  { id: "analyze", label: "분석" },
  { id: "deliver", label: "알림" },
  { id: "collaborate", label: "협업" },
  { id: "close", label: "완료" },
  { id: "report", label: "보고서" },
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

export function chapterForPhase(phase: SimPhase): number {
  if (phase === "monitoring" || phase === "anomaly") return 0;
  if (phase === "analyst") return 1;
  if (phase === "delivery" || phase === "kanban") return 2;
  if (phase === "task" || phase === "reply" || phase === "verifying" || phase === "staff-reply") return 3;
  if (phase === "complete") return 4;
  return 5;
}

export type NarrativeAction =
  | "wait"
  | "click-card"
  | "click-reply"
  | "click-submit"
  | "click-next-case"
  | "click-report";

export type SimulationNarrative = {
  title: string;
  body: string;
  action?: NarrativeAction;
};

const sharedNarrative: Record<SimPhase, SimulationNarrative> = {
  monitoring: {
    title: "오늘도 네트워크를 모니터링하고 있습니다",
    body: "이벤트 스트림·이슈 현황·이상 통신 후보를 매일 확인합니다. 대부분은 정상 범주에서 처리됩니다.",
    action: "wait",
  },
  anomaly: {
    title: "이상 징후가 감지되었습니다",
    body: "의심 통신 후보가 강조되었습니다. 이벤트 카운트와 위험도를 확인합니다.",
    action: "wait",
  },
  analyst: {
    title: "분석팀이 후보를 단계별로 검증합니다",
    body: "미러링 로그 수집부터 탐지·IOC·화이트리스트 정제까지 진행한 뒤, 고객 확인이 필요한 이슈로 등록합니다.",
    action: "wait",
  },
  delivery: {
    title: "분석이 끝났습니다 — RUNA와 메일로 동시에 전달됩니다",
    body: "선별된 업무 한 건이 이메일 알림과 RUNA 칸반 「업무 확인」 컬럼에 등록됩니다.",
    action: "wait",
  },
  kanban: {
    title: "확인이 필요한 업무가 도착했습니다",
    body: "「업무 확인」에 올라온 카드를 열어 Sheet에서 위협 내역·분석 본문을 확인하세요.",
    action: "click-card",
  },
  task: {
    title: "업무 Sheet에서 내용을 확인하세요",
    body: "의심 통신 개요와 위협 내역을 확인합니다. 이벤트명을 클릭하면 event detail에서 상세 로그를 볼 수 있습니다.",
    action: "click-reply",
  },
  reply: {
    title: "답변을 등록합니다",
    body: "고객이 확인·답변을 등록하면 분석팀이 검증합니다.",
    action: "click-submit",
  },
  verifying: {
    title: "분석팀이 검증 중입니다",
    body: "RUNA에서 「확인 중」 상태로 전환됩니다.",
    action: "wait",
  },
  "staff-reply": {
    title: "분석팀 검증이 완료되었습니다",
    body: "분석팀이 확인 결과를 회신했습니다. Sheet가 닫히고 완료 처리된 업무는 칸반 「업무 완료」로 이동합니다.",
    action: "wait",
  },
  complete: {
    title: "검증이 완료되었습니다",
    body: "완료 처리된 업무는 칸반보드 「업무 완료」 컬럼에서 이력으로 관리됩니다.",
    action: "click-report",
  },
  report: {
    title: "이번 달 검증 결과가 보고서에 남습니다",
    body: "정상으로 검증된 사례와 위험 통신·조치 사례가 함께 보고서에 기록됩니다.",
  },
};

const caseNarrativeOverrides: Record<SimCase, Partial<Record<SimPhase, SimulationNarrative>>> = {
  normal: {
    anomaly: {
      title: "잠깐, 이 통신 패턴이 평소와 다릅니다",
      body: "10.24.18.52 → 10.24.20.10 방향의 주기적 HTTP 통신이 강조되었습니다. 이벤트 카운트가 올라가고 위험도가 상승했습니다.",
      action: "wait",
    },
    reply: {
      title: "업무 맥락을 답변합니다",
      body: "고객은 업무 맥락 확인·답변을 합니다. 이후 정상 업무 통신 여부는 분석팀이 검증합니다.",
      action: "click-submit",
    },
    verifying: {
      title: "분석팀이 업무 맥락을 검증 중입니다",
      body: "탐지 데이터와 고객 답변을 함께 검토해 정상 업무 통신인지 판단합니다.",
      action: "wait",
    },
    "staff-reply": {
      title: "정상 업무 통신으로 검증되었습니다",
      body: "분석팀이 고객 맥락을 반영해 정상 업무 통신으로 판단했습니다. Sheet가 자동으로 닫히고 칸반 「업무 완료」로 이동합니다.",
      action: "wait",
    },
    complete: {
      title: "사례 1 · 정상 검증 완료",
      body: "완료 처리된 업무는 칸반보드 「업무 완료」 컬럼에서 관리됩니다. 이어서 실제 위험 통신 사례도 같은 흐름으로 체험해 보세요.",
      action: "click-next-case",
    },
  },
  threat: {
    anomaly: {
      title: "내부망 스캔 정황이 급증했습니다",
      body: "10.88.12.5에서 10.200.0.0/16 대역으로 연결 거절(REJ)이 집중되었습니다. 측면이동 Stage에서 위협 의심 → 유효 위협으로 상향될 정황입니다.",
      action: "wait",
    },
    analyst: {
      title: "분석팀이 유효 위협으로 확정합니다",
      body: "Notice·conn 집계로 스캔 패턴을 확인한 뒤, 업무 통신 후보에서 제외하고 「유효 위협」으로 확정합니다. 고객 확인·조치 요청 업무를 등록합니다.",
      action: "wait",
    },
    reply: {
      title: "조치 내용을 답변합니다",
      body: "분석팀이 유효 위협으로 확정한 사례입니다. 조치(도구 삭제·격리 등)는 고객이 수행하고, 분석팀은 조치 결과와 재탐지 여부를 검증합니다.",
      action: "click-submit",
    },
    verifying: {
      title: "분석팀이 고객 조치를 검증 중입니다",
      body: "고객이 수행한 조치가 올바른지, 재탐지가 없는지 확인합니다. 조치는 고객이, 검증·완료 처리는 분석팀이 담당합니다.",
      action: "wait",
    },
    "staff-reply": {
      title: "고객 조치 검증이 완료되었습니다",
      body: "유효 위협 이벤트에 대한 고객 조치·재탐지 없음을 확인했습니다. Sheet가 자동으로 닫히고 칸반 「업무 완료」로 이동합니다.",
      action: "wait",
    },
    complete: {
      title: "사례 2 · 위협 통신 조치·검증 완료",
      body: "완료 처리된 업무는 칸반보드 「업무 완료」 컬럼에서 관리됩니다. 두 사례 모두 월간 보고서에 반영됩니다.",
      action: "click-report",
    },
  },
};

export function getSimulationNarrative(phase: SimPhase, activeCase: SimCase): SimulationNarrative {
  return caseNarrativeOverrides[activeCase][phase] ?? sharedNarrative[phase];
}

export function getCaseLabel(activeCase: SimCase): string {
  return activeCase === "normal" ? "사례 1 · 정상 검증" : "사례 2 · 위험 통신";
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

export const analystSteps = [
  {
    label: "로그 수집",
    title: "네트워크 미러링 · 로그 수집",
    detail: "SPAN/TAP 미러링 → Zeek conn·HTTP 로그. 10.24.18.52 ↔ 10.24.20.10 패턴 확인.",
  },
  {
    label: "행동 탐지",
    title: "행위 기반 탐지",
    detail: "agent communication 규칙 매칭 — 주기적 HTTP 기계적 통신 후보 등록.",
  },
  {
    label: "IOC 점검",
    title: "악성 패턴 · IOC 점검",
    detail: "전 고객 IocIP 일일 매칭 — 해당 통신 IOC 미매칭.",
  },
  {
    label: "정제",
    title: "후보 정제 · 화이트리스트",
    detail: "알려진 업무 통신 후보 분리 — 고객 확인 필요로 판단.",
  },
  {
    label: "등록",
    title: "고객 확인 이슈로 등록",
    detail: "RUNA Task 생성 · 메일 알림 발송.",
  },
];

export const threatAnalystSteps = [
  {
    label: "로그 수집",
    title: "네트워크 미러링 · Notice·conn 집계",
    detail: "SPAN/TAP 미러링 → Zeek conn·notice. 10.88.12.5 → 10.200.0.0/16 REJ/S0 급증 확인.",
  },
  {
    label: "행동 탐지",
    title: "conn dst reject outlier 탐지",
    detail: "측면이동 Stage — 단일 호스트의 내부망 다수 포트 스캔 정황 등록.",
  },
  {
    label: "위협 확정",
    title: "유효 위협(checked=5)으로 확정",
    detail: "업무 스크립트·배포 자동화 후보 제외 — 분석팀이 「유효 위협」으로 분류.",
  },
  {
    label: "정제",
    title: "위협 내역 · ThreatHistory 연결",
    detail: "유효 위협 이벤트를 업무 Task에 연결 · 고객 조치 요청 준비.",
  },
  {
    label: "등록",
    title: "고객 확인 이슈로 등록",
    detail: "RUNA Task 생성 · 메일 알림 발송.",
  },
];

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
  title: "폐쇄망 IP (10.24.18.52) 기계적 통신 (80/tcp) 식별 문의",
  srcIp: "10.24.18.52",
  dstIp: "10.24.20.10",
  dstLabel: "내부 패치 미러 서버",
  detectedAt: "2026-05-12 10:55",
  eventType: "agent communication pkts bytes lateral",
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
    "확인 감사합니다. 정기 배포·연동 테스트 맥락을 반영해 「정상 업무 통신」으로 판단합니다. 해당 IP·시간대 화이트리스트 반영을 권고드립니다.",
  reportSummary: "업무 맥락 확인 후 정상 통신으로 분류 — 화이트리스트 반영 권고",
  reportVerdict: "정상 (업무 통신)",
  reportCause: "폐쇄망 호스트의 주기적 HTTP 기계적 연결",
  reportOutcome: "고객 맥락 확인 후 정상 업무 통신으로 분류, 화이트리스트 검토",
  emailPreview: "폐쇄망 IP 기계적 통신 — 업무 맥락 확인이 필요합니다.",
  monitoringAlertText: "이상 패턴 감지",
  initialEventCount: 1184,
  initialIssueCount: 2,
  summary: "폐쇄망 호스트에서 주기적 HTTP 기계적 통신이 탐지되었습니다. 업무 용도 확인이 필요합니다.",
  content: [
    "10.24.18.52 → 내부 미러(10.24.20.10) 간 HTTP 반복 연결이 확인됩니다.",
    "정기 패치 배포용 내부 미러 서버 통신인지 고객 확인을 요청드립니다.",
    "확인 후 화이트리스트 반영 여부를 함께 검토하겠습니다.",
  ],
  assignee: "김분석",
  requestedAt: "2026-05-12 11:00",
  relatedThreatAt: "2026-05-12 10:55",
  threatDescription: "폐쇄망 호스트 기계적 HTTP 통신 (80/tcp)",
  eventDetail: {
    eventName: "agent communication pkts bytes lateral",
    date: "2026-05-12",
    srcIp: "10.24.18.52",
    dstIp: "10.24.20.10",
    stage: "3단계: 측면이동",
    checked: 2,
    checkedLabel: "보류",
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
  eventType: "conn dst reject outlier lateral",
  riskBefore: "낮음",
  riskAfter: "높음",
  staffQuestion:
    "10.88.12.5에서 내부망(10.200.0.0/16) 다수 포트로 연결 거절·스캔 패턴이 확인되었습니다. 분석팀은 해당 이벤트를 「유효 위협」으로 확정했습니다. 원인 확인 및 필요 조치를 회신해 주세요.",
  customerChecks: [
    "이벤트 상태 — 유효 위협 (checked=5)",
    "의심 통신 — conn dst reject outlier lateral",
    "출발지 — 10.88.12.5 · 내부 /16 REJ 집중",
    "조치 요청 — 원인 확인·차단·삭제 등 조치 회신",
  ],
  presetReply:
    "점검 결과 비인가 스캔 도구가 설치되어 있었습니다. 도구 삭제·실행 차단 및 해당 호스트 격리 조치를 완료했습니다.",
  staffReply:
    "고객 조치(도구 삭제·격리)를 확인했습니다. 이후 48시간 재탐지 없음을 검증하여 완료 처리합니다. 유효 위협으로 침해 평가 보고서에 기록합니다.",
  reportSummary: "유효 위협 확정 — 고객 조치 후 재탐지 없음, 분석팀 검증 완료",
  reportVerdict: "유효 위협 (조치 완료)",
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
    eventName: "conn dst reject outlier lateral",
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
  subject: "[ZeroTica Watch] RUNA 업무 확인 요청",
  time: "2026-05-12 11:05",
};

export const threatEmailNotification = {
  from: "noreply@zerotica.app",
  subject: "[ZeroTica Watch] RUNA 업무 확인 요청",
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
