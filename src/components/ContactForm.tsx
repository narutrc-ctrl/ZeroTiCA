import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

type SubmitState = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";

function RequiredMark() {
  return (
    <span className="ml-0.5 text-blue-500" aria-hidden>
      *
    </span>
  );
}

/** 숫자만 추출 후 010-1234-5678 / 02-1234-5678 형태로 하이픈 삽입 */
function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  // 서울 02: 02-XXX-XXXX ~ 02-XXXX-XXXX
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  // 휴대폰·기타 지역: 0XX-XXXX-XXXX
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function ContactForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!privacyAgreed) {
      setStatus("error");
      setErrorMessage("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          company,
          name,
          email,
          phone,
          message,
          privacyAgreed: true,
        }),
      });

      let payload: { error?: string; message?: string } = {};
      try {
        payload = (await res.json()) as { error?: string; message?: string };
      } catch {
        /* non-JSON body */
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(payload.error || "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setStatus("success");
      setCompany("");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setPrivacyAgreed(false);
      window.setTimeout(() => onSubmitted?.(), 1400);
    } catch {
      setStatus("error");
      setErrorMessage("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
    }
  };

  const disabled = status === "sending";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block text-sm">
        <span className="mb-1.5 flex items-center font-medium text-slate-700">
          회사명
          <RequiredMark />
        </span>
        <input
          required
          disabled={disabled}
          className={fieldClass}
          placeholder="회사명을 입력해주세요"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 flex items-center font-medium text-slate-700">
          담당자명
          <RequiredMark />
        </span>
        <input
          required
          disabled={disabled}
          className={fieldClass}
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 flex items-center font-medium text-slate-700">
          업무 이메일
          <RequiredMark />
        </span>
        <input
          required
          type="email"
          disabled={disabled}
          className={fieldClass}
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 flex items-center font-medium text-slate-700">
          연락처
          <RequiredMark />
        </span>
        <input
          required
          disabled={disabled}
          className={fieldClass}
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          autoComplete="tel"
          inputMode="numeric"
          maxLength={13}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 flex items-center font-medium text-slate-700">
          문의 내용
          <RequiredMark />
        </span>
        <textarea
          required
          rows={5}
          disabled={disabled}
          className={cn(fieldClass, "min-h-[120px] resize-y")}
          placeholder="현재 고민하고 있는 보안 문제나 궁금한 점을 자유롭게 남겨주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <span className="mt-2 block text-xs leading-relaxed text-slate-400">
          네트워크 규모나 희망 일정 등 정해진 내용이 있다면 함께 알려주시면 상담에 도움이 됩니다.
        </span>
      </label>

      <div className="flex items-start justify-between gap-3 pt-1">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            required
            disabled={disabled}
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            개인정보 수집 및 이용에 동의합니다.{" "}
            <span className="text-slate-500">(필수)</span>
          </span>
        </label>
        <Link
          to="/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          자세히 보기
        </Link>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="zt-btn-primary w-full py-3.5 text-[15px] disabled:opacity-60"
      >
        {status === "sending" ? "전송 중…" : "도입 문의하기"}
      </button>

      {status === "success" ? (
        <p className="text-center text-sm text-emerald-600">
          문의가 접수되었습니다. 담당자가 연락드리겠습니다.
        </p>
      ) : null}
      {status === "error" ? <p className="text-center text-sm text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
