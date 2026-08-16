// src/lib/calculations.ts

export interface CalculationInput {
  areaM2: number;
  thicknessCm: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number;
  density: number;
  lambda?: number | null;
}

export function calculateFoamProject(data: CalculationInput) {
  // 1. ZÁKLADNÍ ROZMĚRY A ZTRÁTY
  const thicknessM = data.thicknessCm / 100;
  
  // Kolik m² pokryje 1 m³
  const coveragePerM3 = thicknessM > 0 ? 1 / thicknessM : 0;
  
  const pureVolumeM3 = data.areaM2 * thicknessM;
  const totalVolumeM3 = pureVolumeM3 * data.wasteFactor;

  // 2. MATERIÁL VE VŠECH JEDNOTKÁCH (Fyzika)
  const totalVolumeLiters = totalVolumeM3 * 1000;
  const totalMassKg = totalVolumeM3 * data.density; 
  const kgPerM2 = (thicknessM * data.wasteFactor) * data.density; 

  // 3. SADY (Logistika)
  const exactSets = data.yieldPerSetM3 > 0 ? totalVolumeM3 / data.yieldPerSetM3 : 0;
  const totalSets = Math.ceil(exactSets);

  // 4. FINANCE (Ekonomika)
  const purchaseCost = totalSets * data.buyPricePerSet; 
  const exactMaterialCost = exactSets * data.buyPricePerSet; 
  
  const costPerM3 = data.yieldPerSetM3 > 0 ? data.buyPricePerSet / data.yieldPerSetM3 : 0;
  const costPerM2 = costPerM3 * (thicknessM * data.wasteFactor);

  // 5. TEPELNÝ ODPOR
  let thermalResistance: number | null = null;
  if (data.lambda && data.lambda > 0 && thicknessM > 0) {
    thermalResistance = thicknessM / data.lambda;
  }

  return {
    coveragePerM3: Number(coveragePerM3.toFixed(2)),
    pureVolumeM3: Number(pureVolumeM3.toFixed(2)),
    totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
    totalVolumeLiters: Number(totalVolumeLiters.toFixed(0)),
    totalMassKg: Number(totalMassKg.toFixed(2)),
    kgPerM2: Number(kgPerM2.toFixed(3)),
    
    exactSets: Number(exactSets.toFixed(2)),
    totalSets,
    
    costPerM3: Number(costPerM3.toFixed(2)),
    costPerM2: Number(costPerM2.toFixed(2)),
    exactMaterialCost: Number(exactMaterialCost.toFixed(2)),
    totalCost: Number(purchaseCost.toFixed(2)), 
    
    thermalResistance: thermalResistance ? Number(thermalResistance.toFixed(3)) : null,
  };
}

export function parseLambda(lambdaString?: string | null): number | null {
  if (!lambdaString) return null;
  const match = lambdaString.replace(',', '.').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}