import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { createUser, getUserByDiscordId, updateUserAdminStatus } from './db'

export const authOptions: NextAuthOptions = {
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
          let existingUser = await getUserByDiscordId(user.id)

          // Check if user is an admin
          const adminDiscordIds = process.env.ADMIN_DISCORD_IDS?.split(',').map(id => id.trim()) || []
          const isAdmin = adminDiscordIds.includes(user.id)

          if (!existingUser) {
            // Create user in our custom table
            existingUser = await createUser({
              discord_id: user.id,
              discord_username: user.name || '',
              discord_avatar: user.image || '',
              is_admin: isAdmin,
            })
          } else if (existingUser.is_admin !== isAdmin) {
            // Update admin status if it has changed
            await updateUserAdminStatus(existingUser.id, isAdmin)
            existingUser.is_admin = isAdmin
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
    async jwt({ token, account, user }) {
      if (account?.provider === 'discord' && user) {
        token.discordId = user.id
        token.username = user.name || undefined
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