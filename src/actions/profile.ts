// src/actions/profile.ts
'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: { currentEmail: string, name: string, email: string, password?: string }) {
  try {
    // 1. Najdeme aktuálního uživatele v DB
    const user = await db.user.findUnique({ 
      where: { email: data.currentEmail } 
    })
    
    if (!user) {
      return { success: false, error: "Uživatel nenalezen v databázi." }
    }

    // 2. Připravíme nová data k uložení
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      name: data.name,
      email: data.email,
    }

    // 3. Pokud bylo zadáno nové heslo, zahešujeme ho
    if (data.password && data.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(data.password, 10)
      updateData.password = hashedPassword
    }

    // 4. Uložíme do databáze
    await db.user.update({
      where: { email: data.currentEmail },
      data: updateData
    })

    revalidatePath('/admin/settings/profile')
    return { success: true }
    
  } catch (error) {
    console.error("Chyba při aktualizaci profilu:", error)
    return { success: false, error: "Nepodařilo se uložit změny profilu." }
  }
}