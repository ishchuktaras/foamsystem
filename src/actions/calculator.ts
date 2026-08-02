'use server'

import prisma from '@/lib/prisma'
import { calculatorSchema } from '@/lib/validations/calculator'

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
export async function calculateOrder(data: unknown) {
  try {
    // a) Zod validace dat ze serveru (odchytí všechny nesmysly)
    const validatedFields = calculatorSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Chybně zadaná data.',
        issues: validatedFields.error.flatten().fieldErrors
      }
    }

    const { areaM2, thicknessCm, materialId } = validatedFields.data

    // b) Najdeme konkrétní materiál v databázi
    const material = await prisma.material.findUnique({
      where: { id: materialId }
    })

    if (!material) {
      return { success: false, error: 'Materiál nebyl nalezen v databázi.' }
    }

    // VÝPOČETNÍ JÁDRO
    const thicknessM = thicknessCm / 100
    const rawVolumeM3 = areaM2 * thicknessM
    const totalVolumeM3 = rawVolumeM3 * material.wasteFactor
    const exactSetsRequired = totalVolumeM3 / material.yieldPerSetM3
    const setsToLoad = Math.ceil(exactSetsRequired)

    return {
      success: true,
      data: {
        materialName: material.name,
        rawVolumeM3: Number(rawVolumeM3.toFixed(2)),
        totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
        exactSetsRequired: Number(exactSetsRequired.toFixed(2)),
        setsToLoad: setsToLoad
      }
    }

  } catch (error) {
    console.error('Chyba při výpočtu zakázky:', error)
    return {
      success: false,
      error: 'Nastala neočekávaná chyba při výpočtu.'
    }
  }
}