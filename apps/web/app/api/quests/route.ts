import { NextResponse } from 'next/server';
import { z } from 'zod';
import { upsertQuest } from '../../../lib/store';

const schema = z.object({
  id: z.string().default(`q-${Date.now()}`),
  title: z.string().min(1),
  kind: z.enum(['daily', 'goal', 'penalty', 'emergency', 'hidden']).default('daily'),
  stat: z.enum(['INT', 'STR', 'VIT', 'SENSE', 'CHA', 'WEALTH']).default('INT'),
  xp: z.number().int().min(1).default(25),
});

export async function POST(request: Request) {
  const body = await request.json();
  const payload = schema.parse(body);
  const state = upsertQuest('demo-user', {
    userId: 'demo-user',
    id: payload.id ?? `q-${Date.now()}`,
    title: payload.title,
    kind: payload.kind,
    stat: payload.stat,
    xp: payload.xp,
  });
  return NextResponse.json({ quests: state.quests });
}
