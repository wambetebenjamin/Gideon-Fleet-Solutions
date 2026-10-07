import { NextResponse } from 'next/server';
import { kvGet, verifyRecaptcha } from '@/lib/server';

export const runtime = 'nodejs';

export type Shipment = {
  waybill: string;
  status: string;
  currentLocation: string;
  driverName: string;
  estimatedArrival: string;
  latitude: number;
  longitude: number;
  origin: string;
  destination: string;
  lastUpdated: string;
  demo?: boolean;
};

const demoShipment: Shipment = {
  waybill: 'GFS-24851',
  status: 'In transit',
  currentLocation: 'Athi River, Kenya',
  driverName: 'Assigned driver · demo record',
  estimatedArrival: '14:30 EAT · demo estimate',
  latitude: -1.4563,
  longitude: 36.9782,
  origin: 'Nairobi, Kenya',
  destination: 'Mombasa, Kenya',
  lastUpdated: new Date().toISOString(),
  demo: true,
};

export async function POST(request: Request) {
  let body: { waybill?: unknown; captchaToken?: unknown; captchaType?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(
    typeof body.captchaToken === 'string' ? body.captchaToken : null,
    'track',
    body.captchaType === 'v2',
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.message, challengeRequired: captcha.challengeRequired ?? false },
      { status: captcha.status ?? 403 },
    );
  }

  const waybill = String(body.waybill || '').trim().toUpperCase();
  if (!/^(GFS|GFS-EA)-[A-Z0-9]{4,12}$/.test(waybill)) {
    return NextResponse.json({ error: 'Enter a waybill like GFS-24851.' }, { status: 422 });
  }

  try {
    const shipment = await kvGet<Shipment>(`tracking:${waybill}`);
    if (shipment) return NextResponse.json({ ok: true, shipment });
    if (waybill === demoShipment.waybill) return NextResponse.json({ ok: true, shipment: demoShipment });
    return NextResponse.json({ error: 'We could not find that waybill. Check the number and try again.' }, { status: 404 });
  } catch (error) {
    console.error('Shipment lookup failed', error);
    return NextResponse.json({ error: 'Tracking is temporarily unavailable.' }, { status: 503 });
  }
}
