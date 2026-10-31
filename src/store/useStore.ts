import { create } from 'zustand';
import { User, Equipment, TelemetryEvent, Alert, DepartmentMetrics } from '../types';
import { INITIAL_CAMPUS_DATA, getAllEquipment } from '../data/campus';
import { initializeSimulationState, generateTelemetryTick, generateHistoricalData, SimulationState } from '../data/simulation';
import { convertToCarbon, calculateReduction } from '../utils/carbon';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Campus Data
  equipment: Equipment[];
  addEquipment: (eq: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  toggleEquipment: (id: string) => void;

  // Telemetry
  events: TelemetryEvent[];
  simulationState: SimulationState;
  isSimulating: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  tickCount: number;

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  clearAcknowledged: () => void;

  // Metrics
  getDepartmentMetrics: () => DepartmentMetrics[];
  getHourlyData: (departmentId?: string) => { hour: number; energy: number; carbon: number; baseline: number }[];
  region: string;
  setRegion: (region: string) => void;
}

const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@campus.edu', role: 'admin', department: 'All' },
  { id: 'u2', name: 'Dr. Sarah Chen', email: 'sarah@campus.edu', role: 'chair', department: 'Computer Science' },
  { id: 'u3', name: 'Tech Staff', email: 'tech@campus.edu', role: 'technician', department: 'Computer Science' },
];

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (email: string, _password: string) => {
    const user = DEMO_USERS.find(u => u.email === email);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Campus Data
  equipment: getAllEquipment(),
  addEquipment: (eq) => set(state => ({
    equipment: [...state.equipment, { ...eq, id: `eq-${Date.now()}` }]
  })),
  updateEquipment: (id, updates) => set(state => ({
    equipment: state.equipment.map(eq => eq.id === id ? { ...eq, ...updates } : eq)
  })),
  deleteEquipment: (id) => set(state => ({
    equipment: state.equipment.filter(eq => eq.id !== id)
  })),
  toggleEquipment: (id) => set(state => ({
    equipment: state.equipment.map(eq => eq.id === id ? { ...eq, isActive: !eq.isActive } : eq)
  })),

  // Telemetry
  events: generateHistoricalData(),
  simulationState: initializeSimulationState(),
  isSimulating: false,
  tickCount: 0,
  startSimulation: () => {
    set({ isSimulating: true });
  },
  stopSimulation: () => {
    set({ isSimulating: false });
  },

  // Alerts
  alerts: [],
  acknowledgeAlert: (id) => set(state => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a)
  })),
  clearAcknowledged: () => set(state => ({
    alerts: state.alerts.filter(a => !a.acknowledged)
  })),

  // Metrics
  region: 'US_Average',
  setRegion: (region) => set({ region }),
  
  getDepartmentMetrics: () => {
    const state = get();
    const metrics: DepartmentMetrics[] = [];

    for (const building of INITIAL_CAMPUS_DATA) {
      for (const dept of building.departments) {
        const deptEvents = state.events.filter(e => e.departmentId === dept.id);
        const totalEnergy = deptEvents.reduce((sum, e) => sum + e.energyKWh, 0);
        const totalCarbon = deptEvents.reduce((sum, e) => sum + e.carbonKgCO2e, 0);
        const baseline = state.simulationState.departmentBaselines.get(dept.id) || totalEnergy;
        const anomalyCount = deptEvents.filter(e => e.isAnomaly).length;
        const reduction = calculateReduction(totalEnergy, baseline * 1.2);

        metrics.push({
          departmentId: dept.id,
          totalEnergyKWh: totalEnergy,
          totalCarbonKgCO2e: totalCarbon,
          baselineEnergyKWh: baseline,
          reductionPercent: Math.max(0, reduction),
          anomalyCount,
          lastUpdated: new Date(),
        });
      }
    }

    return metrics.sort((a, b) => b.reductionPercent - a.reductionPercent);
  },

  getHourlyData: (departmentId?: string) => {
    const state = get();
    const hours: { hour: number; energy: number; carbon: number; baseline: number }[] = [];
    
    for (let h = 0; h < 24; h++) {
      const filteredEvents = state.events.filter(e => {
        const eventHour = e.timestamp.getHours();
        const hourMatch = eventHour === h;
        const deptMatch = departmentId ? e.departmentId === departmentId : true;
        return hourMatch && deptMatch;
      });

      const energy = filteredEvents.reduce((sum, e) => sum + e.energyKWh, 0);
      const carbon = filteredEvents.reduce((sum, e) => sum + e.carbonKgCO2e, 0);
      const baseline = energy * 0.85; // Baseline is ~15% lower

      hours.push({ hour: h, energy, carbon, baseline });
    }

    return hours;
  },
}));

// Simulation interval handler
let simulationInterval: ReturnType<typeof setInterval> | null = null;

export function startSimulationLoop() {
  if (simulationInterval) return;
  
  useStore.getState().startSimulation();
  
  simulationInterval = setInterval(() => {
    const state = useStore.getState();
    if (!state.isSimulating) {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      return;
    }

    const now = new Date();
    const { newEvents, newAlerts } = generateTelemetryTick(state.simulationState, now);
    
    set(s => ({
      events: [...s.events.slice(-5000), ...newEvents], // Keep last 5000 events
      alerts: [...newAlerts, ...s.alerts].slice(0, 200), // Keep last 200 alerts
      tickCount: s.tickCount + 1,
    }));
  }, 5000); // Tick every 5 seconds for demo (represents 60s in real system)
}

export function stopSimulationLoop() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  useStore.getState().stopSimulation();
}

function set(fn: (state: AppState) => Partial<AppState>) {
  useStore.setState(fn);
}
