-- =============================================
-- KHOAI.TO Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  max_subdomains INT DEFAULT 1,
  credits INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 2. Templates
CREATE TABLE public.templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(10),
  html TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subdomains
CREATE TABLE public.subdomains (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(63) UNIQUE NOT NULL,
  hosting_type VARCHAR(10) NOT NULL CHECK (hosting_type IN ('ip', 'html')),
  ip_address VARCHAR(45),
  template_id INT REFERENCES public.templates(id),
  html_content TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_shared BOOLEAN DEFAULT FALSE,
  dns_status VARCHAR(20) DEFAULT 'pending' CHECK (dns_status IN ('pending', 'active', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Campaigns
CREATE TABLE public.campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  total_slots INT NOT NULL,
  used_slots INT DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Campaign Claims
CREATE TABLE public.campaign_claims (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  campaign_id INT REFERENCES public.campaigns(id),
  subdomain_id INT REFERENCES public.subdomains(id),
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, campaign_id)
);

-- 6. DNS Logs
CREATE TABLE public.dns_logs (
  id SERIAL PRIMARY KEY,
  subdomain_id INT REFERENCES public.subdomains(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  cloudflare_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subdomains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dns_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subdomains: users manage their own
CREATE POLICY "Users can view own subdomains" ON public.subdomains
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subdomains" ON public.subdomains
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subdomains" ON public.subdomains
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subdomains" ON public.subdomains
  FOR DELETE USING (auth.uid() = user_id);
-- Public shared subdomains visible to all
CREATE POLICY "Anyone can view shared subdomains" ON public.subdomains
  FOR SELECT USING (is_shared = TRUE);

-- Templates: readable by all authenticated users
CREATE POLICY "Authenticated users can view templates" ON public.templates
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Campaigns: readable by all
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns
  FOR SELECT USING (is_active = TRUE);

-- Campaign claims: users manage their own
CREATE POLICY "Users can view own claims" ON public.campaign_claims
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON public.campaign_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DNS logs: users can view logs for their subdomains
CREATE POLICY "Users can view own dns logs" ON public.dns_logs
  FOR SELECT USING (
    subdomain_id IN (SELECT id FROM public.subdomains WHERE user_id = auth.uid())
  );

-- =============================================
-- Admin policies (for users with is_admin = true)
-- =============================================

CREATE POLICY "Admins can do anything on profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can do anything on subdomains" ON public.subdomains
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can view all dns logs" ON public.dns_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =============================================
-- Functions & Triggers
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on subdomains
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subdomains_updated_at
  BEFORE UPDATE ON public.subdomains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX idx_subdomains_user_id ON public.subdomains(user_id);
CREATE INDEX idx_subdomains_name ON public.subdomains(name);
CREATE INDEX idx_subdomains_shared ON public.subdomains(is_shared) WHERE is_shared = TRUE;
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_sort ON public.templates(sort_order);
CREATE INDEX idx_dns_logs_subdomain ON public.dns_logs(subdomain_id);
