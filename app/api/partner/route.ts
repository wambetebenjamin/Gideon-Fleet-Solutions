import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { kvSet, makeReference, sendOpsWhatsApp, verifyRecaptcha } from '@/lib/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const maxFileBytes = 2 * 1024 * 1024;

async function hasMatchingFileSignature(file: File) {
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (file.type === 'application/pdf') return String.fromCharCode(...header.slice(0, 4)) === '%PDF';
  if (file.type === 'image/jpeg') return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  if (file.type === 'image/png') return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => header[index] === byte);
  return false;
}

function fileExtension(type: string) {
  if (type === 'application/pdf') return 'pdf';
  return type === 'image/jpeg' ? 'jpg' : 'png';
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof value === 'object' && value !== null && 'arrayBuffer' in value && 'size' in value;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Please submit a valid application form.' }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(
    typeof form.get('captchaToken') === 'string' ? String(form.get('captchaToken')) : null,
    'partner',
    form.get('captchaType') === 'v2',
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.message, challengeRequired: captcha.challengeRequired ?? false },
      { status: captcha.status ?? 403 },
    );
  }

  const fields = ['name', 'phone', 'email', 'vehicleType', 'registration', 'experience'];
  const values: Record<string, string> = {};
  for (const field of fields) {
    const value = String(form.get(field) || '').trim();
    if (!value) return NextResponse.json({ error: `Please provide ${field}.` }, { status: 422 });
    values[field] = value;
  }
  const fieldLimits: Record<string, number> = { name: 120, phone: 40, email: 254, vehicleType: 80, registration: 32, experience: 2 };
  const hasControlCharacters = /[\u0000-\u001f\u007f]/;
  if (Object.entries(fieldLimits).some(([field, max]) => values[field].length > max || hasControlCharacters.test(values[field]))) {
    return NextResponse.json({ error: 'Please check the length of your application details.' }, { status: 422 });
  }
  const yearsOfDriving = Number(values.experience);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !Number.isInteger(yearsOfDriving) || yearsOfDriving < 0 || yearsOfDriving > 70) {
    return NextResponse.json({ error: 'Please provide a valid email address and driving experience.' }, { status: 422 });
  }

  const licence = form.get('drivingLicence');
  const logbook = form.get('vehicleLogbook');
  if (!isFile(licence) || !isFile(logbook) || licence.size === 0 || logbook.size === 0) {
    return NextResponse.json({ error: 'Please attach both your driving licence and vehicle logbook.' }, { status: 422 });
  }
  const files = [licence, logbook];
  if (files.some((file) => file.size > maxFileBytes || !allowedTypes.has(file.type))) {
    return NextResponse.json({ error: 'Documents must be PDF, JPG, or PNG files under 2 MB each.' }, { status: 422 });
  }
  const validSignatures = await Promise.all(files.map(hasMatchingFileSignature));
  if (!validSignatures.every(Boolean)) {
    return NextResponse.json({ error: 'Each document must be a valid PDF, JPG, or PNG file.' }, { status: 422 });
  }

  const reference = makeReference('GFS-P');
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const kvConfigured = Boolean(
    (process.env.KV_REST_API_URL || process.env.VERCEL_KV_REST_API_URL)
    && (process.env.KV_REST_API_TOKEN || process.env.VERCEL_KV_REST_API_TOKEN),
  );
  if (!token && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Secure document storage is not configured. Please contact our Nairobi team.' }, { status: 503 });
  }
  if (!kvConfigured && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Application storage is not configured. Please contact our Nairobi team.' }, { status: 503 });
  }

  try {
    const uploads = token
      ? await Promise.all([
          put(`partner-applications/${reference}/driving-licence.${fileExtension(licence.type)}`, licence, {
            access: 'private',
            addRandomSuffix: true,
            contentType: licence.type,
            token,
          }),
          put(`partner-applications/${reference}/vehicle-logbook.${fileExtension(logbook.type)}`, logbook, {
            access: 'private',
            addRandomSuffix: true,
            contentType: logbook.type,
            token,
          }),
        ])
      : [];

    const application = {
      reference,
      ...values,
      documentPaths: uploads.map(({ pathname }) => pathname),
      createdAt: new Date().toISOString(),
    };
    const stored = await kvSet(`partners:${reference}`, application, 60 * 60 * 24 * 365);
    if (stored === null && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Application storage is not configured.' }, { status: 503 });
    }

    await sendOpsWhatsApp(
      `New Gideon Fleet partner application ${reference}\n${values.name} · ${values.phone}\n${values.vehicleType} · ${values.registration}`,
    ).catch(() => false);

    return NextResponse.json({
      ok: true,
      reference,
      documentsStored: uploads.length === 2,
      message: 'Thank you. Our fleet team will review your application.',
    });
  } catch (error) {
    console.error('Partner application failed', error);
    return NextResponse.json({ error: 'We could not submit your application right now. Please try again.' }, { status: 500 });
  }
}
