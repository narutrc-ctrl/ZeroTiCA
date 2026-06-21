# Zerotica 소개·데모 페이지

제로티카 공식 홈페이지용 **독립 프론트엔드 프로젝트**입니다.  
`back_cylee2` 등 RUNA 백엔드 저장소와 분리되어 있으며, 백엔드 없이 정적 사이트로 동작합니다.

## 실행

```bash
cd /data/cylee2/zerotica-intro   # 또는 본인 환경의 프로젝트 경로
npm install
npm run dev
```

브라우저: http://localhost:5174

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 인트로·통계·가치 제안·클로징 |
| `/services` | 인사이트 / 와치 서비스 소개 |
| `/process` | 수집 → 탐지 → 검증 → 조치 → 보고 흐름 |
| `/screens` | RUNA 화면 예시·근거 자료·미리보기 |
| `/demo/task` | 업무 관리 데모 + 가이드 투어 |
| `/demo/event` | 단계별 요약 데모 |
| `/demo/event?tab=reports` | 침해 평가 보고서 데모 |

데모 데이터는 실제 고객사 5월 업무·보고서 **유형**을 참고했으나, 회사명·IP·관리코드는 `DEMO-2026-05-xxx` 등 **가상값으로 치환**되어 있습니다 (`src/data/demo-runa-data.ts`).

## 인터랙티브 가이드

데모 페이지에서 **「가이드 시작」** 또는 URL `?tour=1&step=0` 로 화면별 안내를 시작할 수 있습니다.  
**전체 투어**는 `/demo/task?tour=full&step=0` — 업무 → 이벤트 → 보고서 순으로 페이지가 이동하며 12단계 가이드가 이어집니다.

## 빌드

```bash
npm run build
npm run preview
```

산출물: `dist/` — 정적 호스팅 가능

## 문구 톤

인트로 등 주요 문구는 **격식체**(「알고 계십니까?」「~하십시오」)를 사용했습니다.

## 실제 RUNA 연동

현재는 RUNA UI를 **모사한 데모**입니다. `front_cylee2`의 실제 스크린샷을 넣으려면 `public/screenshots/`에 이미지를 추가하고 데모 페이지에서 교체하십시오.
