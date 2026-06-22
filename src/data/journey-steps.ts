/** 통합 여정 — 단일 스크롤 소스 (분석팀 vs 고객 역할 구분) */

export type JourneyActor = "engine" | "analyst" | "customer" | "both";

export type JourneyPhase = "collect" | "analyze" | "collaborate" | "close";

export type JourneyVisualId =
  | "sensor"
  | "event-detail-agent"
  | "long-session"
  | "ioc-batch"
  | "task-whitelist"
  | "event-dashboard"
  | "notify"
  | "interact"
  | "verify"
  | "action"
  | "report";

export type JourneyStep = {
  step: string;
  phase: JourneyPhase;
  actor: JourneyActor;
  actorLabel: string;
  title: string;
  body: string;
  detail?: string;
  visual: JourneyVisualId;
};

export const journeyPhaseMeta: Record<
  JourneyPhase,
  { label: string; desc: string; tone: string }
> = {
  collect: {
    label: "수집",
    desc: "미러링된 트래픽을 로그로 만드는 단계",
    tone: "from-slate-50 to-white",
  },
  analyze: {
    label: "분석",
    desc: "분석 엔진·분석팀이 후보를 고르는 단계",
    tone: "from-slate-900 to-slate-950",
  },
  collaborate: {
    label: "협업",
    desc: "RUNA로 고객과 맥락을 맞추는 단계",
    tone: "from-blue-50/80 to-white",
  },
  close: {
    label: "마무리",
    desc: "조치·기록을 남기는 단계",
    tone: "from-slate-100 to-slate-50",
  },
};

export const actorBadgeStyle: Record<JourneyActor, string> = {
  engine: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
  analyst: "bg-blue-500/15 text-blue-200 border-blue-500/30",
  customer: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  both: "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

export const actorBadgeStyleLight: Record<JourneyActor, string> = {
  engine: "bg-cyan-50 text-cyan-800 border-cyan-200",
  analyst: "bg-blue-50 text-blue-800 border-blue-200",
  customer: "bg-emerald-50 text-emerald-800 border-emerald-200",
  both: "bg-violet-50 text-violet-800 border-violet-200",
};

/** 히어로·개요용 짧은 라벨 — unifiedJourneySteps 8단계와 1:1 */
export const journeyStepShortLabel: Record<string, string> = {
  "01": "미러링·수집",
  "02": "행동 기반 탐지",
  "03": "IOC 일괄 점검",
  "04": "화이트리스트",
  "05": "RUNA 알림",
  "06": "고객 맥락 답변",
  "07": "검증·조치",
  "08": "침해 평가 보고",
};

export const unifiedJourneySteps: JourneyStep[] = [
  {
    step: "01",
    phase: "collect",
    actor: "engine",
    actorLabel: "제로티카 · 센서",
    title: "네트워크 미러링 · 로그 수집",
    body:
      "고객망 스위치·라우터 SPAN/TAP으로 복제된 트래픽을 Zeek 센서가 패시브로 관측합니다. conn·HTTP·DNS·SSL 등 로그가 RUNA 서버로 전달됩니다.",
    detail: "대시보드 「데이터 수집 상태」에서 센서별 conn 수집 여부를 확인합니다.",
    visual: "sensor",
  },
  {
    step: "02",
    phase: "analyze",
    actor: "engine",
    actorLabel: "분석 엔진",
    title: "행동 기반 탐지",
    body:
      "30개 이상의 탐지 스크립트가 Zeek 로그를 매일 돌립니다. conn의 src_local·dst_local로 아웃바운드·인바운드·측면이동을 나눈 뒤, 같은 유형의 규칙도 방향마다 따로 실행해 빠뜨리지 않습니다. 기계적 통신·장기 세션·프로토콜 이상·웹 위협 등을 시간 패턴으로 봅니다.",
    detail:
      "분석팀은 RUNA 이벤트 상세(networkMap, bytesTimeline, conn 로그 테이블)에서 방향·근거를 확인합니다.",
    visual: "event-detail-agent",
  },
  {
    step: "03",
    phase: "analyze",
    actor: "engine",
    actorLabel: "분석 엔진 · IOC",
    title: "악성 패턴 · IOC 일괄 점검",
    body:
      "다른 고객 사례에서 검증·축적된 악성 IP·패턴(IocIP)을 매일 conn 로그와 일괄 매칭합니다. 한 고객에서 확인된 IOC가 전체 고객망에 바로 적용됩니다.",
    detail: "ioc connection 이벤트로 src/dst 매칭·태그·연결 횟수를 집계합니다.",
    visual: "ioc-batch",
  },
  {
    step: "04",
    phase: "analyze",
    actor: "analyst",
    actorLabel: "분석팀",
    title: "후보 정제 · 화이트리스트",
    body:
      "자동 탐지 후보 중 알려진 업무 통신은 IP·도메인·그룹 단위로 화이트리스트에 반영합니다. 분석팀이 검토해 RUNA로 넘길 이슈만 남깁니다.",
    detail: "고객은 이 단계에서 직접 조작하지 않습니다. 결과는 이후 알림으로 전달됩니다.",
    visual: "task-whitelist",
  },
  {
    step: "05",
    phase: "collaborate",
    actor: "both",
    actorLabel: "분석팀 → 고객",
    title: "RUNA 알림 · 업무 확인 요청",
    body:
      "검토가 필요한 이슈만 RUNA 업무로 등록됩니다. 쏟아지는 로그가 아니라, 분석팀이 선별한 확인 요청이 고객에게 도착합니다.",
    detail: "고객 화면: 업무관리 칸반 · 알림. 분석팀: 위협 내역·근거 데이터 첨부.",
    visual: "notify",
  },
  {
    step: "06",
    phase: "collaborate",
    actor: "customer",
    actorLabel: "고객",
    title: "업무 맥락 답변",
    body:
      "「정기 배포 통신인가요?」「해당 서버 용도는?」— RUNA 업무 Sheet와 댓글로 업무 맥락을 답합니다. 분석팀은 이 답변을 검증 근거에 포함합니다.",
    detail: "고객이 하는 일: 맥락 확인·답변. 분석팀이 하는 일: 질문 정리·추가 확인.",
    visual: "interact",
  },
  {
    step: "07",
    phase: "collaborate",
    actor: "analyst",
    actorLabel: "분석팀",
    title: "전문가 검증 · 조치 안내",
    body:
      "탐지 데이터 + 고객 답변 + IOC·행동 분석을 결합해 정상·주의·위협을 판단합니다. 차단·화이트리스트·추가 모니터링 등 조치를 안내합니다.",
    detail: "고객은 조치 권고를 확인·실행. 분석팀은 재탐지 모니터링과 업무 상태를 관리합니다.",
    visual: "verify",
  },
  {
    step: "08",
    phase: "close",
    actor: "both",
    actorLabel: "고객 · 분석팀",
    title: "침해 평가 보고 · 기록",
    body:
      "사건 흐름·판단 근거·조치 결과가 침해 평가 보고서로 정리됩니다. 감사·경영 보고·사후 재발 방지에 쓸 수 있는 기록이 남습니다.",
    visual: "report",
  },
];

export const journeyFlowPills = unifiedJourneySteps.map((s) => ({
  step: s.step,
  label: journeyStepShortLabel[s.step] ?? s.title,
}));

/** 랜딩 3막 요약 — 8단계를 압축한 스크롤리텔링 */
export type JourneyAct = {
  id: string;
  act: number;
  title: string;
  subtitle: string;
  stepRange: string[];
  summary: string;
  customerNote: string;
  highlights: string[];
  visual: JourneyVisualId;
  stepIndices: number[];
};

export const journeyActs: JourneyAct[] = [
  {
    id: "collect-analyze",
    act: 1,
    title: "수집 · 탐지 · 정제",
    subtitle: "STEP 01–04",
    stepRange: ["01", "02", "03", "04"],
    stepIndices: [0, 1, 2, 3],
    summary:
      "미러링으로 트래픽을 수집하고, 행동 기반 탐지·IOC 일괄 점검으로 후보를 고릅니다. 분석팀이 화이트리스트로 업무 통신을 정리해, 고객에게 넘길 이슈만 남깁니다.",
    customerNote: "고객님이 하시는 일: 없음 — 백그라운드에서 전문가·엔진이 처리합니다.",
    highlights: ["패시브 미러링 수집", "방향별 행동 탐지", "전 고객 IOC 매칭", "화이트리스트 정제"],
    visual: "sensor",
  },
  {
    id: "collaborate",
    act: 2,
    title: "RUNA 협업 · 맥락 확인",
    subtitle: "STEP 05–06",
    stepRange: ["05", "06"],
    stepIndices: [4, 5],
    summary:
      "선별된 이슈만 RUNA 업무로 등록됩니다. 분석팀이 확인을 요청하면, 고객은 업무 Sheet·댓글로 「정기 배포 통신입니다」처럼 맥락을 답합니다.",
    customerNote: "고객님이 하시는 일: RUNA 알림 확인 → 업무 댓글로 맥락 답변.",
    highlights: ["선별 알림 (로그 폭탄 없음)", "업무 Sheet·칸반", "분석팀 ↔ 고객 댓글", "맥락이 검증 근거로 반영"],
    visual: "interact",
  },
  {
    id: "verify-report",
    act: 3,
    title: "검증 · 조치 · 보고",
    subtitle: "STEP 07–08",
    stepRange: ["07", "08"],
    stepIndices: [6, 7],
    summary:
      "탐지 데이터 + 고객 답변 + 전문가 분석으로 정상·위협을 판단하고 조치를 안내합니다. 전 과정이 침해 평가 보고서로 남습니다.",
    customerNote: "고객님이 하시는 일: 조치 권고 확인·실행 → 보고서로 기록 확인.",
    highlights: ["전문가 검증", "차단·화이트리스트 권고", "재탐지 추적", "침해 평가 보고서"],
    visual: "report",
  },
];

export function journeyActAnchorId(act: JourneyAct) {
  return `journey-act-${act.id}`;
}

export function journeyStepAnchorId(step: string) {
  return `journey-step-${step}`;
}

export function formatActLabel(act: JourneyAct) {
  const from = act.stepRange[0];
  const to = act.stepRange[act.stepRange.length - 1];
  return `${act.act}막 (STEP ${from}–${to})`;
}
