import nodemailer from "nodemailer";

/**
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env
 */
export function getMailEnv(env = process.env) {
  const useSsl = String(env.EMAIL_USE_SSL ?? "true").toLowerCase() === "true";
  const useTls = String(env.EMAIL_USE_TLS ?? "false").toLowerCase() === "true";
  return {
    host: env.EMAIL_HOST || "outbound.daouoffice.com",
    port: Number(env.EMAIL_PORT || 465),
    secure: useSsl,
    requireTLS: useTls && !useSsl,
    user: env.EMAIL_HOST_USER || "",
    pass: env.EMAIL_HOST_PASSWORD || "",
    from: env.DEFAULT_FROM_EMAIL || env.EMAIL_HOST_USER || "",
    to: String(env.CONTACT_INQUIRY_TO || "").trim(),
  };
}

/**
 * @param {unknown} body
 * @returns {{ ok: true, data: {
 *   company: string, name: string, email: string, phone: string, message: string, privacyAgreed: boolean
 * }} | { ok: false, error: string, details?: Record<string, string> }}
 */
export function validateInquiry(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "잘못된 요청입니다." };
  }

  /** @type {Record<string, unknown>} */
  const raw = /** @type {Record<string, unknown>} */ (body);
  const details = {};

  const company = String(raw.company ?? "").trim();
  const name = String(raw.name ?? "").trim();
  const email = String(raw.email ?? "").trim();
  const phone = String(raw.phone ?? "").trim();
  const message = String(raw.message ?? "").trim();

  if (company.length > 200) details.company = "회사명을 확인해 주세요.";
  if (name.length > 100) details.name = "담당자명을 확인해 주세요.";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    details.email = "이메일을 확인해 주세요.";
  }
  if (phone.length > 50) details.phone = "연락처를 확인해 주세요.";
  if (!message || message.length > 5000) details.message = "문의 내용을 확인해 주세요.";
  if (raw.privacyAgreed !== true) {
    details.privacyAgreed = "개인정보 수집 및 이용에 동의해 주세요.";
  }

  if (Object.keys(details).length > 0) {
    return { ok: false, error: "입력값을 확인해 주세요.", details };
  }

  return {
    ok: true,
    data: {
      company,
      name,
      email,
      phone,
      message,
      privacyAgreed: true,
    },
  };
}

/**
 * @param {{
 *   company: string, name: string, email: string, phone: string, message: string, privacyAgreed: boolean
 * }} data
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env
 */
export async function sendContactInquiry(data, env = process.env) {
  const cfg = getMailEnv(env);

  if (!cfg.to) {
    throw new Error("CONTACT_INQUIRY_TO is not configured");
  }
  if (!cfg.from || !cfg.user || !cfg.pass) {
    throw new Error("EMAIL settings incomplete");
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    requireTLS: cfg.requireTLS,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  const contactLabel = [data.company, data.name].filter(Boolean).join(" / ") || data.email;
  const subject = `[제로티카] 도입 문의 — ${contactLabel}`;
  const text = [
    "제로티카 소개 사이트에서 도입 문의가 접수되었습니다.",
    "",
    `회사명: ${data.company || "미입력"}`,
    `담당자: ${data.name || "미입력"}`,
    `이메일: ${data.email}`,
    `연락처: ${data.phone || "미입력"}`,
    `개인정보 동의: ${data.privacyAgreed ? "동의" : "미동의"}`,
    "",
    "문의 내용:",
    data.message,
  ].join("\n");

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    replyTo: data.email,
    subject,
    text,
  });
}
