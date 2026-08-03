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
  const cleanIco = ico.trim().replace(/\s+/g, '')

  if (!/^\d{8}$/.test(cleanIco)) {
    return { success: false, error: 'IČO musí mít přesně 8 čísel.' }
  }

  try {
    // Opravená URL: směřujeme do BE (backendu), nikoliv do V-ZAZNAMECH (frontendu)
    const url = `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${cleanIco}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Subjekt s tímto IČO nebyl v registru ARES nalezen.' }
      }
      return { success: false, error: `Chyba serveru ARES (kód: ${response.status})` }
    }

    // Nyní již bezpečně dostaneme čistý JSON
    const data = await response.json()

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
  } catch (error: unknown) {
    console.error('ARES fetch error detail:', error)
    const message = error instanceof Error ? error.message : 'Neznámá chyba'
    return { success: false, error: `Nelze se připojit k ARES: ${message}` }
  }
}