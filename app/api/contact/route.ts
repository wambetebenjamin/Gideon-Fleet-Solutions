import { NextResponse } from 'next/server';
import { makeReference, sendContactEmail, sendOpsWhatsApp, verifyRecaptcha } from '@/lib/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(
    typeof body.captchaToken === 'string' ? body.captchaToken : null,
    'contact',
    body.captchaType === 'v2',
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.message, challengeRequired: captcha.challengeRequired ?? false },
      { status: captcha.status ?? 403 },
    );
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 422 });
  }
  const hasHeaderControl = /[\u0000-\u001f\u007f]/;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || name.length > 120 || phone.length > 40 || message.length > 2500 || hasHeaderControl.test(name) || hasHeaderControl.test(phone)) {
    return NextResponse.json({ error: 'Please check your contact details and message length.' }, { status: 422 });
  }

  const reference = makeReference('GFS-C');
  try {
    const emailSent = await sendContactEmail({ name, email, phone, message }).catch(() => false);
    const whatsappSent = await sendOpsWhatsApp(`New Gideon Fleet enquiry ${reference}\n${name} · ${phone || 'no phone'} · ${email}\n${message}`)
      .catch(() => false);
    if (!emailSent && !whatsappSent) {
      return NextResponse.json({ error: 'Contact delivery is not configured. Please contact our Nairobi team directly.' }, { status: 503 });
    }
    return NextResponse.json({
      ok: true,
      reference,
      emailSent,
      whatsappSent,
      message: 'Thanks for reaching out. Our Nairobi team will be in touch.',
    });
  } catch (error) {
    console.error('Contact enquiry failed', error);
    return NextResponse.json({ error: 'We could not send your enquiry right now.' }, { status: 500 });
  }
}
