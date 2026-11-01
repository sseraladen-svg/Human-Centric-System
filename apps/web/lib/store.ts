import { levelFromXp } from '../../../packages/engine/src/index';

export type Quest = {
  id: string;
  userId: string;
  title: string;
  kind: 'daily' | 'goal' | 'penalty' | 'emergency' | 'hidden';
  stat: 'INT' | 'STR' | 'VIT' | 'SENSE' | 'CHA' | 'WEALTH';
  xp: number;
  weekdays?: number[];
  dueTime?: string | null;
  ended?: boolean;
  createdOn?: string;
};

export type Profile = {
  id: string;
  displayName: string;
  timezone: string;
  honestyDial: number;
  paused: boolean;
};

export type Reward = {
  id: string;
  kind: 'report';
  amount: number;
  stat: string | null;
  label: string;
  detail: string;
  claimedAt?: string | null;
};

export type UserState = {
  profile: Profile;
  quests: Quest[];
  completions: Record<string, number>;
  pendingRewards: Reward[];
  history: Array<{ id: string; kind: string; text: string; xp: number; createdAt: string }>;
  checkIns: Array<{ userId: string; sleepHours: number; screenHours: number; reflection: string; onDate: string }>;
  stability: number;
  streak: number;
  level: number;
  debuff: number;
  penaltyZone: { id: string; expiresAt: string; survivalTask: string } | null;
};

const stateByUser = new Map<string, UserState>();

function buildBaseState(userId: string): UserState {
  const profile = { id: userId, displayName: 'Demo user', timezone: 'UTC', honestyDial: 1, paused: false };
  const quests: Quest[] = [
    { id: 'q-1', userId, title: 'Deep work sprint', kind: 'daily', stat: 'INT', xp: 40 },
    { id: 'q-2', userId, title: 'Workout block', kind: 'daily', stat: 'VIT', xp: 35 },
  ];
  return {
    profile,
    quests,
    completions: {},
    pendingRewards: [],
    history: [
      { id: 'h-1', kind: 'boost', text: 'Account created', xp: 0, createdAt: new Date().toISOString() },
    ],
    checkIns: [],
    stability: 100,
    streak: 7,
    level: 1,
    debuff: 1,
    penaltyZone: null,
  };
}

export function ensureUser(userId: string): UserState {
  if (!stateByUser.has(userId)) {
    stateByUser.set(userId, buildBaseState(userId));
  }
  const user = stateByUser.get(userId)!;
  user.level = levelFromXp(Object.values(user.completions).reduce((sum, value) => sum + value, 0) || 0);
  user.stability = Math.max(0, Math.min(100, user.stability));
  return user;
}

export function getUserState(userId: string): UserState {
  return ensureUser(userId);
}

export function upsertQuest(userId: string, quest: Quest): UserState {
  const user = ensureUser(userId);
  user.quests = [...user.quests.filter((item) => item.id !== quest.id), quest];
  return user;
}

export function applyReport(userId: string, text: string): UserState {
  const user = ensureUser(userId);
  const amount = Math.max(25, Math.min(150, text.length));
  user.pendingRewards.push({
    id: `reward-${Date.now()}`,
    kind: 'report',
    amount,
    stat: 'INT',
    label: 'Report reward',
    detail: text.slice(0, 80),
    claimedAt: null,
  });
  user.history.unshift({
    id: `history-${Date.now()}`,
    kind: 'report',
    text: `Parsed report: ${text.slice(0, 60)}`,
    xp: amount,
    createdAt: new Date().toISOString(),
  });
  return user;
}

export function addCheckIn(userId: string, sleepHours: number, screenHours: number, reflection: string): UserState {
  const user = ensureUser(userId);
  user.checkIns.push({ userId, sleepHours, screenHours, reflection, onDate: new Date().toISOString().slice(0, 10) });
  return user;
}

export function settleUser(userId: string): UserState {
  const user = ensureUser(userId);
  user.stability = Math.min(100, user.stability + 3);
  user.streak = Math.max(user.streak, 7);
  user.history.unshift({
    id: `history-${Date.now()}`,
    kind: 'settle',
    text: 'Scheduled settlement ran',
    xp: 0,
    createdAt: new Date().toISOString(),
  });
  return user;
}
