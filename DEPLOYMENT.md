# Deployment Guide

This guide covers deploying the PNW Alliance Manager to Vercel with proper configuration.

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project** - Create a project at [supabase.com](https://supabase.com)
3. **Discord Application** - Create at [Discord Developer Portal](https://discord.com/developers/applications)
4. **Domain** (Optional) - For custom subdomain functionality

## Step 1: Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the migration from `supabase/migrations/001_initial_schema.sql`
3. (Optional) Run the seed data from `supabase/seed.sql`
4. Get your project credentials:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Found in Settings > API
   - Service Role Key: Found in Settings > API (keep secret!)

## Step 2: Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback/discord`
   - Production: `https://yourdomain.com/api/auth/callback/discord`
5. Note your Client ID and Client Secret

## Step 3: Vercel Deployment

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect it's a Next.js project

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Step 4: Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Your domain URL | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Random secret string | Generate with `openssl rand -base64 32` |
| `DISCORD_CLIENT_ID` | Discord OAuth Client ID | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | Discord OAuth Client Secret | From Discord Developer Portal |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | From Supabase settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | From Supabase settings (secret!) |
| `ADMIN_DISCORD_IDS` | Admin Discord user IDs | `123456789,987654321` |
| `APP_DOMAIN` | Your app domain | `yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PNW_API_BASE_URL` | PNW API endpoint | `https://api.politicsandwar.com/graphql` |
| `APP_NAME` | Application name | `PNW Alliance Manager` |

## Step 5: Custom Domain Setup (Optional)

### For Subdomain Functionality

1. Add your domain to Vercel project
2. Configure DNS with your domain provider:
   - Add A record: `@` → Vercel IP
   - Add CNAME record: `*` → `cname.vercel-dns.com`
   - Add CNAME record: `www` → `cname.vercel-dns.com`

3. Update environment variables:
   - `NEXTAUTH_URL`: `https://yourdomain.com`
   - `APP_DOMAIN`: `yourdomain.com`

### DNS Configuration Example

```
Type    Name    Value
A       @       76.76.19.61
CNAME   *       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

## Step 6: Post-Deployment Setup

1. **Test Authentication**
   - Visit your deployed site
   - Try logging in with Discord
   - Check that user creation works

2. **Create Admin User**
   - Log in with your Discord account
   - Go to Supabase dashboard
   - In the `users` table, set `is_admin = true` for your user

3. **Test Admin Panel**
   - Access `/admin` to test alliance whitelisting
   - Add a test alliance to verify functionality

4. **Test Subdomain Routing**
   - Add an alliance with a simple slug (e.g., "test")
   - Visit `test.yourdomain.com` to verify routing works

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Discord redirect URLs match your domain
   - Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set

2. **Database errors**
   - Ensure Supabase migration was run successfully
   - Check RLS policies are enabled

3. **Subdomain not working**
   - Verify wildcard DNS is configured (`*` CNAME)
   - Check middleware is handling subdomains correctly

4. **PNW API errors**
   - Verify API keys are valid
   - Check rate limiting (2,000 requests/day for standard accounts)

### Environment Verification

Test your deployment with these URLs:

- Homepage: `https://yourdomain.com`
- Login: `https://yourdomain.com/auth/signin`
- Admin Panel: `https://yourdomain.com/admin`
- Test Subdomain: `https://test.yourdomain.com` (if alliance exists)

## Security Considerations

1. **Environment Variables**
   - Keep service role keys secret
   - Rotate Discord client secrets periodically
   - Use strong random strings for NEXTAUTH_SECRET

2. **Database Security**
   - RLS policies are enabled by default
   - Only admins can modify whitelisted alliances
   - Users can only access their own data

3. **Domain Security**
   - HTTPS is enforced by Vercel
   - Security headers are configured in vercel.json

## Monitoring

Consider setting up:

1. **Vercel Analytics** - Monitor performance and usage
2. **Supabase Metrics** - Track database usage
3. **Error Monitoring** - Use Sentry or similar service

## Scaling

As your alliance manager grows:

1. **Database** - Supabase scales automatically
2. **API Limits** - Monitor PNW API usage
3. **Vercel Limits** - Check function execution limits
4. **CDN** - Static assets are cached globally

## Support

For deployment issues:
- Check Vercel deployment logs
- Review Supabase logs for database errors
- Test environment variables are correct
- Verify DNS configuration