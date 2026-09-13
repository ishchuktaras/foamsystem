// src/actions/evidence.ts
'use server'

import { db } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// 1. FUNKCE PRO APLIKÁTORA NA STAVBĚ (MOBILNÍ FORMULÁŘ)
export async function submitJobEvidence(formData: {
  quoteId: string;
  ambientTemp: number;
  internalTemp: number;
  surfaceTemp: number;
  surfaceType: string;
  reactorStart: number;
  reactorEnd: number;
  foilRolls: number;
  packingHours: number;
  generatorKwh: number;
}) {
  try {
    // Ověření autorizace (zda je uživatel přihlášen)
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Pro odeslání musíte být přihlášeni jako aplikátor.' }
    }

    // Bezpečný zápis / aktualizace technického deníku (Upsert = Update nebo Insert)
    await db.$transaction([
      db.jobEvidence.upsert({
        where: { quoteId: formData.quoteId },
        update: {
          ambientTemp: formData.ambientTemp,
          internalTemp: formData.internalTemp,
          surfaceTemp: formData.surfaceTemp,
          surfaceType: formData.surfaceType,
          reactorStart: formData.reactorStart,
          reactorEnd: formData.reactorEnd,
          foilRolls: formData.foilRolls,
          packingHours: formData.packingHours,
          generatorKwh: formData.generatorKwh,
        },
        create: {
          quoteId: formData.quoteId,
          ambientTemp: formData.ambientTemp,
          internalTemp: formData.internalTemp,
          surfaceTemp: formData.surfaceTemp,
          surfaceType: formData.surfaceType,
          reactorStart: formData.reactorStart,
          reactorEnd: formData.reactorEnd,
          foilRolls: formData.foilRolls,
          packingHours: formData.packingHours,
          generatorKwh: formData.generatorKwh,
        }
      }),
      // Přepnutí zakázky do stavu "Dokončeno"
      db.quote.update({
        where: { id: formData.quoteId },
        data: { status: 'COMPLETED' }
      })
    ])

    revalidatePath('/admin')
    revalidatePath('/admin/quotes')
    revalidatePath(`/admin/quotes/${formData.quoteId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Chyba při ukládání evidence aplikátorem:', error)
    return { success: false, error: 'Nepodařilo se uložit data do databáze. Zkontrolujte připojení.' }
  }
}

// 2. FUNKCE PRO SUPERVIZORA (FINANČNÍ VYÚČTOVÁNÍ V ADMINU)
export async function saveBillingData(
  evidenceId: string, 
  data: {
    pricePerKg: number
    machineCoefficient: number
    packingPriceRate: number
    heightsSurcharge: number
    difficultEnvSurcharge: number
    finalInvoiceTotal: number
    generatorSurcharge?: number
  }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role === 'APLIKATOR' || session.user.role === 'POMOCNIK') {
      return { success: false, error: 'Pro finanční úpravy nemáte dostatečná oprávnění.' }
    }

    await db.jobEvidence.update({
      where: { id: evidenceId },
      data: {
        pricePerKg: data.pricePerKg,
        machineCoefficient: data.machineCoefficient,
        packingPriceRate: data.packingPriceRate,
        heightsSurcharge: data.heightsSurcharge,
        difficultEnvSurcharge: data.difficultEnvSurcharge,
        finalInvoiceTotal: data.finalInvoiceTotal,
        generatorSurcharge: data.generatorSurcharge,
      }
    })
    
    revalidatePath('/admin/evidence')
    return { success: true }
  } catch (error) {
    console.error('Chyba při ukládání finančního vyúčtování:', error)
    return { success: false, error: 'Nepodařilo se uložit data vyúčtování. Kontaktujte podporu.' }
  }
}