-- Seed data for development and testing

-- Insert some example whitelisted alliances (using actual PNW alliance IDs)
INSERT INTO public.whitelisted_alliances (alliance_id, alliance_name, alliance_acronym, slug) VALUES
(790, 'Camelot', 'Cam', 'camelot'),
(857, 'Grumpy Old Bastards', 'GOB', 'grumpy-old-bastards'),
(1584, 'The Coal Mines', 'TCM', 'the-coal-mines'),
(2073, 'Swamp Guardians', 'SG', 'swamp-guardians'),
(1742, 'Guardian', 'Guardian', 'guardian');

-- Note: User data will be created when users first log in with Discord
-- Admin users will need to be set manually in the database after first login