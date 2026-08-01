import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.material.createMany({
    data: [
      {
        name: 'Ekoprodur S11E-MAX (Měkká)',
        type: 'OPEN_CELL',
        density: 8.0,
        yieldPerSetM3: 39.0, // Dle Sergeje: 39 m3 na sadu
        wasteFactor: 1.05,   // Předpokládaná ztráta 5 % (k doladění v UI)
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
        wasteFactor: 1.10,   // Předpokládaná ztráta 10 % (odstřik)
      }
    ]
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())