# ZeroTiCA Astro 이전

브랜치: `astro-ssg`  
목적: CSR SPA → Astro SSG + React islands (검색/LLM이 본문 HTML을 읽도록)  
Node: **22+** (`.nvmrc`) — Astro 5 / 통합 패키지 기준

## 진행 상태

| Phase | 상태 | 커밋 메모 |
|-------|------|-----------|
| 0 기준 고정 | 완료 | `docs/astro-migration.md` |
| 1 뼈대 | 완료 | Astro 5 + BaseLayout + 임시 홈 HTML |
| 2 공통 껍데기 | 완료 | SiteShell(헤더/푸터/문의 모달) |
| 3 정적 페이지 | 완료 | privacy / perspectives / contact |
| 4 홈 | 완료(1차) | LandingPage SSR island — 이후 섹션 분해 가능 |
| 5 데모 | 완료 | DemoIsland(client:load SSR) + noindex task/event/report |
| 6 CF·sitemap·레거시 | 완료 | sitemap·CF allowlist(/contact)·호환 리다이렉트·Vite SPA 보조화 |

## Phase 0 — 기준 (고정)

### 도메인·SEO 원본

| 항목 | 값 |
|------|-----|
| Origin | `https://zerotica.narusec.com` |
| Canonical | **슬래시 없음** (`/perspectives`, `/legal/privacy`) — 기존 CloudFront 301과 동일 |
| Sitemap | `https://zerotica.narusec.com/sitemap.xml` |
| 소유확인 | `public/googlef314e83fff277bc2.html`, `public/naver113479677c59e8bd63b8b4326c603f55.html` 유지 |

### URL 목록

**indexable (sitemap + index,follow)**

| Path | 비고 |
|------|------|
| `/` | 홈 |
| `/perspectives` | 검증 관점 |
| `/legal/privacy` | 개인정보 처리방침 |

**공개·동작 유지, noindex**

| Path | 비고 |
|------|------|
| `/demo/task` | 데모 |
| `/demo/event` | 데모 |
| `/demo/report` | `/demo/event?tab=reports` 리다이렉트 유지 |

**호환 라우트**

| Path | 비고 |
|------|------|
| `/contact` | 모달 오픈 후 `/`로 이동. CF allowlist에 포함(Function 갱신 시) |

### 빌드 출력 형식 (CloudFront 정합)

- 기존: `/perspectives` → S3 `perspectives.html`
- Astro: `build.format = 'file'` 로 **같은 `{path}.html` 출력** 유지
- trailing slash URL → 301 to slashless (기존 spa-router 정책 유지)
- 알 수 없는 extensionless URL → 하드 404 (soft 404 금지)

### 유지하는 것

- Tailwind + 기존 디자인/카피 (임의 리디자인 금지)
- `src/data/*`, analytics, 문의 API(`/api/contact` + Lambda)
- `public/` 정적 자산·인증 HTML·robots.txt
- S3 + CloudFront 정적 배포

### 단계적으로 옮기는 것

1. Astro 뼈대
2. 헤더/푸터/문의 모달 island
3. privacy → perspectives → contact
4. 홈 섹션 단위 (바다 HTML + 섬 React)
5. 데모 (큰 React 섬, noindex)
6. CF router / sitemap / Vite SPA 레거시 정리
7. GSC·네이버 sitemap 재제출 (운영)

### Phase 6 — CF·sitemap·레거시 (요약)

- `npm run build` → Astro HTML + `strip-html-nulls` + `sync-hosting` (`dist/sitemap.xml`, `infra/cloudfront/spa-router.js`)
- CF allowlist: `/contact` 포함. `/demo/report` → `/demo/event?tab=reports` 301
- 로컬/정적: `demo/report.astro` CompatRedirect

- Vite SPA (`dev:spa` / `build:spa`) 는 **비상·레거시** 경로. 기본 배포는 Astro `build`
- 운영 배포 후: `npm run apply:cloudfront` 로 Function 갱신, GSC·네이버 sitemap 재제출은 Phase 7

### Phase 완료 시

- Phase마다 커밋
- `build` 성공 + 해당 URL 소스에 본문(또는 뼈대) 확인
