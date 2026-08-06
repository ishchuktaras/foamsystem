// src/auth.config.ts
import type { NextAuthConfig, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

export default {
  providers: [], 
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as string
      }
      return token
    },
    // Zde definujeme přesné typy Session a JWT místo zakázaného "any"
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
} satisfies NextAuthConfig