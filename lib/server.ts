import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

export type CaptchaResult = {
  ok: boolean;
  score?: number;
  challengeRequired?: boolean;
  status?: number;
  message?: string;
};

const kvUrl = () => process.env.KV_REST_API_URL || process.env.VERCEL_KV_REST_API_URL;
const kvToken = () => process.env.KV_REST_API_TOKEN || process.env.VERCEL_KV_REST_API_TOKEN;

export async function kvCommand<T = unknown>(command: string, ...args: (string | number)[]): Promise<T | null> {
  const url = kvUrl();
  const token = kvToken();
  if (!url || !token) return null;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`KV command failed (${response.status})`);
  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result ?? null;
}

export async function kvSet(key: string, value: unknown, ttlSeconds?: number) {
  const serialized = JSON.stringify(value);
  if (ttlSeconds) return kvCommand('SET', key, serialized, 'EX', ttlSeconds);
  return kvCommand('SET', key, serialized);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const result = await kvCommand<string>('GET', key);
  if (!result) return null;
  try {
    return JSON.parse(result) as T;
  } catch {
    return null;
  }
}

export function makeReference(prefix = 'GFS') {
  const date = new Date();
  const year = String(date.getFullYear()).slice(-2);
  return `${prefix}-${year}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function allowedRecaptchaHostnames() {
  const allowed = new Set<string>();
  const addOrigin = (value: string, allowWwwAlias = false) => {
    try {
      const host = new URL(value.includes('://') ? value : `https://${value}`).hostname.toLowerCase();
      allowed.add(host);
      if (allowWwwAlias) allowed.add(host.startsWith('www.') ? host.slice(4) : `www.${host}`);
    } catch { /* Ignore malformed optional deployment URLs. */ }
  };
  addOrigin(process.env.NEXT_PUBLIC_SITE_URL || 'https://gideonfleet.co.ke', true);
  if (process.env.VERCEL_URL) addOrigin(process.env.VERCEL_URL);
  if (process.env.VERCEL_BRANCH_URL) addOrigin(process.env.VERCEL_BRANCH_URL);
  if (process.env.NODE_ENV !== 'production') {
    allowed.add('localhost');
    allowed.add('127.0.0.1');
  }
  return allowed;
}

export async function verifyRecaptcha(token: string | null, action: string, isV2 = false): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true, score: 1 };
    return { ok: false, status: 503, message: 'Captcha verification is not configured.' };
  }
  if (!token) return { ok: false, status: 400, message: 'Captcha verification is required.' };

  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    });
    if (!response.ok) return { ok: false, status: 502, message: 'Captcha service is temporarily unavailable.' };

    const result = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
      'error-codes'?: string[];
    };

    if (!result.success) return { ok: false, status: 403, message: 'Captcha verification failed.' };
    if (!result.hostname || !allowedRecaptchaHostnames().has(result.hostname.toLowerCase())) {
      return { ok: false, status: 403, message: 'Captcha hostname did not match.' };
    }
    if (isV2) return { ok: true, score: 1 };
    if (result.action !== action) {
      return { ok: false, status: 403, message: 'Captcha action did not match.' };
    }
    const score = typeof result.score === 'number' ? result.score : 0;
    if (score < 0.5) {
      return {
        ok: false,
        score,
        challengeRequired: true,
        status: 403,
        message: 'Please complete the visible security challenge.',
      };
    }
    return { ok: true, score };
  } catch {
    return { ok: false, status: 502, message: 'Captcha verification could not be completed.' };
  }
}

export async function sendOpsWhatsApp(message: string): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO;
  if (!accessToken || !phoneNumberId || !to) return false;

  const version = process.env.WHATSAPP_API_VERSION || 'v21.0';
  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: message.slice(0, 3500) },
    }),
    cache: 'no-store',
  });
  return response.ok;
}

function createMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) return null;
  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export async function sendQuoteEmail(to: string, reference: string) {
  const transporter = createMailer();
  const from = process.env.SMTP_FROM;
  if (!transporter || !from) return false;

  await transporter.sendMail({
    from,
    to,
    subject: `Gideon Fleet quote request ${reference}`,
    text: `Thank you for requesting a freight quotation from Gideon Fleet Solutions. Your request reference is ${reference}. Our Nairobi operations team will follow up shortly.`,
    html: `<p>Thank you for requesting a freight quotation from Gideon Fleet Solutions.</p><p>Your request reference is <strong>${reference}</strong>.</p><p>Our Nairobi operations team will follow up shortly.</p>`,
  });
  return true;
}

export async function sendContactEmail(sender: { name: string; email: string; phone?: string; message: string }) {
  const transporter = createMailer();
  const from = process.env.SMTP_FROM;
  const to = process.env.OPS_EMAIL || from;
  if (!transporter || !from || !to) return false;

  await transporter.sendMail({
    from,
    to,
    replyTo: sender.email,
    subject: `Website enquiry from ${sender.name}`,
    text: `Name: ${sender.name}\nEmail: ${sender.email}\nPhone: ${sender.phone || 'Not provided'}\n\n${sender.message}`,
  });
  return true;
}
