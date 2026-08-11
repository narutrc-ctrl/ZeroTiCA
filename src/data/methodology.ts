/** 제로티카 분석 — 상세 설명 (킬체인 제외, analysis/scripts 기반) */

export const analyzeIntro = {
  title: "일반 NDR이 놓치기 쉬운 통신을",
  titleAccent: "행동 기반으로 끝까지 추적합니다",
  lead:
    "제로티카는 Zeek conn·HTTP·DNS·SSL·SMB·인증 로그를 매일 전처리한 뒤, 30개 이상의 탐지 스크립트를 실행합니다. 시그니처 한 방이 아니라 시간에 걸친 패턴·통계·IOC를 봅니다.",
};

export type CommDirectionId = "outbound" | "inbound" | "lateral";

export const communicationDirections: {
  id: CommDirectionId;
  label: string;
  flow: string;
  summary: string;
  examples: string[];
}[] = [
  {
    id: "outbound",
    label: "아웃바운드",
    flow: "내부 → 외부",
    summary:
      "내부 자산에서 인터넷·외부망으로 나가는 통신입니다. 잔류 에이전트 비콘, C2·장기 세션, IOC 매칭, 데이터 유출 징후를 이 관점에서 따로 봅니다.",
    examples: [
      "기계적 통신 · 에이전트 비콘",
      "C2 URL · 장기 세션",
      "IOC 연결(dst_ip 매칭)",
      "User-Agent 위협 · HTTP 응답 실패율 이상",
      "원격 제어 소프트웨어 DNS",
      "대용량 아웃바운드(유출 징후)",
    ],
  },
  {
    id: "inbound",
    label: "인바운드",
    flow: "외부 → 내부",
    summary:
      "외부에서 사내 서버·워크스테이션으로 들어오는 통신입니다. 웹 공격·스캔·웹쉘·비정상 인증 시도를 외부 유입 관점에서 집계합니다.",
    examples: [
      "URI 위협 · 웹쉘",
      "내부 대상 스캔",
      "연결 거절(S0/REJ) 이상",
      "IOC 연결",
      "ICMP 이상",
      "FTP 비정상 연결",
    ],
  },
  {
    id: "lateral",
    label: "측면이동(내부망)",
    flow: "내부 → 내부",
    summary:
      "같은 내부망 안에서 이어지는 통신입니다. 침해 후 확산, 자격 증명 남용, 내부 스캔·기계적 비콘을 별도 규칙으로 추적합니다.",
    examples: [
      "SSH · RDP · SMB 인증 이상",
      "Kerberos · NTLM 이상",
      "내부 스캔",
      "웹쉘 · URI 위협",
      "기계적 통신(내부 비콘)",
      "WMI 악성 명령 · SMB 비정상 접근",
    ],
  },
];

export const directionAnalysisNote = {
  title: "같은 유형도 방향마다 따로 분석합니다",
  body:
    "분석 엔진은 conn 로그의 src_local·dst_local로 통신 방향을 나눈 뒤, 각 탐지 스크립트를 아웃바운드·인바운드·측면이동에 맞게 실행합니다. 대시보드에서도 방향·이벤트 유형별 발생·의심·유효 건수로 우선순위를 정합니다.",
};

export const ndrComparison = {
  title: "왜 ‘알람만 많은 NDR’과 다른가",
  rows: [
    {
      typical: "실시간 이상 점수·시그니처 위주",
      zerotica: "Zeek 로그 기반 일배치 + 행동·통계 규칙 + IOC 일괄 매칭",
    },
    {
      typical: "단일 알림 스트림",
      zerotica: "아웃바운드·인바운드·내부 간 통신 방향별 이벤트 집계",
    },
    {
      typical: "탐지 후 고객이 직접 판단",
      zerotica: "분석팀 선별 → 확인 요청 → 고객 맥락 확인 → 전문가 검증 → 보고",
    },
    {
      typical: "고객별로 고립된 위협 정보",
      zerotica: "전 고객 IocIP·악성 패턴을 매일 일괄 점검해 신규 침해 징후를 빠르게 공유",
    },
  ],
};

export const analysisPipeline = [
  {
    step: "①",
    title: "미러링 · 센서",
    body: "SPAN/TAP → Zeek conn·HTTP·DNS·SSL·SMB·인증 로그",
  },
  {
    step: "②",
    title: "전처리·집계",
    body: "시간 bin · 장기 세션 · src/dst local 플래그 정규화",
  },
  {
    step: "③",
    title: "30+ 탐지 규칙",
    body: "방향별 행동·통계·IOC·프로토콜 이상 매칭",
  },
  {
    step: "④",
    title: "화이트리스트",
    body: "검증된 업무 통신·그룹 단계적 제외",
  },
  {
    step: "⑤",
    title: "전문가 검증",
    body: "분석팀 선별 → 고객 협업",
  },
];

export type DetectionTopic = {
  id: string;
  tag: string;
  name: string;
  problem: string;
  approach: string;
  outcome: string;
  screenNote: string;
  visual: "event-detail-agent" | "long-session" | "ioc-batch" | "event-dashboard" | "task-whitelist";
};

export const detectionTopics: DetectionTopic[] = [
  {
    id: "beacon",
    tag: "많은 NDR이 놓치는 영역",
    name: "기계적 통신 · 에이전트 비콘",
    problem:
      "백도어·에이전트는 트래픽 양이 작고, 주기가 규칙적이라 일반 이상 탐지나 시그니처만으로는 오래 숨을 수 있습니다.",
    approach:
      "시간대별 패킷·바이트 변동을 분석해, 사람이 아닌 ‘기계가 보내는 듯한’ 균일한 반복 통신을 식별합니다. conn 로그에서 src_local·dst_local로 방향을 나눠 아웃바운드·인바운드·측면이동 각각 실행합니다. DNS·NTP 등 필수 서비스는 제외하고, 과거에 없던 신규 목적지에 집중합니다.",
    outcome: "은밀한 아웃바운드 비콘·잔류 에이전트 통신을 조기에 후보군으로 올립니다.",
    screenNote:
      "대시보드에서 agent communication 이벤트를 펼치면 networkMap, bytesTimeline, connDstAgentLogTable 등 분석팀이 보는 상세 패널이 열립니다.",
    visual: "event-detail-agent",
  },
  {
    id: "longsession",
    tag: "지속 연결 추적",
    name: "장기 세션 · C2 채널",
    problem:
      "짧은 burst만 보는 장비는, 하루 종일 열려 있는 C2 채널이나 대용량 유출 직전의 장기 세션을 놓치기 쉽습니다.",
    approach:
      "수 시간 이상 유지되는 세션을 별도로 추적하고, 같은 출발·목적지에서 다른 포트로 이어지는 재접속 패턴까지 연결해 봅니다. HTTP·conn 로그를 함께 사용합니다.",
    outcome: "장기간 잠복한 명령·제어 통신과 데이터 유출 징후를 구분해 검토합니다.",
    screenNote:
      "장시간 세션 페이지에서 Outbound·Inbound·Lateral 탭과 conn 로그 테이블로 지속 세션을 직접 추적합니다. 화이트 그룹 제외 옵션으로 이미 확인된 업무 통신을 걸러냅니다.",
    visual: "long-session",
  },
  {
    id: "ioc",
    tag: "전 고객 위협 인텔",
    name: "IOC · 악성 패턴 일괄 점검",
    problem:
      "한 고객에서만 보던 위협 IP가, 다른 고객망에서는 며칠 뒤에야 별도 장비 알람으로 늦게 잡히는 경우가 많습니다.",
    approach:
      "다른 고객 사례에서 검증·축적된 IocIP를 매일 conn 로그와 조인합니다. 내부→외부(outbound)·외부→내부(inbound) 케이스를 나눠 src/dst 매칭·태그·연결 횟수·포트 목록을 ioc connection 이벤트로 집계합니다.",
    outcome: "한 고객에서 확인된 악성 IP·패턴이 전체 고객망에 바로 적용됩니다.",
    screenNote:
      "ioc connection outbound/inbound 화면 — IocIP ↔ conn dst_ip 일일 매칭, src/dst·태그·연결 횟수 테이블",
    visual: "ioc-batch",
  },
  {
    id: "coverage",
    tag: "30+ 규칙 · 방향별 집계",
    name: "이벤트 유형별 현황",
    problem:
      "한 가지 유형만 보면 스캔·인증 이상·웹쉘·IOC 연결 등 다른 징후가 누락됩니다.",
    approach:
      "기계적 통신, 장기 세션, 스캔, SSH·RDP·SMB·Kerberos·NTLM 인증 이상, C2 URL, 웹쉘, IOC, DNS·ICMP·FTP 이상 등 30+ 규칙을 아웃바운드·인바운드·측면이동 각각 실행하고, 발생·의심·유효 건수로 집계합니다.",
    outcome: "분석팀이 우선순위를 정하고, 보고서·확인 요청에 반영할 후보만 추립니다.",
    screenNote: "대시보드 Stage별·이벤트별 집계 테이블 — 발생·의심·유효 건수로 우선순위 판단",
    visual: "event-dashboard",
  },
];

export const whitelistApproach = {
  title: "화이트리스트는 ‘끄는 것’이 아니라 줄여 나가는 것",
  lead:
    "정상으로 확인된 통신은 이벤트 유형별로 세밀하게 등록합니다. 처음부터 모두 막는 것이 아니라, 검증을 거친 것만 다음부터 제외합니다.",
  layers: [
    {
      name: "IP · ASN",
      desc: "특정 자산·대역의 알려진 업무 통신, CDN·클라우드 AS 등 반복 확인된 출처",
    },
    {
      name: "도메인",
      desc: "정기 패치·업데이트 채널, 사내 표준 서비스 호스트",
    },
    {
      name: "통신 그룹",
      desc: "장기 세션 분석으로 묶인 ‘AS명_서비스’ 단위 업무 그룹 — 신규 그룹만 추가 검토",
    },
    {
      name: "이벤트 유형별 예외",
      desc: "같은 IP라도 특정 탐지 규칙에만 예외를 둘 수 있어, 필요한 가시성은 유지",
    },
  ],
  closing:
    "그래서 시간이 지날수록 ‘또 같은 알람’이 줄고, 진짜 새로운 의심 통신에 집중할 수 있습니다.",
};

export const directionLabels = ["아웃바운드", "인바운드", "측면이동(내부망)"];

export const runaCollaborationPoints = [
  "의심 통신 발생 시 고객에게 선별 알림",
  "고객과의 상호작용으로 업무 맥락 확인",
  "정상·위협 여부 검증 및 조치 안내",
  "전 과정이 보고서로 자동 정리",
];
