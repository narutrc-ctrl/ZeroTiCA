/** 실제 RUNA 이슈 패턴 기반 — 고객사명·IP·호스트명 익명화 */

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

export type CommunicationCategoryBullet = {
  label: string;
  caseId?: string;
};

export type CustomerValueZoneColumn = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  hygieneNote?: string;
  bullets: CommunicationCategoryBullet[];
};

export type CustomerValueZone = {
  id: "threat" | "operations";
  title: string;
  lead: string[];
  columns: CustomerValueZoneColumn[];
  caseIds: string[];
  slideTabs: { caseId: string; tabLabel: string }[];
};

/** 고객 가치 — 위협 분석 vs 위협 이외 정리 */
export const customerValueZones: CustomerValueZone[] = [
  {
    id: "threat",
    title: "위협 분석",
    lead: [
      "아웃바운드·인바운드·측면이동 방향별로 의심 통신의 근거를 모읍니다. 알려진 악성 지표 매칭, 웹·인증 이상, 규칙적으로 반복되는 통신, 오래 이어지는 연결 등을 같은 기준으로 후보에 올립니다.",
      "후보 등록 → 고객 확인 → 분석팀 검증을 거쳐 조치·화이트리스트까지 연결합니다.",
    ],
    columns: [
      {
        id: "outbound",
        title: "Outbound",
        subtitle: "아웃바운드",
        description:
          "내부에서 밖으로 나가는 통신입니다. 알려진 악성 IP·URL 접근, 공격 도구·스캐너 류 비정상 접속, 몇 시간 이상 붙어 있는 외부 연결·잔류 프록시, 간격과 양이 규칙적인 에이전트형 통신, C2·대용량 전송 징후까지 한 방향에서 봅니다.",
        bullets: [
          { label: "피싱·악성 페이지 IoC 접근", caseId: "forbidden-ioc-phishing" },
          { label: "공격 도구·스캐너 UA 의심 통신", caseId: "forbidden-malware-ua" },
          { label: "프록시웨어 잔류·오래 이어지는 외부 연결", caseId: "forbidden-proxy-residual" },
          { label: "간격·양이 규칙적인 기계적 비콘", caseId: "forbidden-mining-adjacent" },
        ],
      },
      {
        id: "inbound",
        title: "Inbound",
        subtitle: "인바운드",
        description:
          "외부에서 내부로 들어오는 통신입니다. 웹쉘·비정상 URI, 관리 콘솔 노출, 외부 스캔·연결 거절 이상, 알려진 악성 IP·URL 유입, 응답 실패율 급증 등 외부 유입 공격 흔적을 집계합니다.",
        bullets: [
          { label: "웹쉘·비정상 URI 의심 요청", caseId: "forbidden-webshell" },
          { label: "Tomcat 등 관리 콘솔 외부 노출", caseId: "kc-tomcat-exposure" },
          { label: "외부 스캔·연결 거절 이상" },
          { label: "알려진 악성 IP·URL 유입 매칭" },
        ],
      },
      {
        id: "lateral",
        title: "Lateral",
        subtitle: "측면이동",
        description:
          "내부망 안에서 이어지는 통신입니다. 다수 포트 스캔·연결 거절, SSH·Kerberos·SMB·RDP 등 인증·접근 이상, 내부 기계적 비콘, 침해 후 횡적 이동 흔적과 사고 정리까지 봅니다.",
        bullets: [
          { label: "내부 IP 반복 포트 스캔", caseId: "forbidden-scan" },
          { label: "SSH·Kerberos 등 인증 실패 급증", caseId: "kc-ssh-fail-flood" },
          { label: "SMB·RDP·WMI 등 내부 접근 이상" },
          { label: "침해사고 대응·횡적 이동 정리", caseId: "seoulsystem-incident" },
        ],
      },
    ],
    caseIds: [
      "forbidden-webshell",
      "forbidden-ioc-phishing",
      "forbidden-malware-ua",
      "kc-tomcat-exposure",
      "forbidden-scan",
      "kc-ssh-fail-flood",
    ],
    slideTabs: [
      { caseId: "forbidden-webshell", tabLabel: "웹쉘 · Inbound" },
      { caseId: "forbidden-ioc-phishing", tabLabel: "IoC · Outbound" },
      { caseId: "forbidden-malware-ua", tabLabel: "악성 UA · Outbound" },
      { caseId: "kc-tomcat-exposure", tabLabel: "Tomcat 노출" },
      { caseId: "forbidden-scan", tabLabel: "포트 스캔 · Lateral" },
      { caseId: "kc-ssh-fail-flood", tabLabel: "SSH 과다 · Lateral" },
    ],
  },
  {
    id: "operations",
    title: "위협 이외 — 발견과 정리",
    lead: [
      "모든 통신이 곧바로 위협은 아닙니다. 몰랐던 업무 통신과, 정책·예외로 정리해야 할 패턴도 같은 RUNA 이슈 흐름으로 다룹니다.",
      "화이트리스트·업무 메모·모니터링 예외까지 이어져, 알림 피로를 줄이고 네트워크 맥락을 쌓습니다.",
    ],
    columns: [
      {
        id: "unknown",
        title: "알지 못했던 통신",
        description:
          "방화벽·EDR만으로는 보이지 않던 통신을 미러링으로 먼저 찾고, 「이게 무엇인지」 담당자에게 확인합니다.",
        bullets: [
          { label: "폐쇄망 서버의 반복 HTTP 통신", caseId: "unknown-mechanical" },
          { label: "외부 IP 조회 서비스 지속 질의", caseId: "unknown-ipwhois" },
          { label: "검토가 필요한 크롬 확장 프로그램", caseId: "unknown-chrome-ext" },
          { label: "외부 서비스 반복 연결 시도", caseId: "kc-agent-comm" },
        ],
      },
      {
        id: "cleanup",
        title: "정리가 필요한 통신",
        description:
          "업무상 필요하지만 등록·정책이 없던 통신, 또는 위협이라기보다 정리가 필요한 운영 노이즈를 근거와 함께 정리합니다.",
        bullets: [
          { label: "프록시웨어·원격제어·VPN·파일 동기화", caseId: "cleanup-proxyware" },
          { label: "대용량 외부 전송·업무 맥락 확인", caseId: "cleanup-vpn" },
          { label: "Kerberos 인증 실패 과다", caseId: "cleanup-kerberos" },
          { label: "미운영 내부 호스트로 반복 연결", caseId: "cleanup-ghost-host" },
          { label: "종료된 에이전트·스크립트 잔류", caseId: "cleanup-dead-agent" },
        ],
      },
    ],
    caseIds: [
      "unknown-mechanical",
      "unknown-ipwhois",
      "cleanup-vpn",
      "cleanup-kerberos",
      "cleanup-ghost-host",
      "cleanup-dead-agent",
    ],
    slideTabs: [
      { caseId: "unknown-mechanical", tabLabel: "폐쇄망 HTTP" },
      { caseId: "unknown-ipwhois", tabLabel: "ipwho.is 질의" },
      { caseId: "cleanup-vpn", tabLabel: "대용량 전송" },
      { caseId: "cleanup-kerberos", tabLabel: "Kerberos 정리" },
      { caseId: "cleanup-ghost-host", tabLabel: "유령 호스트" },
      { caseId: "cleanup-dead-agent", tabLabel: "잔류 에이전트" },
    ],
  },
];

/** @deprecated customerValueZones 사용 — 하위 호환용 빈 배열 */
export const communicationCategories: {
  id: CaseCategory;
  title: string;
  lead: string[];
  hygieneNote?: string;
  bullets: CommunicationCategoryBullet[];
}[] = [];

/** 슬라이드 기본값 (zone에서 slides prop 전달) */
export const featuredOutcomeSlides: { caseId: string; tabLabel: string }[] = [];

/** 프로덕션 Task DB 패턴 기반 (익명화) */
export const taskCaseStudies: TaskCaseStudy[] = [
  {
    id: "unknown-mechanical",
    category: "unknown",
    taskTitle: "폐쇄망 IP 기계적 통신 (80/tcp, http) 식별 문의",
    eventType: "agent communication pkts bytes lateral",
    direction: "측면이동",
    summary:
      "폐쇄망 서버에서 내부 미러로 HTTP가 주기·균일하게 반복됩니다. 방화벽 로그만으로는 업무 맥락이 보이지 않았습니다.",
    findings: [
      "폐쇄망 IP → 내부 미러, 80/tcp, 패킷·바이트 변동이 시간대별로 균일",
      "agent communication 이벤트로 후보 등록",
      "networkMap·bytesTimeline에서 기계적 패턴 확인",
    ],
    staffAsk:
      "폐쇄망 호스트에서 내부 미러로 HTTP 반복 연결이 있습니다. 정기 패치·배포 통신인지 확인 부탁드립니다.",
    customerReply: "정기 패치 배포용 내부 미러 서버 통신입니다. 화이트리스트 등록 검토 부탁드립니다.",
    resolution: "업무 통신 확인 → IP·이벤트 유형별 화이트리스트 반영 → 재탐지 모니터링",
    customerGain: "몰랐던 폐쇄망 배포 채널이 문서화되고, 이후 같은 알람은 자동 정제됩니다.",
  },
  {
    id: "unknown-ipwhois",
    category: "unknown",
    taskTitle: "내부망 출발지 IP ipwho.is 대상 지속 질의 문의",
    eventType: "dns fail outlier outbound",
    direction: "아웃바운드",
    summary:
      "워크스테이션에서 공인 IP 조회 서비스(ipwho.is)로 5분 간격·수천 회 질의가 발생했으나, 보안·현업 모두 인지하지 못했습니다.",
    findings: [
      "내부 PC → Cloudflare IP, ipwho.is 도메인, 443/tcp",
      "약 5분 간격 반복, 일별 280회 이상 질의",
      "자동화 프로그램·점검 도구 잔존 여부 확인 필요",
    ],
    staffAsk:
      "내부 PC에서 ipwho.is로 지속 DNS 질의가 있습니다. 설치·사용 중인 프로그램이 있는지 확인 부탁드립니다.",
    customerReply: "특정 업무 S/W에서 발생하는 정상 통신으로 확인했습니다.",
    resolution: "정상 S/W 통신 확인 → 필요 시 도메인 화이트리스트·업무 메모 등록",
    customerGain: "보이지 않던 SaaS·에이전트 통신을 인벤토리에 남길 수 있습니다.",
  },
  {
    id: "unknown-chrome-ext",
    category: "unknown",
    taskTitle: "악용 가능성이 있는 크롬 확장 프로그램 식별 문의",
    eventType: "agent communication outbound",
    direction: "아웃바운드",
    summary:
      "다수 워크스테이션에서 AI 브라우저 확장(MaxAI·SiderAI) 백엔드로의 HTTPS 통신이 탐지되었습니다. 보안팀이 사전에 인지하지 못한 그림자 IT였습니다.",
    findings: [
      "내부 PC 다수 → Amazon·Cloudflare 소재 IP, 443/tcp",
      "MaxAI·SiderAI 확장 프로그램 백엔드 통신 패턴",
      "브라우저 세션 탈취 취약점 악용 가능성 안내",
    ],
    staffAsk:
      "AI 브라우저 확장 관련 백엔드 통신이 확인됩니다. 해당 확장 프로그램 설치 여부와 업무 사용 여부를 확인해 주세요.",
    customerReply: "업무에 필요한 확장은 등록하고, 불필요한 설치분은 삭제했습니다.",
    resolution: "미승인 확장 제거 → 승인 건은 업무 메모·정책 등록",
    customerGain: "브라우저 확장·SaaS 통신도 네트워크 관점에서 먼저 식별할 수 있습니다.",
  },
  {
    id: "kc-agent-comm",
    category: "unknown",
    taskTitle: "내부 IP 외부 서비스 대상 지속 연결 시도 문의",
    eventType: "agent communication pkts outbound",
    direction: "아웃바운드",
    summary:
      "내부 PC에서 방문 차량 예약 등 업무 웹 서비스로의 연결 시도가 지속되었으나, 정상 연결 없이 반복 실패하는 패턴이었습니다.",
    findings: [
      "내부 IP → 외부 IP, 12301/tcp, 연결 미성립 반복",
      "목적지는 업무 웹·NAS/VPN 포털 성격으로 OSINT 확인",
      "agent communication 이벤트로 후보 등록",
    ],
    staffAsk:
      "내부 PC에서 특정 외부 서비스로 지속적인 연결 시도가 있습니다. 업무용 접속인지, 설치된 프로그램·스케줄을 확인해 주세요.",
    customerReply: "업무용 클라이언트 설정 오류였으며, 수정 후 재탐지 없음을 확인했습니다.",
    resolution: "원인 프로그램·설정 수정 → 재탐지 모니터링",
    customerGain: "실패만 반복되는 통신도 업무 맥락과 함께 정리할 수 있습니다.",
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
    resolution: "비인가 S/W 제거 → 재탐지 없음 확인 → 완료",
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
    taskTitle: "내부망 출발지 IP 대용량 데이터 이동 통신 문의",
    eventType: "data leakage outbound",
    direction: "아웃바운드",
    summary:
      "내부 PC에서 VPN 목적지로 송신 2.1GB·수신 41GB 규모의 장기 전송이 탐지되었습니다. 업무 승인·등록 여부 확인이 필요했습니다.",
    findings: [
      "내부 PC → 79.110.55.2 (Proton VPN), 443/udp·51820/udp 등",
      "장기 세션·데이터 이동 이벤트로 후보 등록",
      "대용량 아웃바운드 + VPN 프로토콜 동시 확인",
    ],
    staffAsk:
      "내부 PC에서 VPN 서비스로 대용량 전송이 있습니다. 업무 목적·승인 여부 확인 부탁드립니다.",
    customerReply: "타사 게임 테스트용 VPN이었으며, 클라이언트 삭제 후 재탐지 없음을 확인했습니다.",
    resolution: "목적 확인 → VPN 클라이언트 삭제 → 재탐지 모니터링",
    customerGain: "개인 VPN·우회 통신도 업무 맥락과 함께 기록해 감사·정책 대응에 씁니다.",
  },
  {
    id: "cleanup-syncthing",
    category: "cleanup",
    taskTitle: "다수 내부 IP Syncthing Relay 통신 식별 문의",
    eventType: "long session outbound",
    direction: "아웃바운드",
    summary:
      "여러 워크스테이션에서 파일 동기화 도구(Syncthing) 릴레이 서버(22067/tcp)로의 반복 접속이 탐지되었습니다. 업무 등록·승인 여부를 구분했습니다.",
    findings: [
      "내부 PC 다수 → 외부 릴레이 IP, 22067/tcp",
      "P2P 실패 시 릴레이 경유 동기화 패턴",
      "특정 호스트에서 통신 횟수·주기성이 두드러짐",
    ],
    staffAsk:
      "Syncthing 릴레이 서버 접속이 반복됩니다. 업무용 파일 동기화인지, 설치·사용 여부를 확인해 주세요.",
    customerReply: "일부는 개발팀 테스트용이었고, 미승인 건은 삭제했습니다.",
    resolution: "미승인 설치 제거 → 승인 건은 업무 메모·모니터링 예외 검토",
    customerGain: "파일 동기화·P2P 도구도 등록 vs 미등록을 네트워크에서 구분할 수 있습니다.",
  },
  {
    id: "cleanup-kerberos",
    category: "cleanup",
    taskTitle: "다수 목적지 IP 대상 Kerberos 인증 실패 과다 발생 문의",
    eventType: "kerberos auth fail lateral",
    direction: "측면이동",
    summary:
      "단일 VM에서 20개 이상 내부 호스트로 Kerberos(88/udp) 인증 실패가 지속 발생했습니다. 위협보다 잘못된 자격·스케줄·잔존 설정 정리가 필요한 패턴이었습니다.",
    findings: [
      "내부 VM → 다수 내부 IP, 88/udp, 인증 실패 반복",
      "이전에 보고된 동일 출발지 패턴과 연계 추적",
      "주기적 배치·레거시 계정 설정 오류 가능성",
    ],
    staffAsk:
      "Kerberos 인증 실패가 다수 목적지로 반복됩니다. 해당 VM의 스케줄·서비스 계정·레거시 설정을 확인해 주세요.",
    customerReply: "주기 작업 VM의 잘못된 계정 정보였으며, 수정 후 재발 없음을 확인했습니다.",
    resolution: "계정·스케줄 수정 → 모니터링 예외 또는 화이트리스트 검토",
    customerGain: "인증 실패 노이즈도 업무 맥락과 함께 정리해 탐지 품질을 높일 수 있습니다.",
  },
  {
    id: "cleanup-ghost-host",
    category: "cleanup",
    taskTitle: "네트워크 활동 없는 내부 목적지로의 반복 연결 실패 문의",
    eventType: "conn dst reject outlier lateral",
    direction: "측면이동",
    summary:
      "다수 내부 PC가 트래픽이 없는(또는 미운영) 내부 IP로 443·445·137 포트 연결을 반복 시도했습니다. DNS·에이전트 설정에 남은 「죽은」 대상이 원인이었습니다.",
    findings: [
      "내부 PC 다수 → 단일 내부 IP, 443/tcp·445/tcp·137/udp 연결 실패",
      "목적지 호스트에 실제 네트워크 활동 없음",
      "자동화·점검 도구·옛 설정 잔존 가능성",
    ],
    staffAsk:
      "미사용으로 보이는 내부 IP로 연결 시도가 반복됩니다. 해당 IP 운영 여부와 출발지 PC의 스케줄·설정을 확인해 주세요.",
    customerReply: "폐기 예정 서버 IP가 에이전트 설정에 남아 있었고, 제거 후 재탐지 없음.",
    resolution: "설정·스크립트 정리 → 재탐지 모니터링",
    customerGain: "존재하지 않거나 쓰지 않는 내부 대상으로의 반복 통신도 근거와 함께 정리됩니다.",
  },
  {
    id: "cleanup-dead-agent",
    category: "cleanup",
    taskTitle: "연결 거절·기계적 통신 등 잔류 에이전트 통신 문의",
    eventType: "conn dst reject · agent communication",
    direction: "측면이동",
    summary:
      "내부 IP 간 연결 거절, 기계적 HTTP 반복, SMB 실패 등 「응답 없는」 통신이 지속되었습니다. 종료된 에이전트·배치·모니터링 스크립트 잔류가 공통 원인이었습니다.",
    findings: [
      "내부 대역 간 REJ·S0 연결, 다수 포트 동시 시도",
      "가시성 저하를 유발하는 반복 실패 트래픽",
      "Kerberos·SMB·HTTP 기계적 패턴 교차 확인",
    ],
    staffAsk:
      "내부 IP 간 연결 실패·기계적 통신이 지속됩니다. 종료된 에이전트·스크립트·모니터링 설정 잔존 여부를 확인해 주세요.",
    customerReply: "레거시 모니터링 에이전트와 배치 스크립트를 중지·삭제, 설정 수정 완료.",
    resolution: "프로세스·스케줄 정리 → 재탐지 추적 → 필요 시 예외 등록",
    customerGain: "죽은 에이전트 통신을 걷어내 이상 탐지에 쓰이는 가시성을 회복할 수 있습니다.",
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
      "Kerberos·프로세스 정보와 함께 RUNA 이슈에 근거 첨부",
    ],
    staffAsk: "프록시웨어 잔류 통신이 확인됩니다. 해당 서버 운영 여부·프로세스 종료 부탁드립니다.",
    customerReply: "레거시 에이전트 잔여 프로세스였습니다. 서비스 중지 및 삭제 완료.",
    resolution: "프로세스 삭제 → 48시간 재탐지 없음 → 완료·보고서 반영",
    customerGain: "「있으면 안 되는 잔류 통신」을 조기에 끊고, 조치 결과가 보고서에 남습니다.",
  },
  {
    id: "forbidden-webshell",
    category: "forbidden",
    taskTitle: "웹쉘 의심 통신 문의",
    eventType: "webshell inbound",
    direction: "인바운드",
    summary:
      "외부 IP에서 내부 웹서버로 비정상 URI(.php) 직접 접근이 탐지되었습니다. 로그인 폼 형태의 비인가 스크립트로 의심되었습니다.",
    findings: [
      "외부 IP → 내부 웹서버, /data/good/1.php 등 비정상 경로",
      "http_find_webshell 규칙 · URI·응답 코드 집계",
      "VPN·해외 IP에서의 직접 접근 정황",
    ],
    staffAsk:
      "외부에서 웹쉘 의심 요청이 들어왔습니다. 해당 PHP·JSP 경로 점검과 악성 파일 삭제를 부탁드립니다.",
    customerReply: "웹 루트·업로드 경로 점검 후 악성 파일 제거, 접근 로그 추가 확인.",
    resolution: "웹쉘 제거·패치 → 웹서버 로그·재스캔 모니터링",
    customerGain: "인바운드 웹 공격을 방화벽 알람과 별도로, URI 수준까지 추적합니다.",
  },
  {
    id: "forbidden-ioc-phishing",
    category: "forbidden",
    taskTitle: "피싱 AI 에이전트 설치 페이지 (IoC) 접근",
    eventType: "ioc connection outbound",
    direction: "아웃바운드",
    summary:
      "전 고객 IocIP에 등록된 피싱·AI 에이전트 설치 URL에 내부 PC가 접근했습니다. Cloudflare 뒤 다수 도메인이 매칭되었습니다.",
    findings: [
      "워크스테이션 다수 → IoC URL (purematrixa·enhanceblabber 등)",
      "ioc connection 이벤트, 443/tcp",
      "태그·연결 횟수·도메인 목록이 RUNA 테이블에 표시",
    ],
    staffAsk:
      "알려진 피싱·악성 설치 페이지 IoC 접근이 있습니다. 해당 PC 격리·점검 부탁드립니다.",
    customerReply: "엔드포인트 보안에서 조치 완료, 재접근 없음 확인.",
    resolution: "IOC 매칭 → 고객 조치 확인 → 전 테넌트 재탐지 추적",
    customerGain: "한 고객에서 검증된 악성 URL·IP가 다음 날 전 고객망에 일괄 적용됩니다.",
  },
  {
    id: "forbidden-malware-ua",
    category: "forbidden",
    taskTitle: "useragent를 통한 악성 의심 통신 문의",
    eventType: "useragent threat outbound",
    direction: "아웃바운드",
    summary:
      "공격 도구·스캐너 류 User-Agent로 외부 접속이 탐지되었고, 이후 해당 디바이스 악성코드 감염이 확인되었습니다.",
    findings: [
      "내부 PC → 외부 IP, sqlmap·scanner 류 UA 패턴",
      "http_user_agent_check 규칙 매칭",
      "단기간 다수 요청·비정상 UA 조합",
    ],
    staffAsk:
      "공격 도구로 의심되는 User-Agent 통신이 있습니다. 해당 PC 점검 부탁드립니다.",
    customerReply: "악성코드 감염 확인, 제거·재이미징 후 재탐지 없음.",
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
      "장시간 유지되는 아웃바운드와 IocIP 매칭이 겹친 경우, 채굴 풀·C2·비인가 프록시 등을 함께 검토합니다.",
    findings: [
      "수 시간 이상 세션 + 비업무 시간대 집중",
      "IOC·C2 URL·데이터 이동 규칙 교차 확인",
      "고객 답변·프로세스·목적지 ASN까지 종합 판단",
    ],
    staffAsk:
      "장기·대용량 아웃바운드가 있습니다. 채굴·C2·백업·개인 VPN 등 업무 목적인지, 프로세스·스케줄 확인 부탁드립니다.",
    customerReply: "비인가 스크립트·에이전트 확인 후 제거(또는 승인된 백업 작업으로 확인).",
    resolution: "위협 판단 시 격리·제거, 정상 시 화이트리스트·모니터링",
    customerGain: "조용히 오래 나가는 트래픽도 행동·IOC로 후보를 올립니다.",
  },
  {
    id: "kc-tomcat-exposure",
    category: "forbidden",
    taskTitle: "Tomcat 관리자 로그인 페이지 외부 노출",
    eventType: "http admin exposure inbound",
    direction: "인바운드",
    summary:
      "외부 불특정 IP에서 내부 웹자산의 Tomcat 관리자 페이지(8080/manager/html)로 지속 접근이 확인되었습니다. 로그인 성공 이력은 없었으나 외부 노출 자체가 위험 요소였습니다.",
    findings: [
      "외부 IP → 내부 웹서버, 8080/tcp, /manager/html 반복 접근",
      "Tomcat 기본 포트·관리자 화면 외부 노출",
      "무차별 대입·탈취 계정 접근 위험 안내",
    ],
    staffAsk:
      "Tomcat 관리자 페이지가 외부에 노출되어 있습니다. 비인가 외부 접근 차단과 접근 제어 설정을 확인해 주세요.",
    customerReply: "8080 포트 외부 차단, VPN·인가 IP만 접근하도록 정책 반영.",
    resolution: "외부 접근 차단 → 관리자 ACL 적용 → 재스캔 모니터링",
    customerGain: "웹 관리 콘솔 노출을 네트워크 관점에서 먼저 식별하고 조치까지 연결합니다.",
  },
  {
    id: "kc-ssh-fail-flood",
    category: "forbidden",
    taskTitle: "내부 IP간 SSH 접속 시도 과다 실패",
    eventType: "ssh auth outlier lateral",
    direction: "측면이동",
    summary:
      "한 달간 SSH 이력이 없던 내부 호스트에서 이틀 만에 3,900건 이상 SSH 연결 시도·실패가 발생했습니다. 자동화 스크립트·감염 여부 확인이 필요했습니다.",
    findings: [
      "내부 IP → 내부 IP, 22/tcp, 2일간 3,944건 시도",
      "기존 통신 이력 없이 갑작스러운 연결 시도",
      "전부 실패·REJ 패턴",
    ],
    staffAsk:
      "내부 호스트에서 SSH 연결 시도가 과도하게 발생했습니다. 배포·점검 스크립트인지, 해당 시스템 용도를 확인해 주세요.",
    customerReply: "모니터링 에이전트 오설정으로 확인, 설정 수정 후 재발 없음.",
    resolution: "원인 확인·설정 수정 → 재탐지 추적",
    customerGain: "내부 횡적 이동·브루트포스 징후를 외부 방화벽 로그와 별도로 집계합니다.",
  },
  {
    id: "kc-data-transfer",
    category: "cleanup",
    taskTitle: "대용량 데이터 이동 문의 (110GB+)",
    eventType: "data leakage outbound",
    direction: "아웃바운드",
    summary:
      "내부 IP에서 외부 자산으로 110GB 이상 전송이 확인되었습니다. 목적지는 내부에서 운영·관리하는 외부 서버로 추정되어 업무 맥락 확인이 필요했습니다.",
    findings: [
      "내부 IP → 외부 IP, 31092/tcp, 110GB+ 전송",
      "다수 내부 IP에서 동일 목적지 접근 이력",
      "정상 웹·SSH 이력과 함께 장기 전송 패턴",
    ],
    staffAsk:
      "대용량 데이터 전송이 확인됩니다. 출발지 용도와 목적지가 관리 중인 외부 자산인지 확인 부탁드립니다.",
    customerReply: "승인된 백업·동기화 작업으로 확인, 화이트리스트 검토 요청.",
    resolution: "업무 목적 확인 → 화이트리스트·모니터링 예외 등록",
    customerGain: "대용량 전송도 「누가·어디로·왜」가 남아 감사·운영 검토에 활용됩니다.",
  },
  {
    id: "seoulsystem-incident",
    category: "forbidden",
    taskTitle: "언론·에너지 경제 침해 사고 대응 정리",
    eventType: "incident response report",
    direction: "측면이동",
    summary:
      "워터링홀 침해사고 협조 요청에 따라, 언론사→에너지 경제 서버(SSH) 침투 경로와 웹쉘·권한 상승 흔적을 RUNA 이슈·보고서로 종합 정리했습니다.",
    findings: [
      "침투 추정: 언론사 잔존 웹쉘 → 에너지 경제 서버 SSH",
      "웹쉘 2건(err.php, codeigniter.php), ping6 바이너리 위장",
      "ZeroTiCA 탐지 이전 사고이나 분석·조치 타임라인 문서화",
    ],
    staffAsk:
      "국가기관 협조 요청에 따른 침해사고 분석·조치 내역을 RUNA 이슈에 정리해 주세요.",
    customerReply: "악성 파일 제거·패치 완료, 추가 점검 결과 공유.",
    resolution: "침해 평가 보고서 작성 → 조치·재발 방지 권고 반영",
    customerGain: "탐지 전후 사고까지 한 문서로 이어져 대응·보고·감사에 활용됩니다.",
  },
];

export const primaryOutcomeHighlight = {
  title: "알림에서 끝나지 않습니다",
  titleAccent: "고객의 업무 상황을 반영합니다",
  body: "위협 통신은 Outbound·Inbound·Lateral 관점에서 분석하고, 몰랐던 통신·정리가 필요한 패턴도 RUNA 이슈로 남깁니다. 확인·검증·조치·화이트리스트까지 한 흐름으로 이어집니다.",
};

export const customerOutcomeBlocks = [
  {
    title: "보고서가 쓸모 있습니다",
    body: "확인 요청 → 고객 답변 → 조치 → 재탐지 결과가 침해 평가 보고서 한 문서로 이어집니다.",
    caseIds: ["seoulsystem-incident", "forbidden-proxy-residual", "cleanup-proxyware"],
  },
  {
    title: "전 고객 IOC가 매일 적용됩니다",
    body: "한 고객에서 검증된 악성 IP·URL이 다음 날 전 테넌트 conn 로그에 일괄 매칭됩니다.",
    caseIds: ["forbidden-ioc-phishing", "forbidden-mining-adjacent"],
  },
  {
    title: "통신을 분류·정리·차단할 수 있습니다",
    body: "알지 못했던 통신 · 정리가 필요한 통신 · 있으면 안 되는 통신을 구분해 관리합니다.",
    caseIds: ["cleanup-rcs", "cleanup-syncthing", "cleanup-kerberos", "cleanup-ghost-host"],
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
    headline: "고객 RUNA에 도착하는 확인 요청 (선별된 이슈만)",
    caseIds: ["unknown-mechanical", "forbidden-webshell"],
  },
  {
    step: "06",
    focus: "reply",
    headline: "고객이 이슈 상세·댓글로 남기는 맥락 답변",
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
