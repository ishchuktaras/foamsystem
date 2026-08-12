// src/prisma/seed.ts

import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.material.createMany({
    data: [
      {
        name: 'Ekoprodur S11E-MAX (Měkká)',
        type: 'OPEN_CELL',
        density: 8.0,
        yieldPerSetM3: 39.0, // Dle Sergeje: 39 m3 na sadu
        wasteFactor: 1.05,   // Předpokládaná ztráta 5 %
      },
      {
        name: 'Ekoprodur S10-HP (Měkká)',
        type: 'OPEN_CELL',
        density: 8.0,
        yieldPerSetM3: 39.0,
        wasteFactor: 1.05,
      },
      {
        name: 'Ekoprodur S0330 (Tvrdá)',
        type: 'CLOSED_CELL',
        density: 36.0,
        yieldPerSetM3: 11.0, // Dle Sergeje: 11 m3 na sadu
        wasteFactor: 1.10,   // Předpokládaná ztráta 10 %
      }
    ]
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())