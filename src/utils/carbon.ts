// Grid Carbon Intensity Factors (kg CO2e per kWh) by region
export const GRID_INTENSITY_FACTORS: Record<string, number> = {
  'US_Average': 0.42,
  'US_Coal_Heavy': 0.65,
  'US_Renewable_Heavy': 0.25,
  'EU_Average': 0.28,
  'UK': 0.21,
  'India': 0.72,
  'China': 0.58,
};

export const DEFAULT_REGION = 'US_Average';

/**
 * Carbon Footprint Conversion Formula:
 * CO2e = E(t) × Grid_Intensity_Factor
 */
export function convertToCarbon(energyKWh: number, region: string = DEFAULT_REGION): number {
  const factor = GRID_INTENSITY_FACTORS[region] || GRID_INTENSITY_FACTORS[DEFAULT_REGION];
  return energyKWh * factor;
}

/**
 * Telemetry Emulation Logic:
 * E(t) = P_rated × S(t) × η
 * 
 * Where:
 * - P_rated = device wattage rating (Watts)
 * - S(t) = operational schedule multiplier [0 or 1]
 * - η = efficiency factor
 */
export function calculateEnergyConsumption(
  wattage: number,
  scheduleMultiplier: number,
  efficiencyFactor: number,
  intervalMinutes: number = 1
): number {
  // Convert watts to kWh for the given interval
  const powerKW = wattage / 1000;
  const hoursFraction = intervalMinutes / 60;
  return powerKW * scheduleMultiplier * efficiencyFactor * hoursFraction;
}

/**
 * Check if current hour falls within operating schedule
 */
export function isWithinSchedule(
  currentHour: number,
  startHour: number,
  endHour: number
): boolean {
  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour;
  }
  // Overnight schedule (e.g., 22:00 - 06:00)
  return currentHour >= startHour || currentHour < endHour;
}

/**
 * Determine if current time is off-peak (weekend or outside 8am-6pm)
 */
export function isOffPeak(date: Date): boolean {
  const day = date.getDay();
  const hour = date.getHours();
  const isWeekend = day === 0 || day === 6;
  const isOffHours = hour < 8 || hour >= 18;
  return isWeekend || isOffHours;
}

/**
 * Detect anomaly: consumption exceeds 150% of baseline
 */
export function detectAnomaly(currentKWh: number, baselineKWh: number): boolean {
  return currentKWh > baselineKWh * 1.5;
}

/**
 * Calculate monthly reduction percentage
 */
export function calculateReduction(currentTotal: number, previousTotal: number): number {
  if (previousTotal === 0) return 0;
  return ((previousTotal - currentTotal) / previousTotal) * 100;
}

/**
 * Format energy values for display
 */
export function formatEnergy(kWh: number): string {
  if (kWh >= 1000) return `${(kWh / 1000).toFixed(2)} MWh`;
  return `${kWh.toFixed(3)} kWh`;
}

/**
 * Format carbon values for display
 */
export function formatCarbon(kgCO2e: number): string {
  if (kgCO2e >= 1000) return `${(kgCO2e / 1000).toFixed(2)} tCO₂e`;
  return `${kgCO2e.toFixed(3)} kg CO₂e`;
}
