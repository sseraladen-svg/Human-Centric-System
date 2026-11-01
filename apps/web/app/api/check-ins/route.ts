import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addCheckIn } from '../../../lib/store';

const schema = z.object({
  sleepHours: z.number().min(0).max(24),
  screenHours: z.number().min(0).max(24),
  reflection: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  const body = await request.json();
  const payload = schema.parse(body);
  const state = addCheckIn('demo-user', payload.sleepHours, payload.screenHours, payload.reflection);
  return NextResponse.json({ checkIns: state.checkIns, stability: state.stability });
}
