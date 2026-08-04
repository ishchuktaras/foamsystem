// src/actions/material.ts

'use server'

import prisma from '@/lib/prisma'
import { materialSchema } from '@/lib/validations/material'
import { revalidatePath } from 'next/cache'

// 1. CREATE - Přidání nového materiálu
export async function createMaterial(data: unknown) {
  try {
    const validated = materialSchema.safeParse(data)
    
    if (!validated.success) {
      return { 
        success: false, 
        error: 'Chybně zadaná data.', 
        issues: validated.error.flatten().fieldErrors 
      }
    }

    const newMaterial = await prisma.material.create({
      data: validated.data
    })

    revalidatePath('/admin/materials') // Aktualizuje stránku po uložení
    return { success: true, data: newMaterial }
    
  } catch (error) {
    console.error('Chyba při vytváření materiálu:', error)
    return { success: false, error: 'Nepodařilo se uložit nový materiál.' }
  }
}

// 2. UPDATE - Úprava existujícího materiálu (např. změna ceny)
export async function updateMaterial(id: string, data: unknown) {
  try {
    const validated = materialSchema.safeParse(data)
    
    if (!validated.success) {
      return { 
        success: false, 
        error: 'Chybně zadaná data.', 
        issues: validated.error.flatten().fieldErrors 
      }
    }

    const updatedMaterial = await prisma.material.update({
      where: { id },
      data: validated.data
    })

    revalidatePath('/admin/materials')
    return { success: true, data: updatedMaterial }
    
  } catch (error) {
    console.error('Chyba při úpravě materiálu:', error)
    return { success: false, error: 'Nepodařilo se upravit materiál.' }
  }
}

// 3. DELETE (SOFT DELETE) - Přesunutí do archivu místo tvrdého smazání
export async function deleteMaterial(id: string) {
  try {
    // Upravíme stav materiálu, místo abychom volali prisma.material.delete
    await prisma.material.update({
      where: { id },
      data: { 
        isArchived: true,
        archivedAt: new Date()
      }
    })

    revalidatePath('/admin/materials')
    return { success: true }
    
  } catch (error) {
    console.error('Chyba při mazání materiálu:', error)
    return { success: false, error: 'Nepodařilo se přesunout materiál do archivu.' }
  }
}

// 4. READ - Načtení pro administraci (pouze aktivní materiály)
export async function getAllMaterialsAdmin() {
  try {
    return await prisma.material.findMany({
      where: { isArchived: false }, // Tento řádek skryje archivované položky
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Chyba načítání pro admina:', error)
    throw new Error('Nepodařilo se načíst materiály.')
  }
}

// 5. READ ONE - Načtení jednoho konkrétního materiálu pro editaci
export async function getMaterialById(id: string) {
  try {
    const material = await prisma.material.findUnique({
      where: { id }
    })
    return material
  } catch (error) {
    console.error('Chyba při načítání detailu materiálu:', error)
    return null
  }
}

// 6. SEED - Záchranná funkce pro nahrání základních pěn
export async function seedBasicMaterials() {
  try {
    const defaultMaterials = [
      {
        name: 'Ekoprodur S11E-MAX',
        type: 'OPEN_CELL',
        density: 8.0,
        yieldPerSetM3: 39.0,
        wasteFactor: 1.05,
        buyPricePerSet: 45000
      },
      {
        name: 'Ekoprodur S0329',
        type: 'CLOSED_CELL',
        density: 36.0,
        yieldPerSetM3: 11.0,
        wasteFactor: 1.10,
        buyPricePerSet: 48000
      }
    ]

    for (const mat of defaultMaterials) {
      await prisma.material.create({ data: mat })
    }

    revalidatePath('/admin/materials')
    return { success: true }
  } catch (error) {
    console.error('Chyba při nahrávání výchozích pěn:', error)
    return { success: false, error: 'Nepodařilo se nahrát výchozí materiály.' }
  }
}