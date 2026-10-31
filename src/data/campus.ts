import { Building, Equipment } from '../types';

export const INITIAL_CAMPUS_DATA: Building[] = [
  {
    id: 'bldg-1',
    name: 'Engineering Block A',
    departments: [
      {
        id: 'dept-1',
        name: 'Computer Science',
        buildingId: 'bldg-1',
        chair: 'Dr. Sarah Chen',
        monthlyReduction: 18.5,
        labs: [
          {
            id: 'lab-1',
            name: 'AI Research Lab',
            departmentId: 'dept-1',
            rooms: [
              {
                id: 'room-1',
                name: 'Room 101 - GPU Cluster',
                labId: 'lab-1',
                equipment: [
                  { id: 'eq-1', name: 'NVIDIA A100 Server', roomId: 'room-1', wattage: 4000, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.92, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-2', name: 'Workstation Array (x10)', roomId: 'room-1', wattage: 3500, operatingHours: { start: 8, end: 20 }, efficiencyFactor: 0.88, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-3', name: 'Cooling System', roomId: 'room-1', wattage: 2500, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.95, isActive: true, scheduleMultiplier: 1 },
                ]
              },
              {
                id: 'room-2',
                name: 'Room 102 - Student Lab',
                labId: 'lab-1',
                equipment: [
                  { id: 'eq-4', name: 'Desktop PCs (x30)', roomId: 'room-2', wattage: 9000, operatingHours: { start: 8, end: 22 }, efficiencyFactor: 0.85, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-5', name: 'Projector System', roomId: 'room-2', wattage: 450, operatingHours: { start: 9, end: 17 }, efficiencyFactor: 0.90, isActive: true, scheduleMultiplier: 1 },
                ]
              }
            ]
          },
          {
            id: 'lab-2',
            name: 'Network Security Lab',
            departmentId: 'dept-1',
            rooms: [
              {
                id: 'room-3',
                name: 'Room 201 - Cyber Range',
                labId: 'lab-2',
                equipment: [
                  { id: 'eq-6', name: 'Network Switches (x8)', roomId: 'room-3', wattage: 1200, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.93, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-7', name: 'Firewall Appliances', roomId: 'room-3', wattage: 800, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.91, isActive: true, scheduleMultiplier: 1 },
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dept-2',
        name: 'Electrical Engineering',
        buildingId: 'bldg-1',
        chair: 'Dr. Michael Park',
        monthlyReduction: 12.3,
        labs: [
          {
            id: 'lab-3',
            name: 'Power Electronics Lab',
            departmentId: 'dept-2',
            rooms: [
              {
                id: 'room-4',
                name: 'Room 301 - High Voltage',
                labId: 'lab-3',
                equipment: [
                  { id: 'eq-8', name: 'Oscilloscope Array', roomId: 'room-4', wattage: 1500, operatingHours: { start: 9, end: 17 }, efficiencyFactor: 0.87, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-9', name: 'Power Supply Units', roomId: 'room-4', wattage: 5000, operatingHours: { start: 9, end: 17 }, efficiencyFactor: 0.82, isActive: true, scheduleMultiplier: 1 },
                ]
              },
              {
                id: 'room-5',
                name: 'Room 302 - PCB Workshop',
                labId: 'lab-3',
                equipment: [
                  { id: 'eq-10', name: 'Soldering Stations (x12)', roomId: 'room-5', wattage: 960, operatingHours: { start: 9, end: 18 }, efficiencyFactor: 0.80, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-11', name: 'Fume Extractors', roomId: 'room-5', wattage: 600, operatingHours: { start: 9, end: 18 }, efficiencyFactor: 0.90, isActive: true, scheduleMultiplier: 1 },
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bldg-2',
    name: 'Science Building B',
    departments: [
      {
        id: 'dept-3',
        name: 'Chemistry',
        buildingId: 'bldg-2',
        chair: 'Dr. Elena Rodriguez',
        monthlyReduction: 8.7,
        labs: [
          {
            id: 'lab-4',
            name: 'Analytical Chemistry Lab',
            departmentId: 'dept-3',
            rooms: [
              {
                id: 'room-6',
                name: 'Room 401 - Instrument Room',
                labId: 'lab-4',
                equipment: [
                  { id: 'eq-12', name: 'Mass Spectrometer', roomId: 'room-6', wattage: 3000, operatingHours: { start: 8, end: 20 }, efficiencyFactor: 0.88, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-13', name: 'HPLC System', roomId: 'room-6', wattage: 2000, operatingHours: { start: 8, end: 20 }, efficiencyFactor: 0.85, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-14', name: 'Fume Hood Ventilation', roomId: 'room-6', wattage: 1800, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.92, isActive: true, scheduleMultiplier: 1 },
                ]
              },
              {
                id: 'room-7',
                name: 'Room 402 - Sample Prep',
                labId: 'lab-4',
                equipment: [
                  { id: 'eq-15', name: 'Centrifuges (x4)', roomId: 'room-7', wattage: 1200, operatingHours: { start: 9, end: 17 }, efficiencyFactor: 0.83, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-16', name: 'Autoclave', roomId: 'room-7', wattage: 4500, operatingHours: { start: 9, end: 16 }, efficiencyFactor: 0.78, isActive: true, scheduleMultiplier: 1 },
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dept-4',
        name: 'Physics',
        buildingId: 'bldg-2',
        chair: 'Dr. James Liu',
        monthlyReduction: 22.1,
        labs: [
          {
            id: 'lab-5',
            name: 'Quantum Computing Lab',
            departmentId: 'dept-4',
            rooms: [
              {
                id: 'room-8',
                name: 'Room 501 - Cryogenics',
                labId: 'lab-5',
                equipment: [
                  { id: 'eq-17', name: 'Dilution Refrigerator', roomId: 'room-8', wattage: 8000, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.95, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-18', name: 'Control Electronics', roomId: 'room-8', wattage: 2000, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.90, isActive: true, scheduleMultiplier: 1 },
                ]
              },
              {
                id: 'room-9',
                name: 'Room 502 - Optics Bench',
                labId: 'lab-5',
                equipment: [
                  { id: 'eq-19', name: 'Laser Systems', roomId: 'room-9', wattage: 1500, operatingHours: { start: 9, end: 18 }, efficiencyFactor: 0.86, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-20', name: 'Optical Tables Equipment', roomId: 'room-9', wattage: 500, operatingHours: { start: 9, end: 18 }, efficiencyFactor: 0.92, isActive: true, scheduleMultiplier: 1 },
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bldg-3',
    name: 'Arts & Humanities Center',
    departments: [
      {
        id: 'dept-5',
        name: 'Digital Media',
        buildingId: 'bldg-3',
        chair: 'Prof. Anna Williams',
        monthlyReduction: 15.4,
        labs: [
          {
            id: 'lab-6',
            name: 'Media Production Studio',
            departmentId: 'dept-5',
            rooms: [
              {
                id: 'room-10',
                name: 'Studio A - Video Editing',
                labId: 'lab-6',
                equipment: [
                  { id: 'eq-21', name: 'Editing Workstations (x8)', roomId: 'room-10', wattage: 4800, operatingHours: { start: 8, end: 22 }, efficiencyFactor: 0.87, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-22', name: 'Render Farm Node', roomId: 'room-10', wattage: 6000, operatingHours: { start: 0, end: 24 }, efficiencyFactor: 0.84, isActive: true, scheduleMultiplier: 1 },
                ]
              },
              {
                id: 'room-11',
                name: 'Studio B - Audio Suite',
                labId: 'lab-6',
                equipment: [
                  { id: 'eq-23', name: 'Audio Mixing Console', roomId: 'room-11', wattage: 800, operatingHours: { start: 9, end: 20 }, efficiencyFactor: 0.91, isActive: true, scheduleMultiplier: 1 },
                  { id: 'eq-24', name: 'Amplifier Array', roomId: 'room-11', wattage: 1200, operatingHours: { start: 9, end: 20 }, efficiencyFactor: 0.88, isActive: true, scheduleMultiplier: 1 },
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export function getAllEquipment(): Equipment[] {
  const equipment: Equipment[] = [];
  INITIAL_CAMPUS_DATA.forEach(building => {
    building.departments.forEach(dept => {
      dept.labs.forEach(lab => {
        lab.rooms.forEach(room => {
          room.equipment.forEach(eq => {
            equipment.push(eq);
          });
        });
      });
    });
  });
  return equipment;
}

export function getDepartmentById(deptId: string) {
  for (const building of INITIAL_CAMPUS_DATA) {
    for (const dept of building.departments) {
      if (dept.id === deptId) return dept;
    }
  }
  return null;
}
