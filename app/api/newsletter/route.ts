import { NextResponse } from 'next/server';
import { kvCommand, makeReference, sendOpsWhatsApp, verifyRecaptcha } from '@/lib/server';

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
    'newsletter',
    body.captchaType === 'v2',
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.message, challengeRequired: captcha.challengeRequired ?? false },
      { status: captcha.status ?? 403 },
    );
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 422 });
  }

  try {
    const added = await kvCommand<number>('SADD', 'newsletter:subscribers', email);
    if (added === null && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Newsletter storage is not configured.' }, { status: 503 });
    }
    const reference = makeReference('GFS-N');
    await sendOpsWhatsApp(`New newsletter subscriber ${reference}: ${email}`).catch(() => false);
    return NextResponse.json({ ok: true, message: 'You are on the list. Look out for route updates from Gideon Fleet.' });
  } catch (error) {
    console.error('Newsletter signup failed', error);
    return NextResponse.json({ error: 'We could not save your subscription right now.' }, { status: 500 });
  }
}
