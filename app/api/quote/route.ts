import { NextResponse } from 'next/server';
import { kvSet, makeReference, sendOpsWhatsApp, sendQuoteEmail, verifyRecaptcha } from '@/lib/server';

export const runtime = 'nodejs';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(
    typeof body.captchaToken === 'string' ? body.captchaToken : null,
    'quote',
    body.captchaType === 'v2',
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.message, challengeRequired: captcha.challengeRequired ?? false },
      { status: captcha.status ?? 403 },
    );
  }

  const required = ['origin', 'destination', 'cargoType', 'contactName', 'phone', 'email'];
  for (const key of required) {
    if (typeof body[key] !== 'string' || !String(body[key]).trim()) {
      return NextResponse.json({ error: `Please provide ${key}.` }, { status: 422 });
    }
  }
  const limits: Record<string, number> = { origin: 160, destination: 160, cargoType: 80, contactName: 120, phone: 40, email: 254 };
  const containsControlCharacters = (value: string) => /[\u0000-\u001f\u007f]/.test(value);
  if (Object.entries(limits).some(([key, max]) => String(body[key]).trim().length > max || containsControlCharacters(String(body[key])))) {
    return NextResponse.json({ error: 'Please check the length of your contact and route details.' }, { status: 422 });
  }
  if (!emailPattern.test(String(body.email)) || String(body.email).length > 254) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 422 });
  }
  const optionalNumber = (value: unknown, max: number) => {
    if (value === undefined || value === null || value === '') return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= max ? parsed : null;
  };
  const weightKg = optionalNumber(body.weightKg, 1_000_000);
  const volumeCbm = optionalNumber(body.volumeCbm, 100_000);
  if (weightKg === null || volumeCbm === null) {
    return NextResponse.json({ error: 'Weight and volume must be non-negative valid numbers.' }, { status: 422 });
  }

  const reference = makeReference('GFS-Q');
  const quote = {
    reference,
    origin: String(body.origin).trim(),
    destination: String(body.destination).trim(),
    cargoType: String(body.cargoType).trim(),
    weightKg,
    volumeCbm,
    pickupDate: String(body.pickupDate || ''),
    contactName: String(body.contactName).trim(),
    phone: String(body.phone).trim(),
    email: String(body.email).trim().toLowerCase(),
    notes: String(body.notes || '').trim().slice(0, 1500),
    createdAt: new Date().toISOString(),
  };

  try {
    const stored = await kvSet(`quotes:${reference}`, quote, 60 * 60 * 24 * 365);
    if (stored === null && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Quotation storage is not configured. Please contact our Nairobi team.' }, { status: 503 });
    }
    const [emailSent, whatsappSent] = await Promise.all([
      sendQuoteEmail(quote.email, reference).catch(() => false),
      sendOpsWhatsApp(
        `New Gideon Fleet quote ${reference}\n${quote.origin} → ${quote.destination}\n${quote.cargoType} · ${quote.weightKg} kg\n${quote.contactName} · ${quote.phone} · ${quote.email}`,
      ).catch(() => false),
    ]);

    return NextResponse.json({
      ok: true,
      reference,
      message: 'Your request is with our Nairobi operations team.',
      stored: stored !== null,
      emailSent,
      whatsappSent,
    });
  } catch (error) {
    console.error('Quote submission failed', error);
    return NextResponse.json({ error: 'We could not save your quote right now. Please try again.' }, { status: 500 });
  }
}
