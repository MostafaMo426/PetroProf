/**
 * lib/services/pricing.ts
 * Dynamic pricing calculation engine for PetroProf manpower dispatch in Saudi Arabia.
 * Base rates in SAR per 8-hour shift according to IRATA & Saudi Aramco/SABIC standards.
 */

export interface PricingParams {
  level1Count: number
  level2Count: number
  level3Count: number
  durationDays: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  specializations?: string[]
  includeEquipmentPackage?: boolean
  emergencyDispatch?: boolean
}

export interface QuoteBreakdown {
  level1Total: number
  level2Total: number
  level3Total: number
  laborSubtotal: number
  riskAdjustment: number
  specializationFee: number
  equipmentPackageFee: number
  mobilizationFee: number
  emergencyFee: number
  subtotal: number
  vatAmount: number // 15% Saudi VAT
  grandTotalSar: number
  dailyRateEquivalent: number
}

// Daily rates per technician (SAR)
export const DAILY_RATES_SAR = {
  level_1: 850,     // Entry / Intermediate Technician
  level_2: 1250,    // Advanced Technician / Rigging Lead
  level_3: 1850,    // Safety Supervisor (Mandatory on industrial sites)
}

// Risk multiplier additions (percentage)
export const RISK_MULTIPLIERS = {
  low: 0,
  medium: 0.08,   // +8% (moderate height, standard offshore)
  high: 0.18,     // +18% (confined spaces, high wind, live plant)
  critical: 0.30, // +30% (flare stacks, toxic gas/H2S zones)
}

export function calculateDynamicQuote(params: PricingParams): QuoteBreakdown {
  const days = Math.max(1, params.durationDays || 1)

  const level1Total = params.level1Count * DAILY_RATES_SAR.level_1 * days
  const level2Total = params.level2Count * DAILY_RATES_SAR.level_2 * days
  const level3Total = params.level3Count * DAILY_RATES_SAR.level_3 * days

  const laborSubtotal = level1Total + level2Total + level3Total

  // Risk allowance
  const riskMultiplier = RISK_MULTIPLIERS[params.riskLevel] || 0
  const riskAdjustment = Math.round(laborSubtotal * riskMultiplier)

  // Specialization premiums (NDT, Welding, Painting: SAR 150/tech/day)
  const specCount = params.specializations?.length || 0
  const totalTechs = params.level1Count + params.level2Count + params.level3Count
  const specializationFee = specCount > 0 ? totalTechs * 150 * days : 0

  // Certified Rope Access Equipment kit (Harness, descenders, backup devices, ropes): SAR 250/tech/day
  const equipmentPackageFee = params.includeEquipmentPackage ? totalTechs * 250 * days : 0

  // Mobilization & Site Setup (Fixed per deployment)
  const mobilizationFee = totalTechs > 0 ? (totalTechs <= 4 ? 2500 : 4500) : 0

  // Emergency dispatch (< 48 hrs notice: 15% surcharge)
  const emergencyFee = params.emergencyDispatch ? Math.round(laborSubtotal * 0.15) : 0

  const subtotal =
    laborSubtotal +
    riskAdjustment +
    specializationFee +
    equipmentPackageFee +
    mobilizationFee +
    emergencyFee

  const vatAmount = Math.round(subtotal * 0.15)
  const grandTotalSar = subtotal + vatAmount
  const dailyRateEquivalent = Math.round(grandTotalSar / days)

  return {
    level1Total,
    level2Total,
    level3Total,
    laborSubtotal,
    riskAdjustment,
    specializationFee,
    equipmentPackageFee,
    mobilizationFee,
    emergencyFee,
    subtotal,
    vatAmount,
    grandTotalSar,
    dailyRateEquivalent,
  }
}
