import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { ContactCTA } from "@/components/ContactCTA";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/data/content";

export function ContactPage() {
  return (
    <div className="zt-container zt-section">
      <p className="text-sm font-semibold text-blue-600">문의</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900">도입·상담 문의</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        {site.brandKo} 인사이트·와치 서비스 도입, PoC, 견적, 기술 상담을 요청하실 수 있습니다.
        소개 페이지를 먼저 읽으신 뒤 문의해 주시면 상담이 더 수월합니다.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="zt-card p-8">
          <h2 className="text-lg font-bold text-slate-900">문의 양식</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="zt-card p-8">
            <h2 className="text-lg font-bold text-slate-900">연락처</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium">이메일</p>
                  <a href={`mailto:${site.contactEmail}`} className="text-blue-600 hover:underline">
                    {site.contactEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium">전화</p>
                  <a href={`tel:${site.contactPhone.replace(/-/g, "")}`} className="text-blue-600 hover:underline">
                    {site.contactPhone}
                  </a>
                  <p className="mt-1 text-slate-500">평일 09:00–18:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="zt-card p-8">
            <h2 className="text-lg font-bold text-slate-900">아직 소개를 안 보셨다면</h2>
            <p className="mt-3 text-sm text-slate-600">
              서비스 흐름과 RUNA 역할을 스크롤로 먼저 확인하신 뒤, 마지막 체험 섹션에서 데모를
              열어보실 수 있습니다.
            </p>
            <Link to="/#experience" className="zt-btn-ghost mt-4 text-sm">
              소개 페이지 · 체험 섹션으로 →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <ContactCTA variant="banner" className="rounded-2xl" />
      </div>
    </div>
  );
}
