
-- Fix: Drop restrictive policies and recreate as permissive

-- memories table
DROP POLICY IF EXISTS "Users can view own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can update own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can view own memories " ON public.memories;
DROP POLICY IF EXISTS "Users can insert own memories " ON public.memories;
DROP POLICY IF EXISTS "Users can update own memories " ON public.memories;
DROP POLICY IF EXISTS "Users can delete own memories " ON public.memories;

CREATE POLICY "Users can view own memories" ON public.memories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memories" ON public.memories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memories" ON public.memories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memories" ON public.memories FOR DELETE USING (auth.uid() = user_id);

-- profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile " ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
