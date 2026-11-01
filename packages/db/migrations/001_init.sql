CREATE TABLE IF NOT EXISTS profiles (
  user_id text PRIMARY KEY,
  display_name text NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  honesty_dial smallint NOT NULL DEFAULT 1,
  paused boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quests (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title text NOT NULL,
  kind text NOT NULL,
  stat text NOT NULL,
  xp integer NOT NULL,
  weekdays integer[] NULL,
  due_time time NULL,
  ended boolean NOT NULL DEFAULT false,
  created_on date NOT NULL DEFAULT current_date
);

CREATE TABLE IF NOT EXISTS stat_events (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  stat text NOT NULL,
  delta integer NOT NULL,
  reason text NOT NULL,
  source_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, reason)
);

CREATE TABLE IF NOT EXISTS check_ins (
  user_id text NOT NULL,
  on_date date NOT NULL,
  sleep_hours numeric(4,2) NULL,
  screen_hours numeric(4,2) NULL,
  reflection text NULL,
  PRIMARY KEY (user_id, on_date)
);

CREATE TABLE IF NOT EXISTS pending_rewards (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  kind text NOT NULL,
  amount integer NOT NULL,
  stat text NULL,
  label text NOT NULL,
  detail text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz NULL
);
