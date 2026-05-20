-- Fix infinite recursion in profiles RLS policy
-- Run this in Supabase SQL Editor

-- Drop the problematic admin policy on profiles
DROP POLICY IF EXISTS "Admins can do anything on profiles" ON public.profiles;

-- Replace with a policy that doesn't self-reference
-- Admin check uses auth.jwt() instead of querying profiles table
CREATE POLICY "Admins can do anything on profiles" ON public.profiles
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN (
      SELECT email FROM public.profiles WHERE is_admin = TRUE
    )
  );

-- Actually, the above still has recursion. Better approach:
-- Use a security definer function that bypasses RLS
DROP POLICY IF EXISTS "Admins can do anything on profiles" ON public.profiles;

-- Simple fix: allow users to read their own profile (already exists)
-- For admin access, we'll use service role key or bypass RLS in admin queries

-- Alternative: just allow all authenticated users to SELECT profiles
-- (admin check happens in application code, not RLS)
CREATE POLICY "Authenticated users can read all profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin update policy - use auth.uid() directly
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

-- Wait, this still recurses. Final fix: use a function with SECURITY DEFINER

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Now drop all admin policies and recreate with the function
DROP POLICY IF EXISTS "Admins can do anything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Clean profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (TRUE);  -- trigger handles this

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- Fix admin policies on other tables too
DROP POLICY IF EXISTS "Admins can do anything on subdomains" ON public.subdomains;
DROP POLICY IF EXISTS "Admins can manage templates" ON public.templates;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can view all dns logs" ON public.dns_logs;

CREATE POLICY "Admins can do anything on subdomains" ON public.subdomains
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view all dns logs" ON public.dns_logs
  FOR ALL USING (public.is_admin());
