-- Allow anyone (including anonymous/unauthenticated) to read subdomains by name
-- This is needed for the public /s/[name] page to work

CREATE POLICY "Anyone can read subdomains by name" ON public.subdomains
  FOR SELECT USING (TRUE);

-- Note: This makes all subdomains readable. 
-- If you want to restrict to only published ones:
-- FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
