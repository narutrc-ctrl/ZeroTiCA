import assert from "node:assert/strict";
import test from "node:test";
import { validateInquiry, getMailEnv } from "../api/_lib/sendMail.js";
import { handleContactEvent, MAX_BODY_BYTES } from "../lambda/contact/handler.mjs";

const validPayload = {
  company: "나루씨큐리티",
  name: "홍길동",
  email: "name@company.com",
  phone: "010-1234-5678",
  message: "문의 내용입니다.",
  privacyAgreed: true,
};

function postEvent(body, { base64 = false, method = "POST" } = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return {
    version: "2.0",
    routeKey: "POST /api/contact",
    rawPath: "/api/contact",
    isBase64Encoded: base64,
    body: base64 ? Buffer.from(raw, "utf8").toString("base64") : raw,
    requestContext: {
      http: { method, path: "/api/contact", protocol: "HTTP/1.1", sourceIp: "127.0.0.1" },
    },
  };
}

test("validateInquiry accepts valid payload without service", () => {
  const result = validateInquiry(validPayload);
  assert.equal(result.ok, true);
  assert.equal(result.data.privacyAgreed, true);
  assert.equal("service" in result.data, false);
});

test("validateInquiry rejects empty phone", () => {
  const result = validateInquiry({ ...validPayload, phone: "   " });
  assert.equal(result.ok, false);
  assert.ok(result.details?.phone);
});

test("validateInquiry rejects missing phone", () => {
  const { phone: _omit, ...rest } = validPayload;
  const result = validateInquiry(rest);
  assert.equal(result.ok, false);
  assert.ok(result.details?.phone);
});

test("validateInquiry rejects privacyAgreed false / missing / non-boolean true", () => {
  for (const privacyAgreed of [false, null, undefined, "true", 1]) {
    const result = validateInquiry({ ...validPayload, privacyAgreed });
    assert.equal(result.ok, false, `expected fail for ${String(privacyAgreed)}`);
    assert.ok(result.details?.privacyAgreed);
  }
  const missing = { ...validPayload };
  delete missing.privacyAgreed;
  const result = validateInquiry(missing);
  assert.equal(result.ok, false);
  assert.ok(result.details?.privacyAgreed);
});

test("validateInquiry rejects missing required fields and invalid email", () => {
  assert.equal(validateInquiry({ ...validPayload, company: "" }).ok, false);
  assert.equal(validateInquiry({ ...validPayload, name: "" }).ok, false);
  assert.equal(validateInquiry({ ...validPayload, message: "" }).ok, false);
  assert.equal(validateInquiry({ ...validPayload, email: "not-an-email" }).ok, false);
});

test("getMailEnv requires CONTACT_INQUIRY_TO (no personal fallback)", () => {
  const cfg = getMailEnv({
    EMAIL_HOST_USER: "user@example.com",
    EMAIL_HOST_PASSWORD: "x",
  });
  assert.equal(cfg.to, "");
});

test("handler GET → 405", async () => {
  const res = await handleContactEvent(postEvent(validPayload, { method: "GET" }), {
    sendContactInquiry: async () => {
      throw new Error("should not send");
    },
  });
  assert.equal(res.statusCode, 405);
});

test("handler malformed JSON → 400", async () => {
  const res = await handleContactEvent(postEvent("{not-json", { method: "POST" }), {
    sendContactInquiry: async () => {
      throw new Error("should not send");
    },
  });
  assert.equal(res.statusCode, 400);
  assert.match(JSON.parse(res.body).error, /JSON/);
});

test("handler oversize body → 413", async () => {
  const huge = "x".repeat(MAX_BODY_BYTES + 1);
  const res = await handleContactEvent(postEvent(huge), {
    sendContactInquiry: async () => {
      throw new Error("should not send");
    },
  });
  assert.equal(res.statusCode, 413);
});

test("handler validation error → 400 (no SMTP)", async () => {
  const res = await handleContactEvent(postEvent({ ...validPayload, phone: "" }), {
    sendContactInquiry: async () => {
      throw new Error("should not send");
    },
  });
  assert.equal(res.statusCode, 400);
  const payload = JSON.parse(res.body);
  assert.equal(payload.error, "입력값을 확인해 주세요.");
  assert.ok(payload.details?.phone);
});

test("handler success → 200 with mocked sender", async () => {
  let called = false;
  const res = await handleContactEvent(postEvent(validPayload), {
    sendContactInquiry: async (data) => {
      called = true;
      assert.equal(data.company, validPayload.company);
      assert.equal(data.privacyAgreed, true);
    },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(called, true);
  assert.deepEqual(JSON.parse(res.body), {
    ok: true,
    message: "문의가 접수되었습니다.",
  });
});

test("handler SMTP failure → 502", async () => {
  const res = await handleContactEvent(postEvent(validPayload), {
    sendContactInquiry: async () => {
      const err = new Error("smtp down");
      err.name = "Error";
      err.code = "ESOCKET";
      throw err;
    },
  });
  assert.equal(res.statusCode, 502);
});

test("handler accepts base64-encoded body", async () => {
  const res = await handleContactEvent(postEvent(validPayload, { base64: true }), {
    sendContactInquiry: async () => {},
  });
  assert.equal(res.statusCode, 200);
});
