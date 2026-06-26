import { useState, type FormEvent } from "react";
import { site } from "@/data/content";

export function ContactForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("와치");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = [
      `회사명: ${company}`,
      `담당자: ${name}`,
      `이메일: ${email}`,
      `연락처: ${phone}`,
      `관심 서비스: ${service}`,
      "",
      message,
    ].join("\n");
    const url = `mailto:${site.contactEmail}?subject=${encodeURIComponent("[제로티카] 도입 문의")}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    onSubmitted?.();
  };

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">회사명</span>
          <input required className={fieldClass} value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">담당자명</span>
          <input required className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">이메일</span>
          <input
            required
            type="email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">연락처</span>
          <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">관심 서비스</span>
        <select className={fieldClass} value={service} onChange={(e) => setService(e.target.value)}>
          <option>인사이트</option>
          <option>와치</option>
          <option>미정 / 상담 후 결정</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">문의 내용</span>
        <textarea
          required
          rows={4}
          className={fieldClass}
          placeholder="네트워크 규모, 희망 일정(PoC/본 도입) 등을 적어 주시면 상담에 도움이 됩니다."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button type="submit" className="zt-btn-primary w-full sm:w-auto">
        문의 내용 보내기
      </button>
      <p className="text-xs text-slate-500">제출 시 기본 메일 앱이 열립니다.</p>
    </form>
  );
}
