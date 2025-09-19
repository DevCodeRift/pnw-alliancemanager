-- Insert the global PNW API key directly into admin_settings
INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES ('global_pnw_api_key', '05e5e3753de6b6f257f4', 'Global Politics and War API key for system-wide operations')
ON CONFLICT (setting_key)
DO UPDATE SET setting_value = '05e5e3753de6b6f257f4';