export const site = {
  brandKo: "제로티카",
  brandEn: "ZeroTiCA",
  productPortal: "ZeroTica Watch",
  runaDefinition:
    "제로티카 고객 포털(RUNA) — 위협 탐지, 이슈 협업, 침해 평가 보고를 웹에서 확인하는 서비스 화면입니다.",
  footerTagline: "네트워크 데이터와 전문가 분석을 기반으로\n기업의 침해 여부를 평가합니다.",
  contactEmail: "zerotica@narusec.com",
  contactPhone: "02-522-7912",
  companyLegalName: "나루씨큐리티",
  companyCeo: "김혁준",
  companyAddress: "서울특별시 송파구 중대로 97, 6층 (가락동 효원빌딩) 05719",
  copyrightEntity: "NaruSecurity Inc.",
  siteUrl: "https://zerotica.narusec.com",
};

export const paths = {
  fullTour: "/demo/task?tour=full&step=0",
  contact: "/contact", // 북마크 호환 — 방문 시 모달을 연 뒤 소개 페이지로 이동
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

/**
 * TODO(ops): 공개 가능한 고객 인용문이 확정되면 Trust 섹션에 연결.
 * 검증되지 않은 후기는 사용하지 않음.
 */
export const socialProof: { quote: string; role: string; industry: string }[] = [];

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
  eyebrow: "보안은 검증이다.",
  headline: "안전하다는 확신의 근거",
  ctaVideo: {
    label: "서비스 영상보기",
    youtubeId: "EeKxCfILC58",
  },
  ctaFlow: { label: "침해평가 흐름보기", href: paths.fullTour },
  scrollHref: "#problem",
};

export const heroFlowSteps = ["탐지", "RUNA 확인", "고객 답변", "전문가 검증", "보고서"] as const;

export const heroDashboardPreview = {
  alertTitle: "RUNA 확인 요청",
  taskTitle: "의심 통신 확인 요청",
  internalIp: "10.24.18.52",
  externalIp: "203.0.113.44",
  risk: "주의",
  status: "고객 확인 대기",
  staffMessage:
    "폐쇄망 IP에서 기계적 통신 패턴이 감지되었습니다. 정기 배포·패치 미러 서버 등 업무 통신인지 확인 부탁드립니다.",
  replyCta: "업무 맥락 답변하기",
  caption: "RUNA가 의심 통신을 고객 업무 맥락과 연결해 확인 요청으로 전환합니다.",
};

export const problemSection = {
  title: "보안 장비는 알림을 쏟아내지만,",
  titleAccent: "담당자는 매번 같은 질문을 반복합니다.",
  cards: [
    { q: "이 통신이 정상인가?" },
    { q: "지금 조치해야 하는 위협인가?" },
    { q: "담당자에게 무엇을 확인해야 하나?" },
  ],
};

/** 섹션3 — WHAT'S DIFFERENT (섹션2 타이포·간격 체계 공유) */
export const whatsDifferentSection = {
  eyebrow: "ZeroTiCA의 검증 관점",
  titleBefore: "안전하다고 판단하려면,",
  titleAccent: "침해 가능성",
  titleAfter: "까지 확인해야 합니다.",
  lead: "ZeroTiCA는 실제 네트워크에서 관측된 활동을 바탕으로 침해 정황이 있는지 확인하고 현재 상태를 검증합니다.",
  cards: [
    {
      eyebrow: "예방 탐지로 확인해온 것",
      title: "어디가 취약하고",
      titleLine2: "어떤 위협이 발생했는가?",
      /** accent: true → text-zinc-700 (중간 강조) */
      points: [
        [
          { text: "공격에 노출될 수 있는 " },
          { text: "취약점이나 설정", accent: true },
          { text: "은 없는가" },
        ],
        [
          { text: "알려진" },
          { text: "공격 패턴이나 이상 신호", accent: true },
          { text: "가 탐지되었는가" },
        ],
        [
          { text: "위험을 줄이기 위해 " },
          { text: "무엇을 보완해야 하는가", accent: true }
          ,
        ],
      ],
      tone: "neutral" as const,
    },
    {
      eyebrow: "ZeroTiCA가 더 확인하는 것",
      title: "현재 내부에",
      titleLine2: "침해 정황이 존재하는가?",
      points: [
        [
          { text: "평소와 " },
          { text: "다른 자산과 통신의 변화", accent: true },
          { text: "는 없는가" },
        ],
        [
          { text: "정상적인 업무로 " },
          { text: "설명되지 않는 활동", accent: true },
          { text: "은 없는가" },
        ],
        [
          { text: "서로 다른 정황이 하나의 " },
          { text: "침해 흐름으로 이어지지는 않는가", accent: true },
        ],
      ],
      tone: "accent" as const,
    },
  ],
};

/** 키홀 확대 중·직후 브릿지 문구 (2단계) */
export const keyholeBridge = {
  line1: "그동안 보안은\n예방하고 탐지하며 기업을 지켜왔습니다.",
  line2: "지금 우리는,\n안전하다고 말할 수 있을까요?",
};

/** Hero 전환 후 섹션2 — 원 합류 시 노출 */
export const section2Gap = {
  eyebrow: "보안 운영에 남는 공백",
  title: "기업 내부에는 여전히,",
  titleLine2: "확인되지 않은 영역이 남아있습니다.",
  lead: "무엇이 있는지 · 무슨 의미인지 · 무엇을 해야 하는지.",
  cards: [
    {
      num: "01",
      title: "기업 내부에",
      titleLine2Accent: "무엇이 연결",
      titleLine2Rest: "되어 있는가?",
      body: "어떤 자산이 있고 어떤 통신이 오가는지 전체적으로 파악하기 어렵습니다.",
    },
    {
      num: "02",
      title: "이 활동은 정상인가,",
      titleLine2Accent: "확인이 필요",
      titleLine2Rest: "한 문제인가?",
      body: "개별 로그와 알림만으로는 정상 업무와 침해 정황을 구분하기 어렵습니다.",
    },
    {
      num: "03",
      title: "그래서 지금",
      titleLine2Accent: "무엇을 조치",
      titleLine2Rest: "해야 하는가?",
      body: "문제를 발견해도 확인 대상과 조치 우선순위를 판단하기 어렵습니다.",
    },
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

/** 고객 가치 — Before → ZeroTICA 변화 비교 */
export const customerValueSection = {
  eyebrow: "고객 가치",
  title: "답하기 어려웠던 질문도",
  titleAccent: "근거를 가지고 답변할 수 있습니다.",
  lead: "전문가가 자산과 통신, 활동의 맥락을 검증해 현재 상태를 이해하고 다음 행동을 결정할 수 있도록 합니다.",
  beforeLabel: "답하기 어려웠던 질문",
  afterLabel: "ZeroTiCA로 얻는 답변",
  closingBefore: "이렇게 쌓인 판단의 근거가",
  closingAccent: "안전에 대한 확신",
  closingAfter: "으로 이어집니다.",
  rows: [
    {
      num: "01",
      before: "무엇이 연결되어 있는가?",
      afterTitle: "현재 연결 상태를 파악할 수 있습니다.",
      afterBody:
        "관측 범위 안에서 자산과 연결 관계를 정리해 현재 내부 통신 현황을 보여줍니다.",
    },
    {
      num: "02",
      before: "이 활동은 정상인가?",
      afterTitle: "활동의 의미를 판단할 수 있습니다.",
      afterBody:
        "관련 흐름과 업무 맥락을 검토해 정상 업무인지, 추가 확인이나 조치가 필요한지 판단합니다.",
    },
    {
      num: "03",
      before: "무엇을 조치해야 하는가?",
      afterTitle: "조치 대상과 우선순위가 분명해집니다.",
      afterBody:
        "확인할 항목과 조치 방향을 제시하고 고객의 처리 상태와 결과를 함께 확인합니다.",
    },
  ],
};

/** @deprecated customerValueSection 사용 */
export const customerOutcomes = customerValueSection.rows.map((row) => ({
  title: row.afterTitle,
  body: row.afterBody,
}));

export const trustBadges = [
  { value: stats.responseCasesLabel, numeric: stats.responseCases, suffix: "+", label: "침해사고 대응 경험" },
  { value: `${stats.yearsLabel}년`, numeric: stats.years, suffix: "+", label: "사이버보안 전문성" },
  { value: stats.incidents2025Label, numeric: stats.incidents2025, suffix: "", label: "2025년 침해사고(보고)" },
  { value: stats.smeShareLabel, numeric: stats.smeShare, suffix: "%", label: "중소·중견 피해 비율" },
];

/** 클로징 — 파트너 신뢰 수치 (함께하는 고객사 섹션과 분리) */
export const partnerTrustStats = trustBadges.slice(0, 2);

export const serviceDecision = {
  title: "우리 기업에 필요한 검증은",
  titleLine2: "무엇일까요?",
};

export const services = [
  {
    id: "insight",
    name: "Insight",
    title: "현재 내부 상태를",
    titleLine2: "한번 정확히 점검해야 해요.",
    description: "최근 보안 상태가 우려되거나,\n현재 침해 정황과 우선 조치 과제를 확인해야 할 때",
    meta: [
      { label: "목적", value: "현재 상태를 먼저 확인" },
      { label: "운영 방식", value: "4~6주 집중 검증" },
    ],
  },
  {
    id: "watch",
    name: "Watch",
    title: "새로운 변화와 이슈를",
    titleLine2: "지속적으로 확인해야 해요.",
    description: "자산과 통신이 계속 변하고 있어,\n새로운 정황을 상시 확인하고 대응해야 할 때",
    meta: [
      { label: "목적", value: "내부 변화를 계속 확인" },
      { label: "운영 방식", value: "구독형 지속 검증" },
    ],
  },
];

export const experienceSection = {
  eyebrow: "서비스 화면 데모",
  title: "설명은 여기까지,",
  titleLine2: "이제 직접 확인해보세요.",
  lead: "대시보드부터 이슈 확인, 분석가와의 소통, 보고서까지 실제 고객 화면과 유사한 데모에서 직접 둘러보세요.",
  mock: {
    label: "고객에게 전달되는 이슈 화면 예시",
    title: "비인가 원격 접근 정황 확인 요청",
    badge: "고객 확인 요청",
  },
  listEyebrow: "하나의 이슈가 답하는 질문",
  listHint: "항목을 선택하거나 올려두면 왼쪽 화면에서 대응 영역을 확인할 수 있습니다.",
  points: [
    {
      num: "01",
      title: "무엇이 발생했는가",
      body: "발생 시점과 관련 자산, 관측된 활동을 정리합니다.",
    },
    {
      num: "02",
      title: "평소와 무엇이 달랐는가",
      body: "평소와 비교해 달라진 통신과 활동을 보여줍니다.",
    },
    {
      num: "03",
      title: "왜 확인이 필요한가",
      body: "분석가의 판단과 근거를 바탕으로 확인이 필요한 이유를 설명합니다.",
    },
    {
      num: "04",
      title: "무엇을 확인하고 조치해야 하는가",
      body: "업무 맥락과 자산 사용 여부를 확인하고 필요한 조치 방향을 제시합니다.",
    },
    {
      num: "05",
      title: "어떻게 처리되었는가",
      body: "분석가와 고객의 대화, 처리 상태와 최종 결과를 남깁니다.",
    },
  ],
  footerNote:
    "대시보드, 이슈 관리, 보고서 화면까지 직접 둘러볼 수 있습니다.",
  ctaLabel: "서비스 데모 체험하기",
};

export const closing = {
  title: "믿고 맡길 수 있는 보안 운영 파트너",
  lines: ["보안은 더 똑똑하게, 운영은 더 간결하게.", "복잡한 보안의 반대말, 제로티카입니다."],
};

/** 앵커 네비게이션 — 랜딩 섹션 순서와 동일하게 유지 */
export const storyAnchors = [
  { id: "top", label: "소개" },
  { id: "problem", label: "문제" },
  { id: "journey", label: "검증 과정" },
  { id: "outcomes", label: "고객 가치" },
  { id: "experience", label: "체험" },
  { id: "choose", label: "서비스 선택" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "문의" },
];

export const tourPhases = [
  { label: "이슈 관리", stepRange: [0, 2] as const },
  { label: "대시보드", stepRange: [3, 5] as const },
  { label: "침해 평가 보고서", stepRange: [6, 8] as const },
];
