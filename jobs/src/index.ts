import { settleUser } from '../../apps/web/lib/store';

export async function settleDays() {
  const user = settleUser('demo-user');
  return { ok: true, stability: user.stability, streak: user.streak };
}

export async function judgeUsers() {
  const user = settleUser('demo-user');
  return { ok: true, multiplier: 0.9, status: 'OK', level: user.level };
}
