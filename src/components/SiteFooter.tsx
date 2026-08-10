import { Link } from "react-router-dom";
import { site } from "@/data/content";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-1 text-[13px] leading-relaxed sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-1 sm:text-[14px]">
      <dt className="shrink-0 text-[#9ca3af]">{label}</dt>
      <dd className="min-w-0 text-left text-[#e5e7eb] [word-break:keep-all]">{value}</dd>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#2c2e35] text-white">
      <div className="zt-container-hero py-7 sm:py-8 lg:py-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-md shrink-0">
            <img
              src="/ZeroTiCA-BI-01.svg"
              alt="ZeroTiCA"
              width={88}
              height={16}
              className="h-6 w-auto sm:h-[1.625rem]"
              decoding="async"
            />
            <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-[#9ca3af] [word-break:keep-all] sm:text-[15px]">
              {site.footerTagline}
            </p>
          </div>

          <div className="min-w-0 space-y-2.5 lg:ml-auto">
            <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 lg:gap-32">
              <dl className="min-w-0 space-y-2.5">
                <InfoRow label="상호" value={site.companyLegalName} />
                <InfoRow label="대표이사" value={site.companyCeo} />
              </dl>
              <dl className="min-w-0 space-y-2.5">
                <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-1 text-[13px] leading-relaxed sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-1 sm:text-[14px]">
                  <dt className="shrink-0 text-[#9ca3af]">이메일</dt>
                  <dd className="min-w-0 text-left text-[#e5e7eb] break-all">
                    <a
                      href={`mailto:${site.contactEmail}`}
                      className="underline-offset-2 transition-colors hover:text-white hover:underline"
                    >
                      {site.contactEmail}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-1 text-[13px] leading-relaxed sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-1 sm:text-[14px]">
                  <dt className="shrink-0 text-[#9ca3af]">전화</dt>
                  <dd className="min-w-0 text-left text-[#e5e7eb]">
                    <a
                      href={`tel:${site.contactPhone.replace(/-/g, "")}`}
                      className="underline-offset-2 transition-colors hover:text-white hover:underline"
                    >
                      {site.contactPhone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <dl className="min-w-0">
              <InfoRow label="주소" value={site.companyAddress} />
            </dl>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-2 text-[12px] sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-2 sm:text-[13px]">
          <Link to="/legal/privacy" className="text-[#9ca3af] transition-colors hover:text-white">
            개인정보 처리방침
          </Link>
          <Link to="/legal/terms" className="text-[#9ca3af] transition-colors hover:text-white">
            서비스 이용약관
          </Link>
        </div>

        <p className="mt-8 text-center text-[12px] text-[#6b7280] sm:mt-9">
          © {new Date().getFullYear()} {site.copyrightEntity}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
