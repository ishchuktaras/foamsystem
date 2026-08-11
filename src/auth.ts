// src/auth.ts
import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma" 
import bcrypt from "bcrypt"
import authConfig from "./auth.config" 

// --- TYPESCRIPT DEFINICE ---
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
  interface User {
    role: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
  }
}
// ---------------------------

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, 
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        
        if (!user || !user.password) return null
        
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)
        if (!isPasswordValid) return null
        
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 1. Při přihlášení natáhneme čerstvá data z databáze
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.name = dbUser.name
        }
      } else {
        // 2. Při běžných požadavcích zajistíme, že už v tokenu uložené hodnoty nezaniknou
        token.id = token.id ?? (user as any)?.id
        token.role = token.role ?? (user as any)?.role
        token.name = token.name ?? user?.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        if (token.id) session.user.id = token.id as string
        if (token.role) session.user.role = token.role as string
        if (token.name) session.user.name = token.name as string
      }
      return session
    }
  }
})