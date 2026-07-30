import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Watch");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ company, name, email, phone, service, message }),
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
      setService("Watch");
      setMessage("");
      window.setTimeout(() => onSubmitted?.(), 1400);
    } catch {
      setStatus("error");
      setErrorMessage("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">회사명</span>
          <input
            required
            disabled={status === "sending"}
            className={fieldClass}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">담당자명</span>
          <input
            required
            disabled={status === "sending"}
            className={fieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">이메일</span>
          <input
            required
            type="email"
            disabled={status === "sending"}
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">연락처</span>
          <input
            disabled={status === "sending"}
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">관심 서비스</span>
        <select
          disabled={status === "sending"}
          className={fieldClass}
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option>Insight</option>
          <option>Watch</option>
          <option>미정 / 상담 후 결정</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">문의 내용</span>
        <textarea
          required
          rows={4}
          disabled={status === "sending"}
          className={fieldClass}
          placeholder="네트워크 규모, 희망 일정(PoC/본 도입) 등을 적어 주시면 상담에 도움이 됩니다."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button type="submit" disabled={status === "sending"} className="zt-btn-primary w-full sm:w-auto disabled:opacity-60">
        {status === "sending" ? "전송 중…" : "문의 내용 보내기"}
      </button>
      {status === "success" ? (
        <p className="text-xs text-emerald-600">문의가 접수되었습니다. 담당자가 연락드리겠습니다.</p>
      ) : null}
      {status === "error" ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
      {status === "idle" ? (
        <p className="text-xs text-slate-500">제출하시면 담당자 이메일로 문의 내용이 전달됩니다.</p>
      ) : null}
    </form>
  );
}
