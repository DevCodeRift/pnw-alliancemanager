import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { createServerSupabaseClient } from './supabase'
import { createUser, getUserByDiscordId } from './db'

const supabaseClient = createServerSupabaseClient()

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          // Check if user exists in our custom users table
          let existingUser = await getUserByDiscordId(profile.id as string)

          if (!existingUser) {
            // Create user in our custom table
            existingUser = await createUser({
              discord_id: profile.id as string,
              discord_username: profile.username as string,
              discord_avatar: profile.avatar as string,
            })
          }

          return !!existingUser
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Add custom user data to session
        const customUser = await getUserByDiscordId(token.sub)
        if (customUser) {
          session.user.id = customUser.id
          session.user.hasApiKey = !!customUser.pnw_api_key
          session.user.nationId = customUser.pnw_nation_id
          session.user.isAdmin = customUser.is_admin
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        token.discordId = profile.id
        token.username = profile.username
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}