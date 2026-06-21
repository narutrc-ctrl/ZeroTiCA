import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { ContactInfo } from "@/components/ContactCTA";
import { site } from "@/data/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="zt-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <BrandLogo linked={false} />
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {site.runaDefinition}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">문의</p>
            <div className="mt-3">
              <ContactInfo />
            </div>
            <Link to="/contact" className="zt-btn-primary mt-4 text-xs">
              도입 문의하기
            </Link>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">회사 정보</p>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div>
                <dt className="inline font-medium text-slate-700">상호 </dt>
                <dd className="inline">{site.companyLegalName}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">주소 </dt>
                <dd className="inline">{site.companyAddress}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link to="/legal/privacy" className="text-slate-600 hover:text-blue-600">
                개인정보처리방침
              </Link>
              <Link to="/legal/terms" className="text-slate-600 hover:text-blue-600">
                이용약관
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {site.brandKo} ({site.brandEn}). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
