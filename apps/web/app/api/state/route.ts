import { NextResponse } from 'next/server';
import { getUserState } from '../../../lib/store';

export async function GET() {
  const userId = 'demo-user';
  const state = getUserState(userId);
  return NextResponse.json({
    profile: state.profile,
    today: { date: new Date().toISOString().slice(0, 10) },
    quests: state.quests,
    completions: state.completions,
    totals: { stability: state.stability, streak: state.streak, level: state.level },
    stability: state.stability,
    streak: state.streak,
    level: state.level,
    debuff: state.debuff,
    penaltyZone: state.penaltyZone,
    pendingRewards: state.pendingRewards,
    history: state.history.slice(0, 10),
  });
}
