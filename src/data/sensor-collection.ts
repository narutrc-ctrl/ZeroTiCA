/** 센서 · 네트워크 미러링 — back/ front 실제 구조 기반 */

export const sensorCollectionSection = {
  eyebrow: "STEP 01",
  title: "먼저, 네트워크 트래픽을",
  titleAccent: "미러링으로 수집합니다",
  lead:
    "제로티카는 고객망 스위치·라우터의 SPAN/TAP(미러 포트)으로 복제된 트래픽을 센서에서 수동(passive)으로 관측합니다. 인라인 장비처럼 트래픽을 끊거나 변경하지 않습니다.",
  points: [
    {
      title: "패시브(수동) 관측",
      body: "미러링된 트래픽만 복사해 Zeek 센서가 conn·HTTP·DNS·SSL·SMB 등 프로토콜 로그로 기록합니다.",
    },
    {
      title: "다중 센서",
      body: "망 구간·지점별로 s1, s2 등 센서를 두고, 분석 서버로 일별 로그(gz)를 전송·집계합니다.",
    },
    {
      title: "수집 상태 가시성",
      body: "대시보드의 「데이터 수집 상태」 카드에서 날짜·센서별 conn 수집 여부를 확인합니다.",
    },
  ],
  flowSteps: [
    { label: "코어·백본 스위치", sub: "SPAN / TAP 미러 포트" },
    { label: "Zeek 센서", sub: "conn · http · dns · ssl …" },
    { label: "분석 서버", sub: "전처리 · 분석 · 포털" },
  ],
};
