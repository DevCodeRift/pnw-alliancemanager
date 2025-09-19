-- Admin settings table - stores global configuration
CREATE TABLE public.admin_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_admin_settings_key ON public.admin_settings(setting_key);

-- Add updated_at trigger
CREATE TRIGGER set_admin_settings_updated_at
    BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin settings
CREATE POLICY "Admins can view admin settings" ON public.admin_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE discord_id = auth.uid()::text
            AND is_admin = true
        )
    );

-- Only admins can modify admin settings
CREATE POLICY "Admins can manage admin settings" ON public.admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE discord_id = auth.uid()::text
            AND is_admin = true
        )
    );

-- Insert default settings
INSERT INTO public.admin_settings (setting_key, description) VALUES
('global_pnw_api_key', 'Global Politics and War API key for system-wide operations'),
('app_name', 'Application name displayed to users'),
('maintenance_mode', 'Enable/disable maintenance mode');