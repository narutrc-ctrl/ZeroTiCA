import { validateInquiry, sendContactInquiry } from "../../api/_lib/sendMail.js";

/** Inquiry JSON is small; 32KB leaves headroom over field max lengths. */
export const MAX_BODY_BYTES = 32 * 1024;

/**
 * @param {number} statusCode
 * @param {Record<string, unknown>} payload
 */
function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  };
}

/**
 * @param {unknown} err
 */
function logSendFailure(err) {
  const name = err && typeof err === "object" && "name" in err ? err.name : "Error";
  const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
  console.error("[contact] send failed:", code ? `${name} (${code})` : String(name));
}

/**
 * @param {string | undefined} rawBody
 * @param {boolean} isBase64
 * @returns {{ ok: true, bytes: Buffer } | { ok: false, response: ReturnType<typeof jsonResponse> }}
 */
function decodeBody(rawBody, isBase64) {
  if (rawBody == null || rawBody === "") {
    return { ok: true, bytes: Buffer.alloc(0) };
  }

  try {
    const bytes = isBase64 ? Buffer.from(rawBody, "base64") : Buffer.from(rawBody, "utf8");
    return { ok: true, bytes };
  } catch {
    return {
      ok: false,
      response: jsonResponse(400, { error: "잘못된 JSON 요청입니다." }),
    };
  }
}

/**
 * API Gateway HTTP API (payload format 2.0) adapter.
 * Validation and SMTP stay in api/_lib/sendMail.js.
 *
 * @param {Record<string, any>} event
 * @param {{
 *   validateInquiry?: typeof validateInquiry,
 *   sendContactInquiry?: typeof sendContactInquiry,
 * }} [deps]
 */
export async function handleContactEvent(
  event,
  deps = { validateInquiry, sendContactInquiry },
) {
  const method = event?.requestContext?.http?.method || event?.requestContext?.httpMethod || "";
  if (String(method).toUpperCase() !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const decoded = decodeBody(event?.body, Boolean(event?.isBase64Encoded));
  if (!decoded.ok) return decoded.response;

  if (decoded.bytes.length > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "요청 본문이 너무 큽니다." });
  }

  let body;
  try {
    const raw = decoded.bytes.toString("utf8").trim();
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return jsonResponse(400, { error: "잘못된 JSON 요청입니다." });
  }

  const validate = deps.validateInquiry || validateInquiry;
  const send = deps.sendContactInquiry || sendContactInquiry;

  const validation = validate(body);
  if (!validation.ok) {
    return jsonResponse(400, { error: validation.error, details: validation.details });
  }

  try {
    await send(validation.data);
    return jsonResponse(200, { ok: true, message: "문의가 접수되었습니다." });
  } catch (err) {
    logSendFailure(err);
    return jsonResponse(502, {
      error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}

export const handler = async (event) => handleContactEvent(event);
