export const statValues = ['INT', 'STR', 'VIT', 'SENSE', 'CHA', 'WEALTH'] as const;
export type Stat = (typeof statValues)[number];

export type LevelSummary = {
  level: number;
  xp: number;
  xpToNext: number;
  growthPoints: number;
};

export type QuestXPInput = {
  baseXp: number;
  streak: number;
  level: number;
  stability: number;
  health: number;
  debuffMultiplier: number;
  highestMatchingSkill: number;
  alterCount: number;
};

export type DayStatus = 'ok' | 'miss' | 'pending' | 'none';

export function xpCostForLevel(level: number): number {
  return level < 50 ? 40 + 5 * level : 500;
}

export function lvlToXp(level: number): number {
  let total = 0;
  for (let i = 0; i < level; i += 1) total += xpCostForLevel(i);
  return total;
}

export function levelFromXp(totalXp: number): number {
  if (totalXp < 40) return 0;
  for (let level = 0; level < 50; level += 1) {
    const threshold = lvlToXp(level + 1);
    if (totalXp < threshold) return level;
  }
  return 50 + Math.floor((totalXp - lvlToXp(50)) / 500);
}

export function levelSummary(totalXp: number): LevelSummary {
  const level = levelFromXp(totalXp);
  const nextLevelCost = level < 50 ? xpCostForLevel(level) : 500;
  const currentThreshold = lvlToXp(level);
  const xpToNext = Math.max(0, nextLevelCost - (totalXp - currentThreshold));
  const growthPoints = 2 + Math.floor(level / 5);
  return { level, xp: totalXp, xpToNext, growthPoints };
}

export function cumulativeXpBeforeLevel(level: number): number {
  const normalized = Math.max(0, Math.min(level, 50));
  return lvlToXp(normalized);
}

export function calculateQuestXp({ baseXp, streak, level, stability, health, debuffMultiplier, highestMatchingSkill, alterCount }: QuestXPInput): number {
  const streakMultiplier = streak >= 100 ? 1.5 : streak >= 30 ? 1.25 : streak >= 7 ? 1.1 : 1;
  const diminishing = 1 / (1 + level / 40);
  const stabilityFactor = Math.min(1.2, Math.max(0.7, 0.7 + 0.3 * (stability / 100) + 0.2 * (health / 100)));
  const skillBonus = 1 + 0.02 * (Math.max(1, highestMatchingSkill) - 1);
  const adjusted = baseXp * streakMultiplier * skillBonus * diminishing * stabilityFactor * debuffMultiplier;
  const withAlter = adjusted + Math.min(10, alterCount) * 2;
  return Math.max(1, Math.round(withAlter));
}

export function skillLevelFromUses(uses: number): number {
  return Math.min(10, 1 + Math.floor(uses / 5));
}

export function dayState({ dueQuestCount, hasCompletedDaily, isSlipDay, isToday }: { dueQuestCount: number; hasCompletedDaily: boolean; isSlipDay: boolean; isToday: boolean }): DayStatus {
  if (dueQuestCount === 0) return 'none';
  if (isSlipDay) return 'miss';
  if (hasCompletedDaily) return 'ok';
  return isToday ? 'pending' : 'miss';
}

export function computeStreakFromDailyStates(states: DayStatus[]): number {
  let streak = 0;
  for (const status of states) {
    if (status === 'ok') streak += 1;
    else if (status === 'miss') break;
  }
  return streak;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildPenaltyZoneDate(userId: number, date: string): { survivalTask: string; stat: Stat } {
  const taskPool = [
    ['Complete a 25-minute deep-work block', 'INT'],
    ['Walk for 20 minutes and log the route', 'VIT'],
    ['Send a difficult message to one person', 'CHA'],
    ['Write a short review of a recent win', 'SENSE'],
    ['Track every spend for the day', 'WEALTH'],
    ['Finish one task before checking messages', 'STR'],
  ] as const;
  const index = Math.abs(Math.floor(Number(`${userId}${date}`.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)) / 3)) % taskPool.length;
  const [task, stat] = taskPool[index];
  return { survivalTask: task, stat };
}

export function applyJudgement({ sleepHours, screenHours }: { sleepHours: number | null; screenHours: number | null }): { multiplier: number; status: 'NO DATA' | 'OK'; message: string } {
  if (sleepHours == null || screenHours == null) {
    return { multiplier: 1, status: 'NO DATA', message: 'No judgement data captured yet.' };
  }
  if (sleepHours < 6 && screenHours > 8) return { multiplier: 0.72, status: 'OK', message: 'Sleep debt and screen overflow reduced output.' };
  if (sleepHours < 6) return { multiplier: 0.8, status: 'OK', message: 'Sleep debt reduced output.' };
  if (screenHours > 8) return { multiplier: 0.9, status: 'OK', message: 'Screen time exceeded sustainable limits.' };
  return { multiplier: 1, status: 'OK', message: 'Recovery is stable.' };
}

export function applyStability({ dueDailyCount, completedDailyCount }: { dueDailyCount: number; completedDailyCount: number }): number {
  const base = 100;
  const misses = Math.max(0, dueDailyCount - completedDailyCount);
  let next = base - misses * 8;
  if (misses === 0 && dueDailyCount > 0) next += 3;
  return clamp(next, 0, 100);
}

export function createChestRewards(level: number): { gold: number; growth: number; material: number } {
  const gold = 20 * level;
  const growth = Math.floor(level / 5);
  const roll = Math.random();
  let material = 1;
  if (roll < 0.6) material = 1;
  else if (roll < 0.9) material = 2;
  else material = 4;
  return { gold, growth, material };
}

export function claimChest(level: number): { gold: number; growth: number; material: number } {
  return createChestRewards(level);
}

export function canClaimReward({ rewardAmount, dayTotal }: { rewardAmount: number; dayTotal: number }): boolean {
  return dayTotal + rewardAmount <= 300;
}
