import { NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { token?: unknown; action?: unknown; type?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : 'form';
  const result = await verifyRecaptcha(
    typeof body.token === 'string' ? body.token : null,
    action,
    body.type === 'v2',
  );
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message, challengeRequired: result.challengeRequired ?? false },
      { status: result.status ?? 403 },
    );
  }
  return NextResponse.json({ ok: true, score: result.score ?? null });
}
