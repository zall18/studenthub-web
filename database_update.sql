-- ==========================================
-- StudentHub Feature Expansion SQL Update
-- Copy and run this in your Supabase SQL Editor
-- ==========================================

-- 1. ADD GAMIFICATION FIELDS TO USERS (auth.users or public.users if you have one)
-- Supabase handles users in auth.users by default. If you have a public.users profile table,
-- you should run this on public.users. Assuming you use auth.users metadata, or a separate profile table.
-- Let's create a public.profiles table if it doesn't exist, linked to auth.users, 
-- or you can just use raw metadata. 
-- Best practice: Create a `profiles` table to store xp and level.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  xp integer default 0 not null,
  level integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. BADGES SYSTEM
CREATE TABLE IF NOT EXISTS public.badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon_name text, -- e.g. lucide icon name like 'Star' or 'Trophy'
  xp_reward integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  badge_id uuid references public.badges on delete cascade not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, badge_id) -- A user can only earn a specific badge once
);

-- Turn on RLS for badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- 3. FINANCIAL TRACKER SYSTEM
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12,2) not null,
  type text check (type in ('INCOME', 'EXPENSE')) not null,
  category text, -- e.g., 'Food', 'Books', 'Salary'
  note text,
  transaction_date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Profiles policies
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Badges policies (All authenticated users can see available badges)
CREATE POLICY "Anyone can view badges." ON public.badges FOR SELECT USING (auth.role() = 'authenticated');

-- User Badges policies
CREATE POLICY "Users can view their own earned badges." ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions." ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions." ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Optional: Add tags to tasks if not using JSON (Though AI tags are mostly for view)
-- ALTER TABLE public.tasks ADD COLUMN tags text[] default '{}';
