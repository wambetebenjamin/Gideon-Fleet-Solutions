import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(
    {
      mode: 'single-visitor',
      message: 'This Vercel route cannot accept a persistent WebSocket upgrade. Configure NEXT_PUBLIC_TRACKING_WS_URL to connect a managed WebSocket presence service; the client keeps the tracking board usable without it.',
    },
    {
      status: 426,
      headers: { Upgrade: 'websocket', 'Cache-Control': 'no-store' },
    },
  );
}
