/**
 * Load SMTP settings from SSM Parameter Store (production Lambda only).
 * Do not import this module from Vite/local middleware.
 *
 * Uses GetParameter (ssm:GetParameter) per infra guide — not GetParameters.
 *
 * Parameters (fixed paths):
 *   /zerotica-contact/smtp-host      String
 *   /zerotica-contact/smtp-user      String
 *   /zerotica-contact/smtp-password  SecureString (WithDecryption)
 *   /zerotica-contact/mail-to        String
 *
 * Port / SSL are not in SSM. Defaults match company Daouoffice ops
 * (backend_mrlee: outbound.daouoffice.com:465, SSL on, TLS off).
 * Actual host value still comes from SSM smtp-host.
 */

export const SSM_PARAM_NAMES = Object.freeze({
  host: "/zerotica-contact/smtp-host",
  user: "/zerotica-contact/smtp-user",
  password: "/zerotica-contact/smtp-password",
  to: "/zerotica-contact/mail-to",
});

/** Company Daouoffice transport defaults (not secrets; host still from SSM). */
export const DAOUOOFFICE_TRANSPORT_DEFAULTS = Object.freeze({
  port: 465,
  secure: true,
  requireTLS: false,
});

/** @type {import("../../api/_lib/sendMail.js").MailConfig | null} */
let cachedConfig = null;

/**
 * @param {Record<string, string>} values name → value
 * @returns {import("../../api/_lib/sendMail.js").MailConfig}
 */
export function mailConfigFromSsmValues(values) {
  const host = values[SSM_PARAM_NAMES.host];
  const user = values[SSM_PARAM_NAMES.user];
  const pass = values[SSM_PARAM_NAMES.password];
  const to = (values[SSM_PARAM_NAMES.to] || "").trim();

  if (!host || !user || !pass || !to) {
    throw new Error("SSM SMTP configuration incomplete");
  }

  return {
    host,
    port: DAOUOOFFICE_TRANSPORT_DEFAULTS.port,
    secure: DAOUOOFFICE_TRANSPORT_DEFAULTS.secure,
    requireTLS: DAOUOOFFICE_TRANSPORT_DEFAULTS.requireTLS,
    user,
    pass,
    from: user,
    to,
  };
}

/**
 * @param {{
 *   getParameter?: (input: { Name: string, WithDecryption?: boolean }) => Promise<{
 *     Parameter?: { Name?: string, Value?: string },
 *   }>,
 *   forceRefresh?: boolean,
 * }} [options]
 * @returns {Promise<import("../../api/_lib/sendMail.js").MailConfig>}
 */
export async function loadSmtpConfigFromSsm(options = {}) {
  if (cachedConfig && !options.forceRefresh) {
    return cachedConfig;
  }

  const getParameter =
    options.getParameter ||
    (async (input) => {
      const { SSMClient, GetParameterCommand } = await import("@aws-sdk/client-ssm");
      const client = new SSMClient({});
      return client.send(new GetParameterCommand(input));
    });

  /** @type {Record<string, string>} */
  const values = {};

  const specs = [
    { name: SSM_PARAM_NAMES.host, withDecryption: false },
    { name: SSM_PARAM_NAMES.user, withDecryption: false },
    { name: SSM_PARAM_NAMES.password, withDecryption: true },
    { name: SSM_PARAM_NAMES.to, withDecryption: false },
  ];

  for (const spec of specs) {
    let result;
    try {
      result = await getParameter({
        Name: spec.name,
        WithDecryption: spec.withDecryption,
      });
    } catch {
      // Do not include parameter values or AWS error detail that might leak secrets.
      throw new Error("SSM parameter missing or inaccessible");
    }

    const value = result?.Parameter?.Value;
    if (value == null || value === "") {
      throw new Error("SSM SMTP configuration incomplete");
    }
    values[spec.name] = value;
  }

  cachedConfig = mailConfigFromSsmValues(values);
  return cachedConfig;
}

/** Test helper — clears process-local cache. */
export function clearSmtpConfigCache() {
  cachedConfig = null;
}
