import { describe, expect, it } from 'vitest';
import { judgeUsers, settleDays } from './src';

describe('job handlers', () => {
  it('settle-days keeps the state stable on rerun', async () => {
    const first = await settleDays();
    const second = await settleDays();
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(first.stability).toBe(second.stability);
  });

  it('judge runs once per day without duplicate events', async () => {
    const result = await judgeUsers();
    expect(result.ok).toBe(true);
    expect(result.status).toBe('OK');
  });
});
