import { NextResponse } from 'next/server';
import { getUserState } from '../../../../lib/store';

export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret && process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const state = getUserState('demo-user');
  return NextResponse.json({ ok: true, judgement: { multiplier: 0.9, status: 'OK' }, state });
}
