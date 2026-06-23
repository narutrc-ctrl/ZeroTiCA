export const site = {
  brandKo: "제로티카",
  brandEn: "ZeroTica",
  productPortal: "ZeroTica Watch",
  runaDefinition:
    "제로티카 고객 포털(RUNA) — 위협 탐지, 업무 협업, 침해 평가 보고를 웹에서 확인하는 서비스 화면입니다.",
  contactEmail: "contact@zerotica.app",
  contactPhone: "1588-0000",
  companyLegalName: "주식회사 나루시큐리티",
  companyAddress: "서울특별시 강남구 (상세 주소는 문의 시 안내)",
  siteUrl: "https://zerotica.app",
};

export const paths = {
  fullTour: "/demo/task?tour=full&step=0",
  contact: "/contact",
};

export const stats = {
  responseCases: 4000,
  responseCasesLabel: "4,000+",
  years: 15,
  yearsLabel: "15+",
  incidents2025: 2383,
  incidents2025Label: "2,383",
  smeShare: 83,
  smeShareLabel: "83%",
};

export const statSources = [
  { label: "2025년 침해사고", source: "KISA 개인정보 침해사고 통계·분석" },
  { label: "중소·중견 피해 비율", source: "동일 자료 기준 중소·중견기업 피해 비중" },
];

export const socialProof = [
  {
    quote: "알람만 쌓이던 시절과 달리, 확인해야 할 업무만 RUNA에 정리되어 옵니다.",
    role: "국내 게임사 · 보안팀장",
    industry: "Watch 고객",
  },
  {
    quote: "내부에서 몰랐던 통신이 Task로 올라오면서, 네트워크 가시성부터 확보됐습니다.",
    role: "제조·IT 인프라 담당",
    industry: "인사이트 → Watch",
  },
];

/** 함께하는 고객사 — 산업군 단일 표기 (익명) */
export const partnerIndustries = [
  { sector: "금융", detail: "금융 그룹" },
  { sector: "게임·엔터", detail: "국내 AAA 게임사" },
  { sector: "제조", detail: "제조 대기업" },
  { sector: "공공·교육", detail: "공공·교육기관" },
];

/** @deprecated partnerIndustries 사용 */
export const industryBadges = partnerIndustries.map((p) => p.sector);

/** @deprecated partnerIndustries 사용 */
export const clientLogos = partnerIndustries.map((p) => ({
  abbr: p.sector.charAt(0),
  label: p.detail,
}));

export const hero = {
  eyebrow: "Network Detection · Verification · Response",
  headline: "수많은 의심 통신,",
  headlineAccent: "진짜 위협만 골라낼 수 있습니까?",
  sub: "탐지는 시작일 뿐입니다. 검증·조치·기록까지 한 흐름으로 연결합니다.",
  runaLine: "RUNA가 의심 통신을 고객 업무 맥락과 연결해 검증 요청으로 전환합니다.",
  lead:
    "제로티카는 단순 탐지 서비스가 아닙니다. 의심 통신을 RUNA와 고객 상호작용으로 검증하고, 전문가 조치·보고서까지 이어지는 침입탐지 평가·조치 서비스입니다.",
  ctaFlow: { label: "서비스 흐름 보기", href: "#journey" },
  ctaReport: { label: "샘플 보고서 보기", href: "/demo/event?tab=reports" },
};

export const heroFlowSteps = ["탐지", "RUNA 확인", "고객 답변", "전문가 검증", "보고서"] as const;

export const heroDashboardPreview = {
  alertTitle: "RUNA 업무 알림",
  taskTitle: "의심 통신 확인 요청",
  internalIp: "10.24.18.52",
  externalIp: "203.0.113.44",
  risk: "주의",
  status: "고객 확인 대기",
  staffMessage:
    "폐쇄망 IP에서 기계적 통신 패턴이 감지되었습니다. 정기 배포·패치 미러 서버 등 업무 통신인지 확인 부탁드립니다.",
  replyCta: "업무 맥락 답변하기",
};

export const problemSection = {
  title: "보안 장비는 알림을 쏟아내지만,",
  titleAccent: "담당자는 매번 같은 질문을 반복합니다.",
  cards: [
    { q: "이 통신이 정상인가?" },
    { q: "지금 조치해야 하는 위협인가?" },
    { q: "보고서로 남길 만큼 중요한 사건인가?" },
  ],
};

export const runaSection = {
  stepEyebrow: "STEP 03",
  title: "RUNA는 단순 알림봇이 아닙니다",
  lead: "의심 통신의 맥락을 고객과 함께 확인하는 보안 어시스턴트입니다.",
  points: [
    "의심 통신 발생 시 고객에게 선별 알림",
    "고객과의 상호작용으로 업무 맥락 확인",
    "정상·위협 여부 검증 및 조치 안내",
    "전 과정이 보고서로 자동 정리",
  ],
};

export const runaConversation = [
  {
    role: "runa" as const,
    text: "외부 IP 185.xxx.xxx.xxx와 비정상 포트 통신이 확인되었습니다. 해당 서버에서 최근 해외 원격 접속 또는 신규 서비스 오픈이 있었나요?",
  },
  {
    role: "client" as const,
    text: "최근 신규 테스트 서버를 열었습니다.",
  },
  {
    role: "runa" as const,
    text: "확인했습니다. 해당 통신은 신규 서비스와 관련된 정상 가능성이 있으나, 동일 IP에서 반복 스캔 패턴이 확인되어 추가 검증이 필요합니다.",
  },
  {
    role: "staff" as const,
    text: "전문가 검증 결과, 테스트 서버 화이트리스트 반영 및 스캔 IP 모니터링을 권고합니다.",
  },
];

export type FlowVisualKey = "detect" | "notify" | "interact" | "verify" | "action" | "report";

export const serviceFlowSteps: {
  step: string;
  title: string;
  body: string;
  visual: FlowVisualKey;
}[] = [
  {
    step: "05",
    title: "의심 통신 발견",
    body: "수집·분석을 거친 뒤, 대시보드에 의심 이벤트가 올라옵니다. 비정상 통신, 스캔, C2 의심, 비인가 접근 징후를 Stage별로 구조화합니다.",
    visual: "detect",
  },
  {
    step: "06",
    title: "RUNA 알림",
    body: "고객에게 중요한 이벤트만 선별해 알립니다. 쏟아지는 로그가 아닌, 검토가 필요한 이슈만 전달합니다.",
    visual: "notify",
  },
  {
    step: "07",
    title: "고객 상호작용",
    body: "RUNA와 분석팀이 업무 맥락을 질문하고, 고객 답변을 바탕으로 사건을 구체화합니다.",
    visual: "interact",
  },
  {
    step: "08",
    title: "정상·위협 검증",
    body: "탐지 데이터, 고객 응답, 전문가 분석을 결합해 위험도를 판단합니다.",
    visual: "verify",
  },
  {
    step: "09",
    title: "조치 및 해결 지원",
    body: "차단, 예외 처리, 화이트리스트 반영, 추가 점검 등 필요한 조치를 안내합니다.",
    visual: "action",
  },
  {
    step: "10",
    title: "보고서 제공",
    body: "사건 흐름, 판단 근거, 조치 결과가 정리된 실속 있는 침해 평가 보고서를 제공합니다.",
    visual: "report",
  },
];

export const customerOutcomes = [
  {
    title: "알림에서 끝나지 않습니다",
    body: "의심 통신의 원인과 맥락까지 확인합니다.",
  },
  {
    title: "고객의 업무 상황을 반영합니다",
    body: "정상 운영 트래픽인지, 실제 위협인지 함께 구분합니다.",
  },
  {
    title: "보고서가 쓸모 있습니다",
    body: "단순 로그 목록이 아니라 판단 근거와 조치 결과가 정리됩니다.",
  },
  {
    title: "전 고객 IOC가 매일 적용됩니다",
    body: "다른 고객 사례에서 검증된 악성 IP·패턴을 IocIP로 축적하고, 매일 conn 로그와 일괄 매칭합니다.",
  },
];

export const trustBadges = [
  { value: stats.responseCasesLabel, numeric: stats.responseCases, suffix: "+", label: "침해사고 대응 경험" },
  { value: `${stats.yearsLabel}년`, numeric: stats.years, suffix: "+", label: "사이버보안 전문성" },
  { value: stats.incidents2025Label, numeric: stats.incidents2025, suffix: "", label: "2025년 침해사고(보고)" },
  { value: stats.smeShareLabel, numeric: stats.smeShare, suffix: "%", label: "중소·중견 피해 비율" },
];

/** 클로징 — 파트너 신뢰 수치 (함께하는 고객사 섹션과 분리) */
export const partnerTrustStats = trustBadges.slice(0, 2);

export const serviceDecision = {
  title: "어떤 서비스가 맞을까요?",
  lead: "단기 진단이 필요한지, 지속 운영을 맡길지에 따라 선택하시면 됩니다.",
  compare: [
    { label: "기간", insight: "수 주 집중", watch: "연간·월간 구독" },
    { label: "목적", insight: "현황 진단·우선순위", watch: "24/7 모니터링·대응" },
    { label: "산출물", insight: "진단 요약·권고", watch: "침해 평가 보고서" },
    { label: "적합 고객", insight: "보안 체계 수립 초기", watch: "전담 인력 부족·MDR 필요" },
  ],
};

export const services = [
  {
    id: "insight",
    name: "인사이트",
    tagline: "단기 집중 진단",
    description:
      "현재 네트워크와 보안 운영 상태를 집중적으로 점검하고, 우선 조치가 필요한 영역을 명확히 제시합니다.",
    bullets: ["단기간 위협·취약 영역 진단", "내부 자산·통신 가시성 확보", "경영진·실무진 공유용 요약 자료"],
  },
  {
    id: "watch",
    name: "와치",
    tagline: "지속 모니터링",
    description:
      "센서 기반 실시간 수집부터 탐지, 분석, 검증, 조치, 보고까지 보안 운영 전 과정을 대신 수행합니다.",
    bullets: ["24/7 위협 모니터링", "전문가 검증 기반 알림", "침해 평가 보고서 제공"],
  },
];

export const experienceSection = {
  title: "이제 직접 화면을 확인해 보십시오",
  lead:
    "앞서 설명드린 흐름을 RUNA 고객 화면에서 그대로 체험할 수 있습니다. 업무 Sheet, 대시보드, 보고서 뷰어까지 약 3분 가이드로 안내합니다.",
};

export const closing = {
  title: "믿고 맡길 수 있는 보안 운영 파트너",
  lines: ["보안은 더 똑똑하게, 운영은 더 간결하게.", "복잡한 보안의 반대말, 제로티카입니다."],
};

/** 앵커 네비게이션 */
export const storyAnchors = [
  { id: "top", label: "소개" },
  { id: "problem", label: "문제" },
  { id: "journey", label: "작업 순서" },
  { id: "outcomes", label: "고객 가치" },
  { id: "faq", label: "FAQ" },
  { id: "experience", label: "체험" },
];

export const tourPhases = [
  { label: "업무 관리", stepRange: [0, 2] as const },
  { label: "대시보드", stepRange: [3, 5] as const },
  { label: "침해 평가 보고서", stepRange: [6, 8] as const },
];
