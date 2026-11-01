import { NextResponse } from 'next/server';
import { z } from 'zod';
import { applyReport } from '../../../lib/store';

const schema = z.object({ text: z.string().min(1).max(2000) });

export async function POST(request: Request) {
  const body = await request.json();
  const payload = schema.parse(body);
  const state = applyReport('demo-user', payload.text);
  return NextResponse.json({ pendingRewards: state.pendingRewards, history: state.history.slice(0, 5) });
}
