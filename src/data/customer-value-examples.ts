/** 실제 RUNA 업무(Task) 패턴 기반 — 고객사명·IP·호스트명 익명화 */

export type CaseCategory = "unknown" | "cleanup" | "forbidden";

export type TaskCaseStudy = {
  id: string;
  category: CaseCategory;
  taskTitle: string;
  eventType: string;
  direction: "아웃바운드" | "인바운드" | "측면이동";
  summary: string;
  findings: string[];
  staffAsk: string;
  customerReply?: string;
  resolution: string;
  customerGain: string;
};

export const communicationCategories: {
  id: CaseCategory;
  title: string;
  lead: string;
}[] = [
  {
    id: "unknown",
    title: "알지 못했던 통신",
    lead:
      "방화벽·EDR 로그만으로는 보이지 않던 내부↔외부·내부↔내부 통신을 Zeek 미러링으로 먼저 잡고, RUNA 업무로 「이게 뭔지」 확인합니다.",
  },
  {
    id: "cleanup",
    title: "정리가 필요한 통신",
    lead:
      "업무상 필요하지만 등록·정책이 없던 통신은 화이트리스트·그룹·업무 메모로 정리해, 다음부터 같은 알람이 반복되지 않게 합니다.",
  },
  {
    id: "forbidden",
    title: "있으면 안 되는 통신",
    lead:
      "비인가 원격제어·웹쉘·IOC·악성코드·과도한 스캔 등은 근거 데이터와 함께 조치까지 연결하고, 재탐지 여부를 추적합니다.",
  },
];

/** 프로덕션 Task DB 패턴 기반 (익명화) */
export const taskCaseStudies: TaskCaseStudy[] = [
  {
    id: "unknown-mechanical",
    category: "unknown",
    taskTitle: "폐쇄망 IP (10.24.18.52) 기계적 통신 (80/tcp) 식별 문의",
    eventType: "agent communication pkts bytes lateral",
    direction: "측면이동",
    summary:
      "폐쇄망 서버에서 주기적으로 같은 내부 미러로 HTTP가 반복됩니다. 담당자가 모르고 있던 패치·배포 채널이었습니다.",
    findings: [
      "10.24.18.52 → 10.24.20.10, 80/tcp, 시간대별 패킷·바이트 변동이 균일",
      "에이전트 통신(패킷/바이트) 이벤트로 후보 등록",
      "networkMap·bytesTimeline에서 기계적 패턴 확인",
    ],
    staffAsk:
      "폐쇄망 호스트에서 내부 미러로 HTTP 반복 연결이 있습니다. 정기 패치·배포 통신인지 확인 부탁드립니다.",
    customerReply: "정기 패치 배포용 내부 미러 서버 통신입니다. 화이트리스트 등록 검토 부탁드립니다.",
    resolution: "업무 통신 확인 → IP·이벤트 유형별 화이트리스트 반영 → 재탐지 모니터링",
    customerGain: "「몰랐던 폐쇄망 배포 채널」이 문서화되고, 이후 같은 알람은 자동 정제됩니다.",
  },
  {
    id: "unknown-ipwhois",
    category: "unknown",
    taskTitle: "내부 IP ipwho.is 대상 지속 DNS 질의 문의",
    eventType: "dns fail outlier outbound",
    direction: "아웃바운드",
    summary:
      "특정 워크스테이션에서 외부 IP 조회 서비스로 지속 질의가 발생했으나, 보안팀·현업 모두 인지하지 못했습니다.",
    findings: [
      "10.160.4.49 → 104.20.44.133 등, ipwho.is 도메인 반복",
      "설치된 상용 S/W의 라이선스·지역 확인 루틴으로 확인",
    ],
    staffAsk: "내부 PC에서 ipwho.is로 지속 DNS 질의가 있습니다. 설치·사용 중인 프로그램이 있는지 확인 부탁드립니다.",
    customerReply: "특정 업무 S/W에서 발생하는 정상 통신으로 확인했습니다.",
    resolution: "정상 S/W 통신 확인 → 필요 시 도메인 화이트리스트·업무 메모 등록",
    customerGain: "보이지 않던 SaaS·에이전트 통신을 인벤토리에 남길 수 있습니다.",
  },
  {
    id: "cleanup-proxyware",
    category: "cleanup",
    taskTitle: "프록시웨어 관련 도메인 접근 문의",
    eventType: "dns fail outlier outbound",
    direction: "아웃바운드",
    summary:
      "프록시 성격 도메인 DNS 질의가 반복되었습니다. 승인되지 않은 클라이언트 S/W가 원인이었고 삭제·정리했습니다.",
    findings: [
      "특정 워크스테이션에서 프록시 관련 도메인 반복 질의",
      "내부 확인 결과 비인가 S/W 설치",
    ],
    staffAsk: "프록시 성격 도메인 접근이 반복됩니다. 업무상 사용 중인지, 설치된 프로그램 확인 부탁드립니다.",
    customerReply: "비인가 S/W에서 발생한 것으로 확인되어 삭제 조치했습니다.",
    resolution: "비인가 S/W 제거 → 재탐지 없음 확인 → 업무 완료",
    customerGain: "「정리가 필요한 그림자 IT 통신」을 찾아 제거하고, 재발 여부를 추적합니다.",
  },
  {
    id: "cleanup-rcs",
    category: "cleanup",
    taskTitle: "폐쇄망 대역 원격제어(RCS) 릴레이 서버 접근 식별 문의",
    eventType: "remote control software outbound",
    direction: "아웃바운드",
    summary:
      "TeamViewer·AnyDesk 등 원격제어 DNS 패턴이 여러 내부 PC에서 탐지되었습니다. 승인된 업무용과 미등록 사용을 구분했습니다.",
    findings: [
      "RemoteAccess 테이블 도메인과 DNS·conn 조인으로 RCS 탐지",
      "호스트별: 업무상 일시 사용(삭제 완료) / 정상 등록 업무 / 추가 확인 필요",
    ],
    staffAsk:
      "원격제어 소프트웨어 접속 흔적이 있습니다. IT 지원·외주용으로 승인된 사용인지, 설치·삭제 여부를 알려주세요.",
    customerReply: "일부는 긴급 지원용이었고 삭제 완료, 일부는 등록된 업무 PC입니다.",
    resolution: "미승인 건 삭제 확인 → 승인 건은 화이트리스트·정책 문서화",
    customerGain: "원격제어·VPN·Parsec 등 「등록 vs 미등록」을 한곳에서 관리할 수 있습니다.",
  },
  {
    id: "cleanup-vpn",
    category: "cleanup",
    taskTitle: "내부 IP Proton VPN 대상 대용량 데이터 이동 문의",
    eventType: "data leakage outbound",
    direction: "아웃바운드",
    summary:
      "개인 VPN으로 대용량 전송이 탐지되었으나, 당시 타사 게임 테스트 목적이었습니다. 종료 후 삭제 조치했습니다.",
    findings: [
      "10.160.2.213 → 79.110.55.2 (VPN), 장기·대용량 아웃바운드",
      "장기 세션·데이터 이동 이벤트로 후보 등록",
    ],
    staffAsk: "내부 PC에서 VPN 서비스로 대용량 전송이 있습니다. 업무 목적·승인 여부 확인 부탁드립니다.",
    customerReply: "타사 게임 테스트용 WireGuard/VPN이었으며, 현재 삭제했습니다.",
    resolution: "목적 확인 → VPN 클라이언트 삭제 → 재탐지 모니터링",
    customerGain: "개인 VPN·우회 통신도 업무 맥락과 함께 기록해 감사·정책 대응에 씁니다.",
  },
  {
    id: "forbidden-proxy-residual",
    category: "forbidden",
    taskTitle: "프록시웨어 잔류 통신 문의",
    eventType: "long session outbound",
    direction: "아웃바운드",
    summary:
      "종료되지 않은 프록시 프로세스가 외부로 장기 세션을 유지하고 있었습니다. 고객 조치 후 재탐지 없음.",
    findings: [
      "내부 호스트 → 외부 IP 장시간 세션",
      "Kerberos·프로세스 정보와 함께 RUNA 업무에 근거 첨부",
    ],
    staffAsk: "프록시웨어 잔류 통신이 확인됩니다. 해당 서버 운영 여부·프로세스 종료 부탁드립니다.",
    customerReply: "레거시 에이전트 잔여 프로세스였습니다. 서비스 중지 및 삭제 완료.",
    resolution: "프로세스 삭제 → 48시간 재탐지 없음 → 업무 완료·보고서 반영",
    customerGain: "「있으면 안 되는 잔류 통신」을 조기에 끊고, 조치 결과가 보고서에 남습니다.",
  },
  {
    id: "forbidden-webshell",
    category: "forbidden",
    taskTitle: "웹쉘 의심 통신 문의",
    eventType: "webshell inbound",
    direction: "인바운드",
    summary:
      "외부 IP에서 내부 웹서버로 웹쉘 패턴 HTTP 요청이 탐지되었습니다. 인바운드 관점에서 URI·응답을 분석했습니다.",
    findings: [
      "194.233.100.x → 220.73.173.x, 짧은 시간 burst",
      "http_find_webshell 규칙 · URI·응답 코드 집계",
    ],
    staffAsk: "외부에서 웹쉘 의심 요청이 들어왔습니다. 해당 서버·경로 점검과 조치 부탁드립니다.",
    customerReply: "웹 경로 점검 및 악성 파일 제거 조치 진행.",
    resolution: "웹쉘 제거·패치 → IOC·재스캔 모니터링",
    customerGain: "인바운드 웹 공격을 방화벽 알람과 별도로, URI 수준까지 추적합니다.",
  },
  {
    id: "forbidden-ioc-phishing",
    category: "forbidden",
    taskTitle: "피싱 AI 에이전트 설치 페이지(IoC) 접근",
    eventType: "ioc connection outbound",
    direction: "아웃바운드",
    summary:
      "전 고객 IocIP에 등록된 피싱·악성 URL에 내부 PC가 접근했습니다. 다른 고객 사례에서 검증된 IOC가 즉시 적용되었습니다.",
    findings: [
      "다수 워크스테이션 → IoC URL, ioc connection 이벤트",
      "태그·연결 횟수·포트 목록이 RUNA 테이블에 표시",
    ],
    staffAsk: "알려진 피싱·악성 설치 페이지 IoC 접근이 있습니다. 해당 PC 격리·점검 부탁드립니다.",
    customerReply: "엔드포인트 보안에서 조치 완료.",
    resolution: "IOC 매칭 → 고객 조치 확인 → 전 테넌트 재탐지 추적",
    customerGain: "한 고객에서 검증된 악성 URL·IP가 다음 날 전 고객망에 일괄 적용됩니다.",
  },
  {
    id: "forbidden-malware-ua",
    category: "forbidden",
    taskTitle: "User-Agent 기반 악성 의심 통신 문의",
    eventType: "useragent threat outbound",
    direction: "아웃바운드",
    summary:
      "스캐너·악성 도구 UA로 외부 접속이 탐지되었고, 이후 해당 디바이스 악성코드 감염이 확인되었습니다.",
    findings: [
      "10.99.2.77 → 외부 IP, sqlmap·scanner 류 UA 패턴",
      "http_user_agent_check 규칙 매칭",
    ],
    staffAsk: "공격 도구로 의심되는 User-Agent 통신이 있습니다. 해당 PC 점검 부탁드립니다.",
    customerReply: "악성코드 감염 확인, 보안 조치 완료.",
    resolution: "감염 확인 → 제거·재이미징 → 재탐지 모니터링",
    customerGain: "시그니처 없이도 UA·행동 패턴으로 초기 침해 징후를 잡을 수 있습니다.",
  },
  {
    id: "forbidden-scan",
    category: "forbidden",
    taskTitle: "내부 IP 지속적인 포트 스캐닝 정황 식별 문의",
    eventType: "conn dst reject outlier lateral",
    direction: "측면이동",
    summary:
      "단일 내부 호스트가 내부망 다수 포트로 연결 거절·스캔 패턴을 보였습니다. 자동화 도구·감염 여부를 검증했습니다.",
    findings: [
      "172.16.111.5 → 내부망 22/tcp 등 다수 REJ/S0",
      "Notice·conn 집계로 스캔 정황 확인",
    ],
    staffAsk: "내부 호스트에서 다수 포트 스캔 정황이 있습니다. 배포·점검 스크립트인지 확인 부탁드립니다.",
    customerReply: "점검 중 확인 — 모니터링 에이전트 오설정으로 판단, 설정 수정.",
    resolution: "원인 확인·설정 수정 → 재탐지 추적",
    customerGain: "측면이동·내부 스캔을 아웃바운드만 보는 장비와 별도로 집계합니다.",
  },
  {
    id: "forbidden-ssh-flood",
    category: "forbidden",
    taskTitle: "다수 내부 IP 대상 SSH 연결 시도",
    eventType: "ssh auth outlier lateral",
    direction: "측면이동",
    summary:
      "단일 출발지에서 내부 /24 대역으로 SSH 시도가 급증했습니다. Ansible·배포 자동화와 악성 스캔을 구분했습니다.",
    findings: [
      "172.16.111.172 → 172.16.128.0/24, 22/tcp 집중",
      "인증 실패·연결 거절 이상 이벤트",
    ],
    staffAsk: "내부 IP에서 SSH 연결이 단시간에 급증했습니다. 배포·점검 스크립트 사용 여부 알려주세요.",
    customerReply: "Ansible 배포 작업이었습니다. 스케줄·대상 대역 공유.",
    resolution: "업무 스크립트 확인 → IP·시간대 화이트리스트 또는 모니터링 예외 검토",
    customerGain: "자동화·악성 스캔을 구분해, 필요한 운영 통신은 남기고 위협만 걸러냅니다.",
  },
  {
    id: "forbidden-mining-adjacent",
    category: "forbidden",
    taskTitle: "외부 IP 대상 장기·대용량 아웃바운드 (채굴·C2 의심) 문의",
    eventType: "long session outbound · ioc connection",
    direction: "아웃바운드",
    summary:
      "장시간 유지되는 아웃바운드와 IocIP 매칭이 겹친 경우, 채굴 풀·C2·비인가 프록시 등을 함께 검토합니다. (실제 사례: 장기 SSH·대용량 이동 다수와 동일 파이프라인)",
    findings: [
      "수 시간 이상 세션 + 비업무 시간대 집중",
      "IOC·C2 URL·데이터 이동 규칙 교차 확인",
      "고객 답변·프로세스·목적지 ASN까지 종합 판단",
    ],
    staffAsk:
      "장기·대용량 아웃바운드가 있습니다. 채굴·C2·백업·개인 VPN 등 업무 목적인지, 프로세스·스케줄 확인 부탁드립니다.",
    customerReply: "비인가 스크립트·에이전트 확인 후 제거(또는 승인된 백업 작업으로 확인).",
    resolution: "위협 판단 시 격리·제거, 정상 시 화이트리스트·모니터링",
    customerGain:
      "채굴·C2·우회 통신처럼 「조용히 오래 나가는」 트래픽도 행동·IOC로 후보를 올립니다.",
  },
];

export const customerOutcomeBlocks = [
  {
    title: "알림에서 끝나지 않습니다",
    body: "이벤트 이름만이 아니라, 출발·목적 IP, 포트, 시간대, UA, Ioc 태그까지 RUNA 업무에 붙어 옵니다.",
    caseIds: ["unknown-mechanical", "forbidden-webshell", "forbidden-ioc-phishing"],
  },
  {
    title: "고객의 업무 상황을 반영합니다",
    body: "「정기 패치입니다」「Ansible 배포입니다」 같은 답변이 화이트리스트·보고서에 반영됩니다.",
    caseIds: ["unknown-mechanical", "cleanup-vpn", "forbidden-ssh-flood"],
  },
  {
    title: "보고서가 쓸모 있습니다",
    body: "확인 요청 → 고객 답변 → 조치 → 재탐지 결과가 침해 평가 보고서 한 문서로 이어집니다.",
    caseIds: ["forbidden-proxy-residual", "cleanup-proxyware", "forbidden-malware-ua"],
  },
  {
    title: "전 고객 IOC가 매일 적용됩니다",
    body: "한 고객에서 검증된 악성 IP·URL이 다음 날 전 테넌트 conn 로그에 일괄 매칭됩니다.",
    caseIds: ["forbidden-ioc-phishing", "forbidden-mining-adjacent"],
  },
  {
    title: "통신을 분류·정리·차단할 수 있습니다",
    body: "알지 못했던 통신 · 정리가 필요한 통신 · 있으면 안 되는 통신을 구분해 관리합니다.",
    caseIds: ["cleanup-rcs", "cleanup-proxyware", "forbidden-malware-ua"],
  },
];

export function casesByCategory(category: CaseCategory): TaskCaseStudy[] {
  return taskCaseStudies.filter((c) => c.category === category);
}

export function caseById(id: string): TaskCaseStudy | undefined {
  return taskCaseStudies.find((c) => c.id === id);
}

/** STEP별로 보여줄 초점 — 같은 사례라도 단계마다 다른 면만 노출 */
export type JourneyStepFocus =
  | "collect"
  | "detect"
  | "ioc"
  | "whitelist"
  | "notify"
  | "reply"
  | "verify"
  | "report";

export type JourneyStepExample = {
  step: string;
  focus: JourneyStepFocus;
  headline: string;
  caseIds: string[];
};

export const journeyStepExamples: JourneyStepExample[] = [
  {
    step: "01",
    focus: "collect",
    headline: "분석 전 — Zeek가 기록하는 원시 로그",
    caseIds: [],
  },
  {
    step: "02",
    focus: "detect",
    headline: "규칙이 후보로 올린 탐지 근거",
    caseIds: [],
  },
  {
    step: "03",
    focus: "ioc",
    headline: "전 고객 IocIP와 conn 로그 일일 매칭",
    caseIds: [],
  },
  {
    step: "04",
    focus: "whitelist",
    headline: "검증·등록 후 다음부터 제외되는 업무 통신",
    caseIds: [],
  },
  {
    step: "05",
    focus: "notify",
    headline: "고객 RUNA에 도착하는 확인 요청 (선별된 업무만)",
    caseIds: ["unknown-mechanical", "forbidden-webshell"],
  },
  {
    step: "06",
    focus: "reply",
    headline: "고객이 업무 Sheet·댓글로 남기는 맥락 답변",
    caseIds: ["unknown-mechanical", "cleanup-vpn", "forbidden-ssh-flood"],
  },
  {
    step: "07",
    focus: "verify",
    headline: "탐지 + 고객 답변을 합쳐 내린 조치·권고",
    caseIds: ["cleanup-proxyware", "forbidden-proxy-residual", "forbidden-malware-ua"],
  },
  {
    step: "08",
    focus: "report",
    headline: "침해 평가 보고서에 담기는 사건 한 건 전체",
    caseIds: ["forbidden-webshell"],
  },
];

export function stepExample(step: string): JourneyStepExample | undefined {
  return journeyStepExamples.find((e) => e.step === step);
}

/** STEP 01 — 수집 단계에서 보여줄 conn/DNS 원시 로그 스냅샷 */
export const collectionLogSnapshots = [
  {
    logType: "conn",
    caption: "측면이동 — 폐쇄망 서버의 주기적 HTTP (판단 전 원시 conn)",
    fields: [
      "id.orig_h = 10.24.18.52",
      "id.resp_h = 10.24.20.10",
      "id.resp_p = 80/tcp",
      "duration = 3,600s",
      "orig_pkts / resp_pkts = 균일 반복",
    ],
  },
  {
    logType: "dns",
    caption: "아웃바운드 — 워크스테이션의 외부 DNS 질의",
    fields: [
      "id.orig_h = 10.160.4.49",
      "query = ipwho.is",
      "answers = 104.20.44.133",
      "qtype = A",
    ],
  },
  {
    logType: "http",
    caption: "인바운드 — 외부에서 내부 웹서버로의 요청",
    fields: [
      "id.orig_h = 194.233.100.x (외부)",
      "id.resp_h = 220.73.173.x (내부)",
      "method = GET",
      "uri = /uploads/*.php",
      "status_code = 200",
    ],
  },
];
