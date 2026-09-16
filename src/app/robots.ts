// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Zakážeme vyhledávačům procházet interní/přihlašovací sekce
      disallow: ['/login', '/admin', '/dashboard'], 
    },
    sitemap: 'https://izolacers.cz/sitemap.xml',
  }
}