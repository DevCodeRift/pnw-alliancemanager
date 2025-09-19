# Supabase Database Setup

This directory contains the database schema and migrations for the PNW Alliance Manager.

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run the Initial Migration**
   ```sql
   -- Copy and paste the contents of migrations/001_initial_schema.sql
   -- into the Supabase SQL editor and run it
   ```

3. **Optional: Run Seed Data**
   ```sql
   -- Copy and paste the contents of seed.sql
   -- to add some example whitelisted alliances
   ```

4. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

## Database Schema

### Tables

#### `users`
Stores Discord user information and PNW API keys
- `id` (UUID, Primary Key)
- `discord_id` (Text, Unique) - Discord user ID
- `discord_username` (Text) - Discord username
- `discord_avatar` (Text, Optional) - Discord avatar URL
- `pnw_api_key` (Text, Optional) - Politics and War API key
- `pnw_nation_id` (Integer, Optional) - PNW nation ID
- `is_admin` (Boolean) - Admin status
- `created_at`, `updated_at` (Timestamps)

#### `whitelisted_alliances`
Stores alliances that are allowed to use the system
- `id` (UUID, Primary Key)
- `alliance_id` (Integer, Unique) - PNW alliance ID
- `alliance_name` (Text) - Alliance name
- `alliance_acronym` (Text, Optional) - Alliance acronym
- `slug` (Text, Unique) - URL slug for subdomain
- `added_by_user_id` (UUID, Foreign Key) - User who added this alliance
- `is_active` (Boolean) - Whether the alliance is active
- `created_at`, `updated_at` (Timestamps)

#### `user_alliances`
Links users to their alliances with roles
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key) - Reference to users table
- `alliance_id` (Integer) - PNW alliance ID
- `role` (Enum) - member, officer, leader
- `created_at` (Timestamp)

#### `api_key_requests`
Temporary storage for API key validation
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key) - Reference to users table
- `api_key` (Text) - The API key being validated
- `status` (Enum) - pending, validated, failed
- `validation_data` (JSONB) - Validation response data
- `expires_at` (Timestamp) - Expiration time (1 hour)
- `created_at` (Timestamp)

## Row Level Security (RLS)

The database uses RLS policies to ensure data security:
- Users can only access their own data
- Admins have read access to all user data
- Everyone can read whitelisted alliances
- Only admins can modify whitelisted alliances

## Initial Admin Setup

After the first user logs in with Discord:
1. Go to the Supabase dashboard
2. Find the user in the `users` table
3. Set `is_admin = true` for admin users