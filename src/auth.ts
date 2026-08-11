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
    async jwt({ token, user, trigger, session }) {
      // Při přihlášení naplníme token daty z databázového uživatele
      if (user) {
        token.id = user.id
        token.role = user.role
        if (user.name) {
          token.name = user.name
        }
      }
      
      // Pokud dojde k aktualizaci session (např. update profilu)
      if (trigger === "update" && session?.name) {
        token.name = session.name
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