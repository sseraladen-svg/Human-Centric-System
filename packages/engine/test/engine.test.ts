import { describe, expect, it } from 'vitest';
import {
  applyJudgement,
  applyStability,
  calculateQuestXp,
  canClaimReward,
  claimChest,
  computeStreakFromDailyStates,
  dayState,
  levelFromXp,
  lvlToXp,
  skillLevelFromUses,
} from '../src/index';

describe('engine rules', () => {
  it('levels match the cumulative xp table near the 49/50 boundary', () => {
    expect(levelFromXp(0)).toBe(0);
    expect(levelFromXp(39)).toBe(0);
    expect(levelFromXp(40)).toBe(1);
    expect(levelFromXp(lvlToXp(50) - 1)).toBe(49);
    expect(levelFromXp(lvlToXp(50))).toBe(50);
    expect(levelFromXp(lvlToXp(50) + 1)).toBe(50);
  });

  it('judgement applies the specified multipliers at thresholds', () => {
    expect(applyJudgement({ sleepHours: 5.9, screenHours: 8.1 }).multiplier).toBe(0.72);
    expect(applyJudgement({ sleepHours: 5.9, screenHours: 7.9 }).multiplier).toBe(0.8);
    expect(applyJudgement({ sleepHours: 7.0, screenHours: 8.1 }).multiplier).toBe(0.9);
    expect(applyJudgement({ sleepHours: null, screenHours: null }).status).toBe('NO DATA');
  });

  it('stability clamps and awards the daily bonus only when no misses', () => {
    expect(applyStability({ dueDailyCount: 1, completedDailyCount: 0 })).toBe(92);
    expect(applyStability({ dueDailyCount: 1, completedDailyCount: 1 })).toBe(100);
    expect(applyStability({ dueDailyCount: 3, completedDailyCount: 3 })).toBe(100);
  });

  it('quest xp includes streak bonus, skill bonus and debuff multiplier', () => {
    const xp = calculateQuestXp({
      baseXp: 200,
      streak: 7,
      level: 1,
      stability: 100,
      health: 100,
      debuffMultiplier: 1,
      highestMatchingSkill: 4,
      alterCount: 2,
    });
    expect(xp).toBeGreaterThan(100);
  });

  it('skill levels use the 5-use progression', () => {
    expect(skillLevelFromUses(0)).toBe(1);
    expect(skillLevelFromUses(5)).toBe(2);
    expect(skillLevelFromUses(14)).toBe(3);
  });

  it('daily state handles ok, miss, pending, none and a rebound item', () => {
    expect(dayState({ dueQuestCount: 1, hasCompletedDaily: true, isSlipDay: false, isToday: true })).toBe('ok');
    expect(dayState({ dueQuestCount: 1, hasCompletedDaily: false, isSlipDay: false, isToday: false })).toBe('miss');
    expect(dayState({ dueQuestCount: 1, hasCompletedDaily: false, isSlipDay: false, isToday: true })).toBe('pending');
    expect(dayState({ dueQuestCount: 0, hasCompletedDaily: false, isSlipDay: false, isToday: true })).toBe('none');
    expect(computeStreakFromDailyStates(['ok', 'ok', 'ok', 'miss'])).toBe(3);
  });

  it('reward caps are enforced and chest rewards are numeric', () => {
    expect(canClaimReward({ rewardAmount: 200, dayTotal: 100 })).toBe(true);
    expect(canClaimReward({ rewardAmount: 200, dayTotal: 150 })).toBe(false);
    const chest = claimChest(10);
    expect(chest.gold).toBe(200);
    expect(chest.growth).toBe(2);
    expect(chest.material).toBeGreaterThanOrEqual(1);
  });
});
