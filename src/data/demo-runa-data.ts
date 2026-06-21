/** 데모용 RUNA 데이터 — 실제 고객사명·IP·코드는 모두 가상값으로 치환 */

export type DemoTaskStatus = "writing" | "requested" | "checking" | "completed";

export type DemoTask = {
  id: string;
  code: string;
  title: string;
  status: DemoTaskStatus;
  statusLabel: string;
  section: "pre_request" | "in_request" | "done";
  author: string;
  requestedAt: string;
  updatedAt: string;
  assignee: string;
  summary: string;
  content: string[];
  relatedThreats: {
    at: string;
    event: string;
    srcIp: string;
    dstIp: string;
    description: string;
  }[];
  actionNotes?: string;
  comments: { author: string; role: "staff" | "client"; body: string; at: string }[];
};

export const DEMO_DATE_RANGE = { start: "2026-05-01", end: "2026-05-31" };

export const demoTasks: DemoTask[] = [
  {
    id: "t1",
    code: "DEMO-2026-05-001",
    title: "프록시웨어 잔류 통신 문의",
    status: "completed",
    statusLabel: "업무 완료",
    section: "done",
    author: "제로티카 분석팀",
    requestedAt: "2026-05-06 14:00",
    updatedAt: "2026-05-07 11:40",
    assignee: "김분석",
    summary:
      "종료된 프록시웨어 프로세스 잔류로 인한 외부 통신이 탐지되었습니다. 고객 확인 후 정상 종료 처리 및 재발 방지 점검을 완료하였습니다.",
    content: [
      "내부 호스트에서 프록시웨어 관련 잔류 통신이 확인되었습니다.",
      "고객 측에서 레거시 에이전트 프로세스 종료·삭제 후 재탐지 없음을 확인하였습니다.",
    ],
    relatedThreats: [
      {
        at: "2026-05-06 13:42",
        event: "long session outbound",
        srcIp: "10.88.12.5",
        dstIp: "203.0.113.44",
        description: "장시간 아웃바운드 세션 — 프록시 성격 통신",
      },
    ],
    actionNotes: "고객 조치: 서비스 중지 및 프로세스 삭제. 재탐지 모니터링 48시간 후 완료 처리.",
    comments: [
      {
        author: "분석팀",
        role: "staff",
        at: "2026-05-06 14:20",
        body: "내부 호스트에서 프록시웨어 관련 잔류 통신이 확인되었습니다. 해당 서버의 현재 운영 여부 확인 부탁드립니다.",
      },
      {
        author: "demo_admin",
        role: "client",
        at: "2026-05-07 09:15",
        body: "레거시 에이전트 잔여 프로세스로 확인되었습니다. 서비스 중지 및 삭제 조치 완료했습니다.",
      },
      {
        author: "분석팀",
        role: "staff",
        at: "2026-05-07 11:40",
        body: "재탐지 없음 확인. 업무 완료 처리하였습니다.",
      },
    ],
  },
  {
    id: "t2",
    code: "DEMO-2026-05-002",
    title: "프록시웨어 관련 도메인 접근 문의",
    status: "completed",
    statusLabel: "업무 완료",
    section: "done",
    author: "제로티카 분석팀",
    requestedAt: "2026-05-07 15:30",
    updatedAt: "2026-05-08 10:30",
    assignee: "이분석",
    summary: "프록시 관련 도메인 접근이 탐지되었으나, 고객 측 CDN·업데이트 채널 통신으로 확인되어 종결하였습니다.",
    content: [
      "동일 대역에서 프록시 성격의 도메인 접근이 반복되었습니다.",
      "고객 확인 결과 클라이언트 패치 배포용 CDN 통신으로 판단되었습니다.",
    ],
    relatedThreats: [
      {
        at: "2026-05-07 15:12",
        event: "response failure rate abnormal outbound",
        srcIp: "10.88.12.8",
        dstIp: "198.51.100.22",
        description: "CDN 업데이트 채널 의심 통신",
      },
    ],
    comments: [
      {
        author: "분석팀",
        role: "staff",
        at: "2026-05-07 16:05",
        body: "동일 대역에서 프록시 성격의 도메인 접근이 반복됩니다. 업무상 사용 중인지 확인 부탁드립니다.",
      },
      {
        author: "demo_admin",
        role: "client",
        at: "2026-05-08 10:30",
        body: "클라이언트 패치 배포용 CDN 통신입니다. 허용 목록 반영 요청드립니다.",
      },
    ],
  },
  {
    id: "t3",
    code: "DEMO-2026-05-003",
    title: "폐쇄망 IP (10.24.18.52) 기계적 통신 (80/tcp) 식별 문의",
    status: "requested",
    statusLabel: "확인 요청",
    section: "in_request",
    author: "제로티카 분석팀",
    requestedAt: "2026-05-12 11:00",
    updatedAt: "2026-05-13 09:40",
    assignee: "김분석",
    summary:
      "폐쇄망 호스트에서 주기적 HTTP 기계적 통신이 탐지되었습니다. 업무 용도 확인이 필요합니다.",
    content: [
      "10.24.18.52 → 내부 미러(10.24.20.10) 간 HTTP 반복 연결이 확인됩니다.",
      "정기 패치 배포용 내부 미러 서버 통신인지 고객 확인을 요청드립니다.",
      "확인 후 화이트리스트 반영 여부를 함께 검토하겠습니다.",
    ],
    relatedThreats: [
      {
        at: "2026-05-12 10:55",
        event: "agent communication pkts bytes lateral",
        srcIp: "10.24.18.52",
        dstIp: "10.24.20.10",
        description: "폐쇄망 호스트 기계적 HTTP 통신 (80/tcp)",
      },
    ],
    comments: [
      {
        author: "분석팀",
        role: "staff",
        at: "2026-05-12 11:20",
        body: "10.24.18.52 → 내부 미러(10.24.20.10) 간 HTTP 반복 연결이 확인됩니다. 정기 배포 통신인지 확인 부탁드립니다.",
      },
      {
        author: "demo_admin",
        role: "client",
        at: "2026-05-13 09:40",
        body: "정기 패치 배포용 내부 미러 서버 통신입니다. 화이트리스트 등록 검토 부탁드립니다.",
      },
    ],
  },
  {
    id: "t4",
    code: "DEMO-2026-05-004",
    title: "다수의 내부 IP 대상 SSH 연결 시도",
    status: "checking",
    statusLabel: "확인 중",
    section: "in_request",
    author: "제로티카 분석팀",
    requestedAt: "2026-05-14 15:30",
    updatedAt: "2026-05-14 16:10",
    assignee: "박분석",
    summary: "내부 다수 호스트로 SSH 연결 시도가 집중 탐지되었습니다. 자동화 스크립트 여부를 검증 중입니다.",
    content: [
      "10.200.10.0/24 대역에서 SSH 시도가 단시간에 증가했습니다.",
      "배포·점검 스크립트 사용 여부 확인을 요청드립니다.",
    ],
    relatedThreats: [
      {
        at: "2026-05-14 15:22",
        event: "smb fail outlier lateral",
        srcIp: "10.200.10.15",
        dstIp: "10.200.10.0/24",
        description: "다수 내부 IP 대상 SSH 연결 시도",
      },
    ],
    comments: [
      {
        author: "분석팀",
        role: "staff",
        at: "2026-05-14 15:55",
        body: "10.200.10.0/24 대역에서 SSH 시도가 단시간에 증가했습니다. 배포·점검 스크립트 사용 여부 공유 부탁드립니다.",
      },
    ],
  },
  {
    id: "t5",
    code: "DEMO-2026-05-005",
    title: "10.88.12.5 지속적인 포트 스캐닝 정황 식별 문의",
    status: "writing",
    statusLabel: "작성중",
    section: "pre_request",
    author: "제로티카 분석팀",
    requestedAt: "2026-05-21 09:00",
    updatedAt: "2026-05-21 09:00",
    assignee: "미지정",
    summary: "단일 호스트에서 내부망 다수 포트로 스캔 패턴이 탐지되었습니다. 분석 내용을 정리 중입니다.",
    content: ["내부 포트 스캔 패턴 분석 중입니다. 고객 확인 전 작성중 상태입니다."],
    relatedThreats: [
      {
        at: "2026-05-21 08:48",
        event: "conn dst reject outlier lateral",
        srcIp: "10.88.12.5",
        dstIp: "10.200.0.0/16",
        description: "내부망 다수 포트 스캔 정황",
      },
    ],
    comments: [],
  },
];

export const demoStageSummaryRows = [
  { stage: "1단계: 아웃바운드", events: 1842, suspected: 28, valid: 3 },
  { stage: "2단계: 인바운드", events: 956, suspected: 12, valid: 1 },
  { stage: "3단계: 측면이동", events: 421, suspected: 8, valid: 2 },
];

export const demoStageEventRows = [
  { event: "agent communication pkts bytes lateral", stage: "3단계: 측면이동", events: 52, suspected: 2, valid: 0 },
  { event: "ioc connection outbound", stage: "1단계: 아웃바운드", events: 28, suspected: 2, valid: 1 },
  { event: "long session outbound", stage: "1단계: 아웃바운드", events: 312, suspected: 4, valid: 1 },
  { event: "response failure rate abnormal outbound", stage: "1단계: 아웃바운드", events: 198, suspected: 3, valid: 0 },
  { event: "conn dst reject outlier lateral", stage: "3단계: 측면이동", events: 87, suspected: 2, valid: 1 },
  { event: "smb fail outlier lateral", stage: "3단계: 측면이동", events: 64, suspected: 1, valid: 0 },
];

export const demoReports = [
  {
    period: "2026-05-01 ~ 2026-05-31",
    title: "ZeroTica Watch",
    status: "발행완료",
    statusClass: "text-emerald-600",
  },
];

export const demoReportOverview = {
  period: "2026-05-01 ~ 2026-05-31",
  purpose: "네트워크 보안 취약점 식별 및 침해사고 대응 역량 평가",
  target: "데모 고객사 내부망 (10.0.0.0/8, 172.16.0.0/12)",
  personnel: "제로티카 분석팀 2명",
};

export const demoReportThreatSummary = [
  {
    title: "프록시웨어 잔류 통신 문의",
    date: "2026-05-06",
    status: "completed",
    cause: "종료되지 않은 프록시 프로세스로 인한 외부 통신 지속",
    outcome: "고객 조치 후 재탐지 없음, 업무 완료",
  },
  {
    title: "폐쇄망 IP (10.24.18.52) 기계적 통신 식별",
    date: "2026-05-12",
    status: "requested",
    cause: "폐쇄망 호스트의 주기적 HTTP 기계적 연결",
    outcome: "정기 패치 미러 통신으로 확인, 화이트리스트 검토 중",
  },
  {
    title: "다수의 내부 IP 대상 SSH 연결 시도",
    date: "2026-05-14",
    status: "checking",
    cause: "단시간 SSH 시도 급증, 자동화 스크립트 가능성",
    outcome: "고객 확인 대기, 배포 스크립트 여부 검증 중",
  },
];

/** 방법론 섹션 UI 미리보기 — front_cylee2 실제 화면 구조·컬럼명 기준 (데모 데이터) */
export const demoAgentEventDetail = {
  eventName: "agent communication pkts bytes lateral",
  date: "2026-05-12",
  srcIp: "10.24.18.52",
  dstIp: "10.24.20.10",
  /** back event_type.py AGENT_COMMUNICATION components 순서 */
  components: ["networkMap", "bytesTimeline", "bytesTraffic", "connDstAgentLogTable"] as const,
  connLogs: [
    {
      datetime: "2026-05-12 10:00",
      src_ip: "10.24.18.52",
      src_port: 49152,
      dst_ip: "10.24.20.10",
      dst_port: 80,
      proto: "tcp",
      service: "http",
      duration: "1h02m",
      src_pkts: 42,
      src_bytes: 4284,
    },
    {
      datetime: "2026-05-12 11:00",
      src_ip: "10.24.18.52",
      src_port: 49152,
      dst_ip: "10.24.20.10",
      dst_port: 80,
      proto: "tcp",
      service: "http",
      duration: "1h01m",
      src_pkts: 41,
      src_bytes: 4158,
    },
    {
      datetime: "2026-05-12 12:00",
      src_ip: "10.24.18.52",
      src_port: 49152,
      dst_ip: "10.24.20.10",
      dst_port: 80,
      proto: "tcp",
      service: "http",
      duration: "1h03m",
      src_pkts: 42,
      src_bytes: 4301,
    },
  ],
  hourlyBytes: [4284, 4158, 4301, 4289, 4162, 4295],
};

export const demoLongSessionPreview = {
  direction: "outbound" as const,
  excludeWhiteGroup: true,
  rows: [
    {
      datetime: "2026-05-06 13:42",
      src_ip: "10.88.12.5",
      src_port: 52341,
      dst_ip: "203.0.113.44",
      dst_port: 443,
      proto: "tcp",
      service: "ssl",
      duration: "6h18m",
      src_bytes: "1.2 GB",
    },
  ],
};

/** front whitelist-page.ui.tsx 탭 라벨 */
export const demoWhitelistTabs = [
  { id: "ip", label: "로컬 IP 화이트리스트", active: false },
  { id: "ip-public", label: "공통 IP 화이트리스트", active: true },
  { id: "domain", label: "도메인 화이트리스트", active: false },
  { id: "asn", label: "ASN 화이트리스트", active: false },
  { id: "group", label: "그룹 화이트리스트", active: false },
  { id: "agent-group", label: "Agent Group 화이트리스트", active: false },
] as const;

export const demoWhitelistSampleRows = [
  { target: "10.24.20.10", memo: "정기 패치 내부 미러", updated: "2026-05-13" },
  { target: "198.51.100.0/24", memo: "CDN 업데이트 채널", updated: "2026-05-08" },
];

/** front SensorIngestionStatusCard — 데모 수집 상태 */
export const demoSensorIngestion = {
  subtitle: "2026-05-01 ~ 2026-05-31",
  summaryLabel: "31일 모두 정상",
  sensors: [
    { id: "s1", detail: "정상" },
    { id: "s2", detail: "정상" },
  ],
  daySensors: [
    { id: "s1", connRows: "2.4M" },
    { id: "s2", connRows: "1.8M" },
  ],
};

/** front ioc connection · IocIP 일괄 매칭 — 데모 */
export const demoIocBatch = {
  eventName: "ioc connection outbound",
  date: "2026-05-14",
  poolNote: "전 고객 IocIP · 일일 conn 매칭",
  matches: [
    {
      src_ip: "10.88.12.5",
      dst_ip: "203.0.113.88",
      tags: ["C2", "multi-tenant"],
      dst_ports: "443, 8443",
      count: 12,
    },
    {
      src_ip: "10.24.18.52",
      dst_ip: "198.51.100.44",
      tags: ["scan", "verified-case"],
      dst_ports: "443",
      count: 3,
    },
  ],
};
