# PNW Alliance Manager

A comprehensive alliance management system for Politics and War with Discord authentication, subdomain routing, and real-time data integration.

## Features

### 🔐 **Authentication & Security**
- Discord OAuth integration with NextAuth.js
- Secure API key linking and validation
- Role-based access control (Admin, Member)
- Row-level security with Supabase

### 🏛️ **Alliance Management**
- Central admin panel for whitelisting alliances
- Dynamic subdomain routing (`alliancename.yourdomain.com`)
- Real-time data integration with Politics and War API
- Alliance-specific branding and content

### 📊 **Dashboard & Analytics**
- Personalized user dashboard
- Account overview and quick actions
- Alliance membership tracking
- Nation information display

### 🎯 **Dynamic Subdomain System**
- Automatic subdomain generation for whitelisted alliances
- Middleware-based routing and validation
- SEO-optimized pages with dynamic metadata
- Error handling for invalid subdomains

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Discord OAuth
- **Database**: Supabase (PostgreSQL)
- **API Integration**: Politics and War GraphQL API
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom components

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Discord Application (for OAuth)
- Supabase Project
- Politics and War API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pnw-alliancemanager.git
   cd pnw-alliancemanager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your credentials in `.env.local`

4. **Set up the database**
   - Create a Supabase project
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
   - (Optional) Run seed data from `supabase/seed.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# Admin Configuration
ADMIN_DISCORD_IDS=comma_separated_discord_ids

# Optional
PNW_API_BASE_URL=https://api.politicsandwar.com/graphql
APP_DOMAIN=localhost:3000
APP_NAME=PNW Alliance Manager
```

### Discord Application Setup

1. Create an application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add OAuth2 redirect URL: `http://localhost:3000/api/auth/callback/discord`
3. Copy Client ID and Client Secret to your environment variables

## Usage

### For Alliance Leaders

1. **Apply for Whitelisting**
   - Contact an administrator to whitelist your alliance
   - Provide your alliance ID from Politics and War

2. **Access Your Alliance Portal**
   - Once whitelisted, visit `yourallianceslug.yourdomain.com`
   - Use Discord to authenticate

### For Administrators

1. **Access Admin Panel**
   - Set your Discord ID as an admin in the database
   - Visit `/admin` to manage whitelisted alliances

2. **Whitelist Alliances**
   - Search for alliances by name or ID
   - Add them to the whitelist with automatic subdomain generation

### For Members

1. **Complete Setup**
   - Login with Discord
   - Link your Politics and War API key
   - Access alliance-specific features

## API Reference

### Alliance Management

- `GET /api/admin/alliances` - Get whitelisted alliances
- `POST /api/admin/alliances` - Add alliance to whitelist
- `GET /api/admin/search-alliances` - Search PNW alliances
- `GET /api/alliances/validate-subdomain` - Validate subdomain

### User Management

- `POST /api/setup/validate-api-key` - Validate and link PNW API key

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

## Database Schema

### Key Tables

- **users** - Discord users with PNW API keys
- **whitelisted_alliances** - Approved alliances with subdomain slugs
- **user_alliances** - User-alliance relationships with roles
- **api_key_requests** - Temporary API key validation storage

See `supabase/migrations/001_initial_schema.sql` for complete schema.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel
│   ├── alliance/[slug]/   # Dynamic alliance pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── setup/             # API key setup
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── alliance/         # Alliance-specific components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database operations
│   ├── pnw-api.ts        # PNW API client
│   └── supabase.ts       # Supabase client
├── types/                # TypeScript type definitions
└── middleware.ts         # Subdomain routing middleware
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

For subdomain functionality, configure wildcard DNS:
- `*` CNAME → `cname.vercel-dns.com`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing code style
- Add proper error handling
- Update documentation for new features

## Security

- All user data is protected by Row Level Security (RLS)
- API keys are stored securely in the database
- Discord OAuth provides secure authentication
- Rate limiting protects against API abuse

## Limitations

- Politics and War API has rate limits (2,000 requests/day standard)
- Subdomain routing requires wildcard DNS configuration
- NextAuth sessions are JWT-based (stateless)

## Troubleshooting

### Common Issues

1. **Discord authentication not working**
   - Check redirect URLs in Discord Developer Portal
   - Verify NEXTAUTH_URL environment variable

2. **Database connection errors**
   - Verify Supabase credentials
   - Check if migrations were run

3. **PNW API errors**
   - Verify API keys are valid
   - Check rate limiting

4. **Subdomain routing not working**
   - Verify wildcard DNS configuration
   - Check middleware is enabled

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bug reports
- Join our Discord server for community support
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help

## Acknowledgments

- [Politics and War](https://politicsandwar.com) for the game data API
- [Supabase](https://supabase.com) for the database platform
- [Vercel](https://vercel.com) for deployment platform
- [Discord](https://discord.com) for authentication service

---

**Built with ❤️ for the Politics and War community**