// src/actions/ares.ts

'use server'

export type AresCompanyData = {
  ico: string
  dic?: string
  name: string
  street: string
  city: string
  zip: string
}

export async function fetchCompanyByIco(ico: string): Promise<{ success: boolean; data?: AresCompanyData; error?: string }> {
  // Očistíme IČO od mezer
  const cleanIco = ico.trim().replace(/\s+/g, '')

  // Základní validace formátu (IČO v ČR má 8 čísel)
  if (!/^\d{8}$/.test(cleanIco)) {
    return { success: false, error: 'IČO musí mít přesně 8 čísel.' }
  }

  try {
    // Oficiální REST API ARES v3
    const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-zaznamech/v-res/ekonomicke-subjekty/${cleanIco}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Subjekt s tímto IČO nebyl v registru ARES nalezen.' }
      }
      return { success: false, error: 'Chyba při komunikaci se serverem ARES.' }
    }

    const data = await response.json()

    // Zpracování odpovědi dle struktury ARES API
    const name = data.obchodniJmeno || ''
    const dic = data.dic || ''
    
    const sidlo = data.sidlo || {}
    const streetName = sidlo.nazevUlice || sidlo.nazevCastiObce || ''
    const houseNumber = sidlo.cisloDomovni 
      ? `${sidlo.cisloDomovni}${sidlo.cisloOrientacni ? `/${sidlo.cisloOrientacni}` : ''}` 
      : ''
    
    const street = `${streetName} ${houseNumber}`.trim()
    const city = sidlo.nazevObce || ''
    const zip = sidlo.psc ? String(sidlo.psc) : ''

    return {
      success: true,
      data: {
        ico: cleanIco,
        dic,
        name,
        street,
        city,
        zip,
      }
    }
  } catch (error) {
    console.error('ARES fetch error:', error)
    return { success: false, error: 'Nepodařilo se připojit k registru ARES.' }
  }
}