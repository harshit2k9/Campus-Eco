export type UserRole = 'admin' | 'chair' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Building {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  buildingId: string;
  chair: string;
  labs: Lab[];
  monthlyReduction: number;
  rank?: number;
}

export interface Lab {
  id: string;
  name: string;
  departmentId: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  labId: string;
  equipment: Equipment[];
}

export interface Equipment {
  id: string;
  name: string;
  roomId: string;
  wattage: number; // Watts
  operatingHours: { start: number; end: number }; // 0-23
  efficiencyFactor: number; // 0-1
  isActive: boolean;
  scheduleMultiplier: number; // 0 or 1
}

export interface TelemetryEvent {
  id: string;
  timestamp: Date;
  equipmentId: string;
  roomId: string;
  labId: string;
  departmentId: string;
  buildingId: string;
  energyKWh: number;
  carbonKgCO2e: number;
  isAnomaly: boolean;
}

export interface Alert {
  id: string;
  timestamp: Date;
  type: 'idle_load' | 'threshold_exceeded' | 'weekend_activity' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  departmentId: string;
  roomId: string;
  equipmentId?: string;
  acknowledged: boolean;
}

export interface DepartmentMetrics {
  departmentId: string;
  totalEnergyKWh: number;
  totalCarbonKgCO2e: number;
  baselineEnergyKWh: number;
  reductionPercent: number;
  anomalyCount: number;
  lastUpdated: Date;
}

export interface HourlyData {
  hour: number;
  energy: number;
  carbon: number;
  baseline: number;
}
