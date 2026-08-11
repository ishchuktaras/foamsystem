// src/actions/settings.ts

'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCompanyProfile() {
  try {
    let profile = await prisma.companyProfile.findUnique({
      where: { id: 'default' }
    })
    
    // Pokud profil ještě neexistuje, vytvoříme prázdný základ
    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: { id: 'default' }
      })
    }
    
    return profile
  } catch (error) {
    console.error('Chyba při načítání firemního profilu:', error)
    return null
  }
}

export async function updateCompanyProfile(data: {
  companyName?: string; ico?: string; dic?: string; street?: string;
  city?: string; zip?: string; bankAccount?: string; phone?: string;
  email?: string; website?: string;
}) {
  try {
    await prisma.companyProfile.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data }
    })
    
    revalidatePath('/admin/settings/company')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Chyba při ukládání firemních údajů.' }
  }
}