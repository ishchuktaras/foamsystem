'use server'

import prisma from '@/lib/prisma'

// 1. Funkce pro načtení materiálů do Select boxu ve formuláři
export async function getMaterials() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' } // Seřadíme abecedně
    })
    return materials
  } catch (error) {
    console.error('Chyba při načítání materiálů:', error)
    throw new Error('Nepodařilo se načíst materiály z databáze.')
  }
}

// 2. Hlavní výpočetní logika
export async function calculateOrder(areaM2: number, thicknessCm: number, materialId: string) {
  try {
    // Najdeme konkrétní materiál v databázi
    const material = await prisma.material.findUnique({
      where: { id: materialId }
    })

    if (!material) {
      throw new Error('Materiál nebyl nalezen.')
    }

    // VÝPOČETNÍ JÁDRO
    // a) Převod tloušťky na metry a výpočet čistého objemu v m3
    const thicknessM = thicknessCm / 100
    const rawVolumeM3 = areaM2 * thicknessM

    // b) Aplikace koeficientu ztráty (wasteFactor, např. 1.05 pro 5% zástřik)
    const totalVolumeM3 = rawVolumeM3 * material.wasteFactor

    // c) Výpočet potřebného počtu sad na základě vydatnosti (yieldPerSetM3)
    const exactSetsRequired = totalVolumeM3 / material.yieldPerSetM3

    // d) Zaokrouhlení nahoru (technik s sebou musí mít vždy celé sady navíc)
    const setsToLoad = Math.ceil(exactSetsRequired)

    return {
      success: true,
      data: {
        materialName: material.name,
        rawVolumeM3: Number(rawVolumeM3.toFixed(2)),
        totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
        exactSetsRequired: Number(exactSetsRequired.toFixed(2)),
        setsToLoad: setsToLoad // Fyzický počet sudů do dodávky
      }
    }

  } catch (error) {
    console.error('Chyba při výpočtu zakázky:', error)
    return {
      success: false,
      error: 'Nastala chyba při výpočtu. Zkontrolujte zadání.'
    }
  }
}