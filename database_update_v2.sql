-- ==========================================
-- StudentHub AI v2.0 Database Migration
-- Copy and run this in your Supabase SQL Editor
-- ==========================================

-- 1. ADD NEW COLUMNS TO PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pet_type VARCHAR DEFAULT 'cat';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pet_state VARCHAR DEFAULT 'happy';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS focus_minutes INT DEFAULT 0;

-- 2. CUSTOM REWARDS TABLE (Self-Bribe Reward Shop)
CREATE TABLE IF NOT EXISTS public.custom_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title VARCHAR NOT NULL,
  cost INT NOT NULL CHECK (cost > 0),
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.custom_rewards ENABLE ROW LEVEL SECURITY;

-- Custom Rewards RLS Policies
CREATE POLICY "Users can view their own rewards."
  ON public.custom_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards."
  ON public.custom_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards."
  ON public.custom_rewards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rewards."
  ON public.custom_rewards FOR DELETE
  USING (auth.uid() = user_id);

-- 3. POMODORO LOGS TABLE
CREATE TABLE IF NOT EXISTS public.pomodoro_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks ON DELETE SET NULL,
  duration INT NOT NULL, -- duration in minutes
  completed BOOLEAN DEFAULT TRUE,
  xp_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pomodoro_logs ENABLE ROW LEVEL SECURITY;

-- Pomodoro Logs RLS Policies
CREATE POLICY "Users can view their own pomodoro logs."
  ON public.pomodoro_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pomodoro logs."
  ON public.pomodoro_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. ADD updated_at COLUMN TO TASKS (for Weekly Wrapped query)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Create a trigger to auto-update updated_at on tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
