import { NextResponse } from 'next/server';
import { settleUser } from '../../../../lib/store';

export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret && process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const state = settleUser('demo-user');
  return NextResponse.json({ ok: true, state });
}
