import { beforeEach, describe, expect, it } from 'vitest';
import { GET as getState } from './state/route';
import { POST as postQuest } from './quests/route';
import { POST as postCheckIn } from './check-ins/route';
import { POST as postReport } from './reports/route';
import { POST as settle } from './jobs/settle-days/route';

describe('api routes', () => {
  beforeEach(() => {
    // reset shared mock store through a fresh process boundary is not needed for a small file-level state.
  });

  it('loads a state payload for the demo user', async () => {
    const response = await getState();
    const json = await response.json();
    expect(json.profile.displayName).toBe('Demo user');
    expect(json.quests.length).toBeGreaterThan(0);
  });

  it('creates a quest and returns updated state', async () => {
    const response = await postQuest(new Request('http://localhost/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Write a retry plan', kind: 'goal', stat: 'CHA', xp: 40 }),
    }));
    const json = await response.json();
    expect(json.quests.some((quest: any) => quest.title === 'Write a retry plan')).toBe(true);
  });

  it('accepts a check-in and applies stability', async () => {
    const response = await postCheckIn(new Request('http://localhost/api/check-ins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sleepHours: 7.2, screenHours: 4.4, reflection: 'Focused and recovered.' }),
    }));
    const json = await response.json();
    expect(json.checkIns.length).toBeGreaterThan(0);
    expect(json.stability).toBeGreaterThan(0);
  });

  it('creates a pending reward from a report', async () => {
    const response = await postReport(new Request('http://localhost/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'I completed a work block and studied for two hours. I improved my writeup.' }),
    }));
    const json = await response.json();
    expect(json.pendingRewards.length).toBeGreaterThan(0);
  });

  it('runs the settle-days job using the scheduler endpoint', async () => {
    const response = await settle(new Request('http://localhost/api/jobs/settle-days', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    const json = await response.json();
    expect(json.ok).toBe(true);
  });
});
