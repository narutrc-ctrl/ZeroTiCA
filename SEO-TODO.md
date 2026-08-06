# SEO TODO (즉시 적용용)

## 파일별 체크

- `index.html`
  - title/description/canonical/hreflang/JSON-LD 유지
  - OG/Twitter 이미지 URL가 실제 파일과 일치하는지 확인
- `public/robots.txt`
  - 운영 도메인 sitemap URL 반영
- `public/sitemap.xml`
  - 운영 중인 모든 공개 URL 포함 (`/`, `/ko-kr`, `/en-us`, 데모 페이지)
- `vercel.json`
  - SPA 라우팅 새로고침 404 방지를 위한 rewrite 유지

## 운영 체크

- Google Search Console + 네이버 서치어드바이저에 도메인 등록
- `https://zerotica.narusec.com/sitemap.xml` 제출
- 브랜드 키워드(제로티카/ZeroTica)로 title/description CTR 모니터링
- Core Web Vitals(LCP/CLS/INP) 월 1회 점검
