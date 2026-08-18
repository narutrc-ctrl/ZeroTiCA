/** 랜딩 「검증 관점」에서 이어지는 8가지 관점 설명 */

export type PerspectiveBodyPart = {
  text: string;
  emphasis?: boolean;
};

export type PerspectiveLookItem = {
  title: string;
  body: string;
};

export type PerspectiveDetail = {
  reason: string;
  confirms: string[];
  looks: PerspectiveLookItem[];
};

export type PerspectiveItem = {
  num: string;
  title: string;
  bodyParts: PerspectiveBodyPart[];
  detail: PerspectiveDetail;
};

export type PerspectiveGroup = {
  label: string;
  heading: string;
  items: PerspectiveItem[];
};

const inboundDetail: PerspectiveDetail = {
  reason:
    "외부 침해는 공개된 웹 서비스, VPN 게이트웨이, 원격 접근 시스템 등을 통해 시작되는 경우가 많습니다. 공격자가 취약점이나 약한 인증을 이용해 내부 진입 발판을 만들었는지 확인합니다.",
  confirms: [
    "웹셸 업로드·실행 흔적",
    "인증 공격의 성공 가능성",
    "파라미터 변조를 통한 비인가 접근",
  ],
  looks: [
    {
      title: "웹셸(Webshell) 행위",
      body: "비정상적인 파일 접근이나 명령 실행 패턴을 통해 웹셸 업로드·사용 흔적을 확인합니다.",
    },
    {
      title: "크리덴셜 스터핑(Credential Stuffing)",
      body: "인증 요청 빈도와 실패·성공 비율, 동일 계정에 대한 반복 시도 패턴을 확인합니다.",
    },
    {
      title: "파라미터 변조(Parameter Tampering)",
      body: "SQL 인젝션, 경로 조작, 권한 우회 등 입력값 조작 흔적을 확인합니다.",
    },
  ],
};

const outboundDetail: PerspectiveDetail = {
  reason:
    "공격자는 내부에 침투한 뒤 언제든 다시 접근할 수 있도록 지속성을 확보합니다. 내부에서 외부로 유지되는 비정상적인 연결이 백도어·C2 채널인지 확인합니다.",
  confirms: [
    "기계적 주기성을 가진 비콘 통신",
    "비정상적으로 오래 유지되는 외부 연결",
    "정상 프로토콜을 악용한 은닉 C2 채널",
  ],
  looks: [
    {
      title: "비콘(Beacon) 통신",
      body: "특정 외부 서버로 일정한 간격의 신호가 반복되는 기계적 주기성을 확인합니다.",
    },
    {
      title: "장기 지속 세션(Long Session)",
      body: "업무 통신보다 비정상적으로 오래 유지되는 외부 연결 세션을 확인합니다.",
    },
    {
      title: "정상 프로토콜을 악용한 은닉 채널",
      body: "DNS, HTTPS, ICMP 등 정상 프로토콜 안에 숨겨진 C2 통신 여부를 확인합니다.",
    },
  ],
};

const lateralDetail: PerspectiveDetail = {
  reason:
    "초기 침투에 성공한 공격자는 핵심 데이터와 권한을 확보하기 위해 내부망을 가로질러 이동합니다. 내부 관리 프로토콜과 인증 패턴의 변화를 통해 확산 흔적을 확인합니다.",
  confirms: [
    "비정상적인 내부 관리 프로토콜 접근",
    "내부망 정찰을 위한 대규모 스캔",
    "탈취 계정을 이용한 비인가 접근",
  ],
  looks: [
    {
      title: "내부 관리 프로토콜",
      body: "RDP·SMB·SSH·WMI 등에서 평소 없던 접근이나 비정상 시간대 접속을 확인합니다.",
    },
    {
      title: "내부 정찰",
      body: "특정 호스트가 짧은 시간 안에 다수 내부 IP로 연결을 시도하는 스캔성 패턴을 확인합니다.",
    },
    {
      title: "계정 탈취·권한 상승",
      body: "인증 성공·실패 패턴과 비정상적인 인증 요청 구조를 확인합니다.",
    },
  ],
};

const centralAssetDetail: PerspectiveDetail = {
  reason:
    "AD 서버, 모니터링 서버, 소프트웨어 배포 시스템 같은 중앙관리형 자산이 공격자의 거점이 되면 내부 전체로 악성 행위가 확산될 수 있습니다.",
  confirms: [
    "평시 대비 신규 외부 연결",
    "연결 빈도·전송량의 비정상적 변화",
    "업무 시간 외 아웃바운드 증가",
  ],
  looks: [
    {
      title: "평시 연결 대상의 신규 변화",
      body: "기존에 연결하지 않던 외부 IP·도메인과의 통신이 생겼는지 확인합니다.",
    },
    {
      title: "연결 빈도·데이터 규모 변화",
      body: "평시 대비 연결 빈도나 아웃바운드 데이터가 비정상적으로 증가했는지 확인합니다.",
    },
    {
      title: "연결 시간대·방향성 변화",
      body: "심야·주말 등 업무 외 시간대의 비정상적인 외부 연결 증가를 확인합니다.",
    },
  ],
};

const intelDetail: PerspectiveDetail = {
  reason:
    "실제 침해사고에서 확인된 공격 인프라는 다른 공격에도 반복적으로 재사용될 수 있습니다. 내부 통신과 알려진 공격 인프라의 연결 여부를 비교합니다.",
  confirms: [
    "C2 서버와의 직접 통신",
    "악성코드 배포 서버와의 연결",
    "반복 확인된 공격 그룹 인프라와의 연결",
  ],
  looks: [
    {
      title: "알려진 C2 서버·악성 도메인",
      body: "침해사고에서 확인된 IP·도메인과 내부 시스템의 아웃바운드 통신을 비교합니다.",
    },
    {
      title: "악성코드 배포 서버",
      body: "알려진 배포 인프라에서 파일을 내려받는 통신이 있었는지 확인합니다.",
    },
    {
      title: "공격 그룹 인프라",
      body: "반복적으로 재사용된 공격 그룹의 IP 대역·도메인과 연결되는지 확인합니다.",
    },
  ],
};

const evasionDetail: PerspectiveDetail = {
  reason:
    "공격자는 기존 보안 장비의 가시성을 피하기 위해 승인되지 않은 원격제어 도구, VPN, 암호화 터널, 허용 포트 등을 악용할 수 있습니다.",
  confirms: [
    "비인가 원격제어 소프트웨어 사용",
    "정책 외 VPN·암호화 터널 통신",
    "표준 포트에서의 비정상 프로토콜",
  ],
  looks: [
    {
      title: "원격제어 소프트웨어",
      body: "기업 정책에서 승인되지 않은 원격제어 소프트웨어 사용 여부를 확인합니다.",
    },
    {
      title: "비인가 VPN·암호화 터널",
      body: "공식적으로 사용하지 않는 VPN 프로토콜이나 암호화 터널 통신을 확인합니다.",
    },
    {
      title: "포트 우회",
      body: "HTTP 80, HTTPS 443, DNS 53 등 허용 포트 안에 숨겨진 비정상 통신을 확인합니다.",
    },
  ],
};

const dataMoveDetail: PerspectiveDetail = {
  reason:
    "데이터 유출은 한 번의 대용량 전송이 아니라 장기 세션이나 누적 흐름으로도 나타납니다. 통신 방향과 세션 특성의 변화를 함께 확인합니다.",
  confirms: [
    "장기 세션의 일방적 데이터 누적",
    "아웃바운드 중심의 통신 방향 역전",
    "특정 외부 목적지로의 누적 집중",
  ],
  looks: [
    {
      title: "장기 세션 내 데이터 누적",
      body: "오랜 시간 유지되는 연결에서 특정 외부 목적지로 데이터가 누적되는지 확인합니다.",
    },
    {
      title: "통신 방향별 데이터 이동량 역전",
      body: "정상 서비스 흐름과 달리 아웃바운드 데이터가 현저히 증가하는지 확인합니다.",
    },
    {
      title: "특정 목적지로의 누적 전송",
      body: "개별 세션은 작아 보여도 일정 기간 같은 목적지로 누적되는 전송량을 확인합니다.",
    },
  ],
};

const networkChangeDetail: PerspectiveDetail = {
  reason:
    "앞선 관점들이 구체적인 공격 행위의 흔적을 본다면, 망 변화 평가는 전체 환경에서 ‘무언가 달라졌다’는 신호를 확인합니다.",
  confirms: [
    "평시 대비 전체 통신량의 단기 급증",
    "특정 프로토콜 비중의 급격한 변화",
    "시간대·요일별 평시 패턴의 장기적 변화",
  ],
  looks: [
    {
      title: "네트워크 통신량 급증",
      body: "특정 시점을 기준으로 전체 트래픽 규모가 평시 대비 크게 변하는지 확인합니다.",
    },
    {
      title: "프로토콜 분포 역전",
      body: "평소 미미하던 프로토콜의 비중이 갑자기 커지는 등 분포 변화를 확인합니다.",
    },
    {
      title: "평소 트래픽 패턴 변화",
      body: "시간대별·요일별로 유지되던 트래픽 수준과 흐름이 장기적으로 달라지는지 확인합니다.",
    },
  ],
};

export const perspectivesPage = {
  eyebrow: "ZeroTiCA의 검증 관점",
  titleAccent: "여덟가지 관점",
  titleAfter: "으로",
  titleLine2: "침해 가능성을 확인합니다.",
  lead: "실제 침해사고에서 반복적으로 나타난 정황을 8가지 관점으로 확인합니다. 서로 다른 관점으로 교차 검증하고, 전문가가 현재 침해 여부를 판단합니다.",
  backLabel: "소개로 돌아가기",
  detailLabels: {
    reason: "이 관점이 필요한 이유",
    confirm: "이 관점에서 확인할 수 있는 것",
    look: "무엇을 보는가",
  },
  groups: [
    {
      label: "경계 지점 평가",
      heading: "공격이 경계를 넘었는지, 연결이 남아 있는지",
      items: [
        {
          num: "01",
          title: "인바운드 위협 평가",
          bodyParts: [
            { text: "웹셸·크리덴셜 스터핑·파라미터 변조 등 " },
            { text: "외부에서 경계를 넘어온 공격이 성공한 흔적이 있는가?", emphasis: true },
          ],
          detail: inboundDetail,
        },
        {
          num: "02",
          title: "아웃바운드 백도어 평가",
          bodyParts: [
            { text: "해커가 지속 접근을 위해 심어놓은 백도어 채널이 지금도 " },
            { text: "내부에서 외부로 살아있는가?", emphasis: true },
          ],
          detail: outboundDetail,
        },
      ],
    },
    {
      label: "내부망 평가",
      heading: "공격이 내부에서 어떻게 움직이는지",
      items: [
        {
          num: "03",
          title: "측면이동 평가",
          bodyParts: [
            { text: "침투에 성공한 " },
            { text: "공격자가 내부 시스템 사이를 횡단하며 확산하고 있는가?", emphasis: true },
          ],
          detail: lateralDetail,
        },
        {
          num: "04",
          title: "중앙관리형 자산 평가",
          bodyParts: [
            { text: "인터넷 연결성이 높은 " },
            { text: "중앙관리형 자산의 연결 특성에 평시와 다른 이상 변화가 나타나고 있는가?", emphasis: true },
          ],
          detail: centralAssetDetail,
        },
      ],
    },
    {
      label: "위협 연결 평가",
      heading: "알려진 위협과 연결되는지, 보안의 시야를 피하는지",
      items: [
        {
          num: "05",
          title: "위협 인텔리전스 평가",
          bodyParts: [
            { text: "실제 해킹 사고에 악용된 C2 서버·악성 도메인과 " },
            { text: "내부 시스템이 지금 통신하고 있는가?", emphasis: true },
          ],
          detail: intelDetail,
        },
        {
          num: "06",
          title: "보안통제 우회 평가",
          bodyParts: [
            { text: "원격제어 소프트웨어·비인가 VPN 등 " },
            { text: "보안의 가시성을 의도적으로 무력화시키는 행위가 존재하는가?", emphasis: true },
          ],
          detail: evasionDetail,
        },
      ],
    },
    {
      label: "이상 징후 평가",
      heading: "데이터와 네트워크가 평소와 달라졌는지",
      items: [
        {
          num: "07",
          title: "데이터 이동 평가",
          bodyParts: [
            { text: "장기 세션 내 데이터 누적, 통신 방향 역전 등 " },
            { text: "정상적인 서비스와 다른 비정상적인 데이터 이동 특성이 나타나고 있는가?", emphasis: true },
          ],
          detail: dataMoveDetail,
        },
        {
          num: "08",
          title: "망 변화 평가",
          bodyParts: [
            { text: "네트워크 통신량의 급증, 프로토콜 분포의 역전, 평소 트래픽 패턴의 무너짐 등 " },
            { text: "내부 네트워크에 전반적인 이상 변화가 발생하고 있는가?", emphasis: true },
          ],
          detail: networkChangeDetail,
        },
      ],
    },
  ] satisfies PerspectiveGroup[],
} as const;
