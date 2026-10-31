import { TelemetryEvent, Alert } from '../types';
import { INITIAL_CAMPUS_DATA } from '../data/campus';
import { calculateEnergyConsumption, convertToCarbon, isWithinSchedule, isOffPeak, detectAnomaly } from '../utils/carbon';
import { v4 as uuidv4 } from 'uuid';

const INTERVAL_MINUTES = 1;
const BASELINE_MULTIPLIER = 1.2; // 20% above normal triggers anomaly

export interface SimulationState {
  events: TelemetryEvent[];
  alerts: Alert[];
  hourlyHistory: Map<string, { energy: number; carbon: number; count: number }[]>;
  departmentBaselines: Map<string, number>;
}

/**
 * Generate a single telemetry tick for all equipment
 */
export function generateTelemetryTick(
  state: SimulationState,
  currentTime: Date
): { newEvents: TelemetryEvent[]; newAlerts: Alert[] } {
  const newEvents: TelemetryEvent[] = [];
  const newAlerts: Alert[] = [];
  const currentHour = currentTime.getHours();
  const isOff = isOffPeak(currentTime);

  for (const building of INITIAL_CAMPUS_DATA) {
    for (const dept of building.departments) {
      let deptEnergy = 0;
      
      for (const lab of dept.labs) {
        for (const room of lab.rooms) {
          for (const eq of room.equipment) {
            if (!eq.isActive) continue;

            const inSchedule = isWithinSchedule(currentHour, eq.operatingHours.start, eq.operatingHours.end);
            const scheduleMultiplier = inSchedule ? 1 : 0;
            
            // Add random variance (±10%) to simulate real-world fluctuations
            const variance = 0.9 + Math.random() * 0.2;
            const energyKWh = calculateEnergyConsumption(
              eq.wattage * variance,
              scheduleMultiplier,
              eq.efficiencyFactor,
              INTERVAL_MINUTES
            );

            const carbonKgCO2e = convertToCarbon(energyKWh);
            const baseline = (state.departmentBaselines.get(dept.id) || energyKWh * 5) / 5;
            const isAnomaly = detectAnomaly(energyKWh, baseline);

            const event: TelemetryEvent = {
              id: uuidv4(),
              timestamp: new Date(currentTime),
              equipmentId: eq.id,
              roomId: room.id,
              labId: lab.id,
              departmentId: dept.id,
              buildingId: building.id,
              energyKWh,
              carbonKgCO2e,
              isAnomaly,
            };

            newEvents.push(event);
            deptEnergy += energyKWh;

            // Update hourly history
            const historyKey = `${dept.id}-${currentHour}`;
            if (!state.hourlyHistory.has(historyKey)) {
              state.hourlyHistory.set(historyKey, []);
            }
            const hourData = state.hourlyHistory.get(historyKey)!;
            const lastEntry = hourData[hourData.length - 1];
            if (lastEntry && lastEntry.count < 60) {
              lastEntry.energy += energyKWh;
              lastEntry.carbon += carbonKgCO2e;
              lastEntry.count++;
            } else {
              hourData.push({ energy: energyKWh, carbon: carbonKgCO2e, count: 1 });
            }

            // Check for anomalies
            if (isAnomaly) {
              newAlerts.push({
                id: uuidv4(),
                timestamp: new Date(currentTime),
                type: 'anomaly',
                severity: 'high',
                message: `Anomaly detected: ${eq.name} in ${room.name} consuming ${(energyKWh * 1000).toFixed(0)}W (${((energyKWh / baseline - 1) * 100).toFixed(0)}% above baseline)`,
                departmentId: dept.id,
                roomId: room.id,
                equipmentId: eq.id,
                acknowledged: false,
              });
            }

            // Check for idle/off-peak activity
            if (isOff && scheduleMultiplier === 0 && energyKWh > 0) {
              // Equipment running outside schedule
            } else if (isOff && inSchedule && energyKWh > 0) {
              const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
              newAlerts.push({
                id: uuidv4(),
                timestamp: new Date(currentTime),
                type: isWeekend ? 'weekend_activity' : 'idle_load',
                severity: isWeekend ? 'critical' : 'medium',
                message: `${isWeekend ? 'Weekend' : 'Off-peak'} activity: ${eq.name} in ${room.name} is running (${eq.wattage}W)`,
                departmentId: dept.id,
                roomId: room.id,
                equipmentId: eq.id,
                acknowledged: false,
              });
            }
          }
        }
      }

      // Check department threshold
      const threshold = deptEnergy * BASELINE_MULTIPLIER;
      if (deptEnergy > threshold * 0.8 && Math.random() < 0.05) {
        newAlerts.push({
          id: uuidv4(),
          timestamp: new Date(currentTime),
          type: 'threshold_exceeded',
          severity: 'medium',
          message: `Department ${dept.name} approaching energy threshold: ${(deptEnergy).toFixed(3)} kWh this interval`,
          departmentId: dept.id,
          roomId: '',
          acknowledged: false,
        });
      }
    }
  }

  return { newEvents, newAlerts };
}

/**
 * Initialize simulation state with baselines
 */
export function initializeSimulationState(): SimulationState {
  const departmentBaselines = new Map<string, number>();
  
  for (const building of INITIAL_CAMPUS_DATA) {
    for (const dept of building.departments) {
      let totalWattage = 0;
      for (const lab of dept.labs) {
        for (const room of lab.rooms) {
          for (const eq of room.equipment) {
            totalWattage += eq.wattage * eq.efficiencyFactor;
          }
        }
      }
      // Baseline: expected energy for 8 operating hours
      departmentBaselines.set(dept.id, (totalWattage / 1000) * 8);
    }
  }

  return {
    events: [],
    alerts: [],
    hourlyHistory: new Map(),
    departmentBaselines,
  };
}

/**
 * Generate historical data for the past 24 hours (for initial dashboard display)
 */
export function generateHistoricalData(): TelemetryEvent[] {
  const events: TelemetryEvent[] = [];
  const now = new Date();
  
  for (let hoursAgo = 23; hoursAgo >= 0; hoursAgo--) {
    const time = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const hour = time.getHours();
    
    for (const building of INITIAL_CAMPUS_DATA) {
      for (const dept of building.departments) {
        for (const lab of dept.labs) {
          for (const room of lab.rooms) {
            for (const eq of room.equipment) {
              if (!eq.isActive) continue;
              
              const inSchedule = isWithinSchedule(hour, eq.operatingHours.start, eq.operatingHours.end);
              const scheduleMultiplier = inSchedule ? 1 : 0;
              
              // Generate 60 events per hour (one per minute)
              for (let minute = 0; minute < 60; minute += 5) {
                const eventTime = new Date(time.getTime() + minute * 60 * 1000);
                const variance = 0.85 + Math.random() * 0.3;
                const energyKWh = calculateEnergyConsumption(
                  eq.wattage * variance,
                  scheduleMultiplier,
                  eq.efficiencyFactor,
                  5 // 5-minute intervals for historical
                );

                events.push({
                  id: uuidv4(),
                  timestamp: eventTime,
                  equipmentId: eq.id,
                  roomId: room.id,
                  labId: lab.id,
                  departmentId: dept.id,
                  buildingId: building.id,
                  energyKWh,
                  carbonKgCO2e: convertToCarbon(energyKWh),
                  isAnomaly: false,
                });
              }
            }
          }
        }
      }
    }
  }
  
  return events;
}
