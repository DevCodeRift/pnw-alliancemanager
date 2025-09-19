-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - stores Discord user information and PNW API keys
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discord_id TEXT UNIQUE NOT NULL,
    discord_username TEXT NOT NULL,
    discord_avatar TEXT,
    pnw_api_key TEXT,
    pnw_nation_id INTEGER,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Whitelisted alliances table - stores alliances allowed to use the system
CREATE TABLE public.whitelisted_alliances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alliance_id INTEGER UNIQUE NOT NULL,
    alliance_name TEXT NOT NULL,
    alliance_acronym TEXT,
    slug TEXT UNIQUE NOT NULL,
    added_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User alliances table - links users to their alliances with roles
CREATE TABLE public.user_alliances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    alliance_id INTEGER NOT NULL,
    role TEXT CHECK (role IN ('member', 'officer', 'leader')) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, alliance_id)
);

-- API key requests table - temporary storage for API key validation requests
CREATE TABLE public.api_key_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    api_key TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'validated', 'failed')) DEFAULT 'pending',
    validation_data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '1 hour'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_users_discord_id ON public.users(discord_id);
CREATE INDEX idx_users_pnw_nation_id ON public.users(pnw_nation_id);
CREATE INDEX idx_whitelisted_alliances_alliance_id ON public.whitelisted_alliances(alliance_id);
CREATE INDEX idx_whitelisted_alliances_slug ON public.whitelisted_alliances(slug);
CREATE INDEX idx_user_alliances_user_id ON public.user_alliances(user_id);
CREATE INDEX idx_user_alliances_alliance_id ON public.user_alliances(alliance_id);
CREATE INDEX idx_api_key_requests_user_id ON public.api_key_requests(user_id);
CREATE INDEX idx_api_key_requests_expires_at ON public.api_key_requests(expires_at);

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at columns
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_whitelisted_alliances_updated_at
    BEFORE UPDATE ON public.whitelisted_alliances
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitelisted_alliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_requests ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = discord_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = discord_id);

-- Admins can read all users
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE discord_id = auth.uid()::text
            AND is_admin = true
        )
    );

-- Everyone can read whitelisted alliances
CREATE POLICY "Everyone can view whitelisted alliances" ON public.whitelisted_alliances
    FOR SELECT USING (is_active = true);

-- Only admins can modify whitelisted alliances
CREATE POLICY "Admins can manage whitelisted alliances" ON public.whitelisted_alliances
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE discord_id = auth.uid()::text
            AND is_admin = true
        )
    );

-- Users can view their own alliance memberships
CREATE POLICY "Users can view own alliance memberships" ON public.user_alliances
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = user_id
            AND discord_id = auth.uid()::text
        )
    );

-- Users can manage API key requests for themselves
CREATE POLICY "Users can manage own API key requests" ON public.api_key_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = user_id
            AND discord_id = auth.uid()::text
        )
    );