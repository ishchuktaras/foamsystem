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
        
        // --- 1. MĚŘENÍ: Čas potřebný k načtení dat z databáze Supabase ---
        console.time("DB_DOTAZ")
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        console.timeEnd("DB_DOTAZ")
        
        if (!user || !user.password) return null
        
        // --- 2. MĚŘENÍ: Čas potřebný k dešifrování a porovnání hesla ---
        console.time("BCRYPT_OVERENI")
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)
        console.timeEnd("BCRYPT_OVERENI")
        
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
    async jwt({ token, user, trigger }) {
      // Pokud se uživatel přihlašuje (user existuje) NEBO pokud je token starý, načteme čerstvá data z DB
      if (user?.email || trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user?.email ?? token.email ?? "" }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.name = dbUser.name
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
      }
      return session
    }
  }
})