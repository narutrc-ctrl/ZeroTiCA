# SEO TODO (즉시 적용용)

## 파일별 체크

- `src/seo/pages.ts`
  - indexable 페이지의 title/description/canonical 원본
  - 빌드 시 `dist/*.html`, `dist/sitemap.xml`, CloudFront SPA router 생성
- `index.html`
  - 홈 템플릿. 배포 HTML head는 `pages.ts` 기준으로 stamp
  - OG/Twitter 이미지 URL가 실제 파일과 일치하는지 확인
- `public/robots.txt`
  - 운영 도메인 sitemap URL 반영

## 운영 체크

- Google Search Console + 네이버 서치어드바이저에 도메인 등록
- `https://zerotica.narusec.com/sitemap.xml` 제출
- 브랜드 키워드(제로티카/ZeroTica)로 title/description CTR 모니터링
- Core Web Vitals(LCP/CLS/INP) 월 1회 점검
