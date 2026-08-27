import { sendContactInquiry, validateInquiry } from "./_lib/sendMail.js";

function logSendFailure(err) {
  const name = err && typeof err === "object" && "name" in err ? err.name : "Error";
  const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
  console.error("[contact] send failed:", code ? `${name} (${code})` : String(name));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return res.status(400).json({ error: "잘못된 JSON 요청입니다." });
    }
  }

  const validation = validateInquiry(body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error, details: validation.details });
  }

  try {
    await sendContactInquiry(validation.data);
    return res.status(200).json({ ok: true, message: "문의가 접수되었습니다." });
  } catch (err) {
    logSendFailure(err);
    return res.status(502).json({
      error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}
