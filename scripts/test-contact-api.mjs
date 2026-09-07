import assert from "node:assert/strict";
import test from "node:test";
import {
  validateInquiry,
  getMailEnv,
  isMailConfig,
  resolveMailConfig,
} from "../api/_lib/sendMail.js";
import { handleContactEvent, MAX_BODY_BYTES } from "../lambda/contact/handler.mjs";
import {
  clearSmtpConfigCache,
  DAOUOOFFICE_TRANSPORT_DEFAULTS,
  loadSmtpConfigFromSsm,
  mailConfigFromSsmValues,
  SSM_PARAM_NAMES,
} from "../lambda/contact/ssmMailConfig.mjs";

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

test("validateInquiry accepts optional fields when omitted", () => {
  const result = validateInquiry({
    email: "name@company.com",
    message: "문의 내용입니다.",
    privacyAgreed: true,
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.company, "");
  assert.equal(result.data.name, "");
  assert.equal(result.data.phone, "");
  assert.equal(result.data.privacyAgreed, true);
});

test("validateInquiry accepts empty phone", () => {
  const result = validateInquiry({ ...validPayload, phone: "   " });
  assert.equal(result.ok, true);
  assert.equal(result.data.phone, "");
});

test("validateInquiry accepts missing phone", () => {
  const { phone: _omit, ...rest } = validPayload;
  const result = validateInquiry(rest);
  assert.equal(result.ok, true);
  assert.equal(result.data.phone, "");
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
  assert.equal(validateInquiry({ ...validPayload, company: "" }).ok, true);
  assert.equal(validateInquiry({ ...validPayload, name: "" }).ok, true);
  assert.equal(validateInquiry({ ...validPayload, message: "" }).ok, false);
  assert.equal(validateInquiry({ ...validPayload, email: "" }).ok, false);
  assert.equal(validateInquiry({ ...validPayload, email: "not-an-email" }).ok, false);
});

test("getMailEnv requires CONTACT_INQUIRY_TO (no personal fallback)", () => {
  const cfg = getMailEnv({
    EMAIL_HOST_USER: "user@example.com",
    EMAIL_HOST_PASSWORD: "x",
  });
  assert.equal(cfg.to, "");
});

test("resolveMailConfig keeps MailConfig separate from env maps", () => {
  const fromEnv = resolveMailConfig({
    EMAIL_HOST: "smtp.example.com",
    EMAIL_HOST_USER: "u",
    EMAIL_HOST_PASSWORD: "p",
    CONTACT_INQUIRY_TO: "to@example.com",
  });
  assert.equal(fromEnv.host, "smtp.example.com");
  assert.equal(fromEnv.to, "to@example.com");

  const direct = {
    host: "outbound.daouoffice.com",
    port: 465,
    secure: true,
    requireTLS: false,
    user: "u",
    pass: "p",
    from: "u",
    to: "to@example.com",
  };
  assert.equal(isMailConfig(direct), true);
  assert.equal(isMailConfig({ EMAIL_HOST_USER: "u" }), false);
  assert.equal(resolveMailConfig(direct), direct);
});

test("mailConfigFromSsmValues maps parameters with Daouoffice transport defaults", () => {
  const cfg = mailConfigFromSsmValues({
    [SSM_PARAM_NAMES.host]: "outbound.daouoffice.com",
    [SSM_PARAM_NAMES.user]: "smtp-user@example.com",
    [SSM_PARAM_NAMES.password]: "secret-value",
    [SSM_PARAM_NAMES.to]: "inbox@example.com",
  });
  assert.equal(cfg.host, "outbound.daouoffice.com");
  assert.equal(cfg.user, "smtp-user@example.com");
  assert.equal(cfg.pass, "secret-value");
  assert.equal(cfg.to, "inbox@example.com");
  assert.equal(cfg.from, "smtp-user@example.com");
  assert.equal(cfg.port, DAOUOOFFICE_TRANSPORT_DEFAULTS.port);
  assert.equal(cfg.secure, DAOUOOFFICE_TRANSPORT_DEFAULTS.secure);
  assert.equal(cfg.requireTLS, false);
});

test("loadSmtpConfigFromSsm uses GetParameter four times and caches", async () => {
  clearSmtpConfigCache();
  /** @type {Array<{ Name: string, WithDecryption?: boolean }>} */
  const calls = [];
  const store = {
    [SSM_PARAM_NAMES.host]: "outbound.daouoffice.com",
    [SSM_PARAM_NAMES.user]: "smtp-user@example.com",
    [SSM_PARAM_NAMES.password]: "secret-value",
    [SSM_PARAM_NAMES.to]: "inbox@example.com",
  };
  const getParameter = async (input) => {
    calls.push(input);
    return { Parameter: { Name: input.Name, Value: store[input.Name] } };
  };

  const first = await loadSmtpConfigFromSsm({ getParameter });
  const second = await loadSmtpConfigFromSsm({ getParameter });
  assert.equal(calls.length, 4);
  assert.deepEqual(
    calls.map((c) => c.Name),
    [
      SSM_PARAM_NAMES.host,
      SSM_PARAM_NAMES.user,
      SSM_PARAM_NAMES.password,
      SSM_PARAM_NAMES.to,
    ],
  );
  assert.equal(
    calls.find((c) => c.Name === SSM_PARAM_NAMES.password)?.WithDecryption,
    true,
  );
  assert.equal(
    calls.find((c) => c.Name === SSM_PARAM_NAMES.host)?.WithDecryption,
    false,
  );
  assert.equal(first.to, "inbox@example.com");
  assert.equal(second.user, first.user);
  assert.equal(first.requireTLS, false);
  clearSmtpConfigCache();
});

test("loadSmtpConfigFromSsm fails closed without exposing secret values", async () => {
  clearSmtpConfigCache();
  await assert.rejects(
    () =>
      loadSmtpConfigFromSsm({
        getParameter: async (input) => {
          if (input.Name === SSM_PARAM_NAMES.password) {
            throw new Error("AccessDeniedException secret-value-must-not-leak");
          }
          return { Parameter: { Name: input.Name, Value: "x" } };
        },
      }),
    (err) => {
      assert.match(String(err.message), /SSM parameter missing or inaccessible/);
      assert.equal(String(err.message).includes("secret-value"), false);
      return true;
    },
  );
  clearSmtpConfigCache();
});

test("sendContactInquiry keeps replyTo as inquirer email", async () => {
  const { sendContactInquiry } = await import("../api/_lib/sendMail.js");
  // Smoke the contract via resolveMailConfig + known sendMail fields (no live SMTP).
  const cfg = mailConfigFromSsmValues({
    [SSM_PARAM_NAMES.host]: "outbound.daouoffice.com",
    [SSM_PARAM_NAMES.user]: "smtp-user@example.com",
    [SSM_PARAM_NAMES.password]: "secret-value",
    [SSM_PARAM_NAMES.to]: "inbox@example.com",
  });
  assert.equal(cfg.port, 465);
  assert.equal(cfg.secure, true);
  // replyTo is set inside sendContactInquiry; assert source contract via function source shape
  const src = await import("node:fs").then((fs) =>
    fs.readFileSync(new URL("../api/_lib/sendMail.js", import.meta.url), "utf8"),
  );
  assert.match(src, /replyTo:\s*data\.email/);
  assert.equal(typeof sendContactInquiry, "function");
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
  const res = await handleContactEvent(postEvent({ ...validPayload, message: "" }), {
    sendContactInquiry: async () => {
      throw new Error("should not send");
    },
  });
  assert.equal(res.statusCode, 400);
  const payload = JSON.parse(res.body);
  assert.equal(payload.error, "입력값을 확인해 주세요.");
  assert.ok(payload.details?.message);
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

test("fixture validation event is API Gateway HTTP API v2 shaped", async () => {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const dir = dirname(fileURLToPath(import.meta.url));
  const fixture = JSON.parse(
    readFileSync(join(dir, "../lambda/contact/fixtures/apigw-v2-validation.json"), "utf8"),
  );
  assert.equal(fixture.version, "2.0");
  assert.equal(fixture.requestContext.http.method, "POST");
  const res = await handleContactEvent(fixture, {
    sendContactInquiry: async () => {
      throw new Error("should not send");
    },
  });
  assert.equal(res.statusCode, 400);
});
