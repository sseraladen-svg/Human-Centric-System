import { z } from 'zod';

export const statValues = ['INT', 'STR', 'VIT', 'SENSE', 'CHA', 'WEALTH'] as const;
export type Stat = (typeof statValues)[number];

export const profileSchema = z.object({
  id: z.string(),
  displayName: z.string().min(1).max(100),
  timezone: z.string().default('UTC'),
  honestyDial: z.number().int().min(0).max(2).default(1),
  paused: z.boolean().default(false),
});

export type Profile = z.infer<typeof profileSchema>;

export const questSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  kind: z.enum(['daily', 'goal', 'penalty', 'emergency', 'hidden']),
  stat: z.enum(statValues),
  xp: z.number().int().min(1),
  weekdays: z.array(z.number().int().min(0).max(6)).optional(),
  dueTime: z.string().nullable().optional(),
  ended: z.boolean().default(false),
  createdOn: z.string().optional(),
});

export type Quest = z.infer<typeof questSchema>;

export const reportParserResultSchema = z.object({
  evidence: z.enum(['accepted', 'partial', 'none']),
  metrics: z.object({
    minutes: z.number().nullable().optional(),
    hours: z.number().nullable().optional(),
    sleepHours: z.number().nullable().optional(),
    outreachCount: z.number().nullable().optional(),
    rupees: z.number().nullable().optional(),
    builds: z.number().nullable().optional(),
    topic: z.string().nullable().optional(),
  }),
  closeQuestIds: z.array(z.string()),
  newSkill: z.object({ name: z.string(), stat: z.enum(statValues) }).nullable(),
  missing: z.array(z.string()),
  reply: z.string(),
  avoidance: z.string().optional(),
});

export type ReportParserResult = z.infer<typeof reportParserResultSchema>;
