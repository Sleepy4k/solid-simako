import nodemailer from "nodemailer";

const _env = (k: string) => (typeof process !== "undefined" ? process.env[k] : undefined) ?? "";

function createTransport() {
  const host = _env("SMTP_HOST");
  const port = Number(_env("SMTP_PORT") || 587);
  const user = _env("SMTP_USER");
  const pass = _env("SMTP_PASS");
  const from = _env("SMTP_FROM") || `Simako <noreply@simako.web.id>`;

  if (!host || !user || !pass) {
    console.warn("[email] SMTP not configured — emails will be logged only");
    return null;
  }

  return { transport: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }), from };
}

export interface SendEmailOpts {
  to:      string;
  subject: string;
  html:    string;
  text:    string;
}

export async function sendEmail(opts: SendEmailOpts): Promise<boolean> {
  const cfg = createTransport();

  if (!cfg) {
    console.log("[email] Would send to:", opts.to);
    console.log("[email] Subject:", opts.subject);
    console.log("[email] Body:", opts.text);
    return true;
  }

  try {
    await cfg.transport.sendMail({
      from:    cfg.from,
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
      text:    opts.text,
    });
    return true;
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return false;
  }
}
