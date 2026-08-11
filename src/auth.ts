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
      if (user) {
        token.id = user.id
        token.role = user.role // Zde už TypeScript díky rozšířenému rozhraní User ví, co 'role' je
        token.name = user.name
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