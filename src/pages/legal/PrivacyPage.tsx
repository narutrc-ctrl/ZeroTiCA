import { Link } from "react-router-dom";
import { site } from "@/data/content";

export function PrivacyPage() {
  return (
    <div className="zt-container zt-section max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900">개인정보처리방침</h1>
      <p className="mt-4 text-sm text-slate-500">시행일: 2026년 1월 1일</p>
      <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
        <p>
          {site.companyLegalName}(이하 「회사」)는 {site.brandKo} 서비스 이용과 관련하여 개인정보보호법 등
          관련 법령을 준수하며, 이용자의 개인정보를 보호합니다.
        </p>
        <h2 className="mt-8 text-lg font-bold text-slate-900">1. 수집하는 개인정보 항목</h2>
        <p>도입 문의 시: 회사명, 담당자 성명, 이메일, 연락처, 문의 내용</p>
        <h2 className="mt-8 text-lg font-bold text-slate-900">2. 이용 목적</h2>
        <p>서비스 상담·견적 안내, 계약 이행, 고객 지원</p>
        <h2 className="mt-8 text-lg font-bold text-slate-900">3. 문의</h2>
        <p>
          개인정보 관련 문의:{" "}
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
