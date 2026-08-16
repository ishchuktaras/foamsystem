// src/lib/calculations.ts

export interface CalculationInput {
  areaM2: number;
  thicknessCm: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number;
  density: number;         // Hustota z technického listu (např. 8.3 kg/m³)
  lambda?: number | null;
}

export function calculateFoamProject(data: CalculationInput) {
  // 1. ZÁKLADNÍ ROZMĚRY A ZTRÁTY
  const thicknessM = data.thicknessCm / 100;
  const pureVolumeM3 = data.areaM2 * thicknessM;
  const totalVolumeM3 = pureVolumeM3 * data.wasteFactor;

  // 2. MATERIÁL VE VŠECH JEDNOTKÁCH (Fyzika)
  const totalVolumeLiters = totalVolumeM3 * 1000; // 1 m³ = 1000 litrů expandované pěny
  const totalMassKg = totalVolumeM3 * data.density; // Celková hmotnost vystříkaného materiálu
  const kgPerM2 = (thicknessM * data.wasteFactor) * data.density; // Kolik kg padne na 1 m²

  // 3. SADY (Logistika)
  const exactSets = data.yieldPerSetM3 > 0 ? totalVolumeM3 / data.yieldPerSetM3 : 0;
  const totalSets = Math.ceil(exactSets); // Nakupujeme po celých sadách

  // 4. FINANCE (Ekonomika)
  const purchaseCost = totalSets * data.buyPricePerSet; // Kolik zaplatíme dodavateli (celé sady)
  const exactMaterialCost = exactSets * data.buyPricePerSet; // Hodnota reálně vystříkaného materiálu
  
  // Cena za 1 m³ (Nákupní cena sady / Vydatnost sady)
  const costPerM3 = data.yieldPerSetM3 > 0 ? data.buyPricePerSet / data.yieldPerSetM3 : 0;
  
  // Cena za 1 m² při zadané tloušťce a ztrátě
  const costPerM2 = costPerM3 * (thicknessM * data.wasteFactor);

  // 5. TEPELNÝ ODPOR
  let thermalResistance: number | null = null;
  if (data.lambda && data.lambda > 0 && thicknessM > 0) {
    thermalResistance = thicknessM / data.lambda;
  }

  return {
    // Objem a hmota
    totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
    totalVolumeLiters: Number(totalVolumeLiters.toFixed(0)), // Litry zaokrouhlíme na celé
    totalMassKg: Number(totalMassKg.toFixed(2)),
    kgPerM2: Number(kgPerM2.toFixed(3)),
    
    // Logistika
    exactSets: Number(exactSets.toFixed(2)),
    totalSets,
    
    // Ekonomika
    costPerM3: Number(costPerM3.toFixed(2)),
    costPerM2: Number(costPerM2.toFixed(2)),
    exactMaterialCost: Number(exactMaterialCost.toFixed(2)),
    purchaseCost: Number(purchaseCost.toFixed(2)),
    
    // Fyzika
    thermalResistance: thermalResistance ? Number(thermalResistance.toFixed(3)) : null,
  };
}

export function parseLambda(lambdaString?: string | null): number | null {
  if (!lambdaString) return null;
  const match = lambdaString.replace(',', '.').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}