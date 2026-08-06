// src/proxy.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

// Inicializujeme Auth.js pouze s lehkou konfigurací (bez bcrypt/Prisma)
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')

  // Ochrana admin sekce
  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

// Konfigurace pro proxy (spouští se na všech routách kromě api, statiky, atd.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}