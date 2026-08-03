// src/actions/material.tsa

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

// 3. DELETE - Smazání materiálu
export async function deleteMaterial(id: string) {
  try {
    await prisma.material.delete({
      where: { id }
    })

    revalidatePath('/admin/materials')
    return { success: true }
    
  } catch (error) {
    console.error('Chyba při mazání materiálu:', error)
    return { success: false, error: 'Nepodařilo se smazat materiál.' }
  }
}

// (Read operaci už máme částečně v calculator.ts, ale můžeme si ji sem přidat pro úplnost administrace)
export async function getAllMaterialsAdmin() {
  try {
    return await prisma.material.findMany({
      orderBy: { createdAt: 'desc' } // V adminu chceme vidět nejnovější nahoře
    })
  } catch (error) {
    console.error('Chyba načítání pro admina:', error)
    throw new Error('Nepodařilo se načíst materiály.')
  }
}

// 4. READ - Načtení jednoho konkrétního materiálu pro editaci
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