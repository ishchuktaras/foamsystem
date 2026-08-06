// src/auth.ts
import NextAuth, { type DefaultSession, type Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma" 
import bcrypt from "bcrypt"
import type { JWT } from "next-auth/jwt"
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
    id: string
    role: string
  }
}
// ---------------------------

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Vložíme pages a callbacks z auth.config.ts
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
        
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ]
})