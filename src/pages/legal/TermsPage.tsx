import { Link } from "react-router-dom";
import { site } from "@/data/content";

export function TermsPage() {
  return (
    <div className="zt-container zt-section max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900">이용약관</h1>
      <p className="mt-4 text-sm text-slate-500">시행일: 2026년 1월 1일</p>
      <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
        <p>
          본 약관은 {site.companyLegalName}(이하 「회사」)가 제공하는 {site.brandKo}({site.brandEn})
          서비스의 이용 조건을 정합니다.
        </p>
        <h2 className="mt-8 text-lg font-bold text-slate-900">1. 서비스</h2>
        <p>
          회사는 네트워크 보안 모니터링·위협 분석·보고 서비스(인사이트, 와치)를 제공하며, 고객은
          계약에 따라 {site.productPortal} 고객 포털을 이용할 수 있습니다.
        </p>
        <h2 className="mt-8 text-lg font-bold text-slate-900">2. 문의</h2>
        <p>
          약관 관련 문의:{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-blue-600 hover:underline">
            {site.contactEmail}
          </a>
        </p>
      </div>
      <Link to="/" className="zt-btn-ghost mt-10">
        홈으로
      </Link>
    </div>
  );
}
