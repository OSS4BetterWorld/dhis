// Mock data for Risk Mapping & Zoning feature

export interface RiskZone {
  id: string;
  name: string;
  type: "flood" | "earthquake" | "fire" | "landslide" | "storm";
  riskLevel: "high" | "medium" | "low";
  coordinates: [number, number][];
  population: number;
  lastIncident?: string;
  description: string;
}

export interface Shelter {
  id: string;
  name: string;
  coordinates: [number, number];
  capacity: number;
  contact: string;
  facilities: string[];
  status: "operational" | "full" | "maintenance";
}

export interface EvacuationRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  type: "primary" | "secondary";
  status: "clear" | "blocked" | "congested";
}

export interface CriticalFacility {
  id: string;
  name: string;
  type: "hospital" | "police" | "fire_station" | "school" | "power_plant";
  coordinates: [number, number];
  contact: string;
  status: "operational" | "limited" | "offline";
}

export interface HazardLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  data: any[];
}

// Mock risk zones
export const mockRiskZones: RiskZone[] = [
  {
    id: "FZ_2025_001",
    name: "Northern River Basin",
    type: "flood",
    riskLevel: "high",
    coordinates: [
      [105.8342, 21.0285],
      [105.8452, 21.0285],
      [105.8452, 21.0185],
      [105.8342, 21.0185],
    ],
    population: 12300,
    lastIncident: "August 2023",
    description: "High flood risk area near Red River. Prone to overflow during monsoon season.",
  },
  {
    id: "EQ_2025_002",
    name: "Central Fault Zone",
    type: "earthquake",
    riskLevel: "medium",
    coordinates: [
      [105.8200, 21.0200],
      [105.8300, 21.0200],
      [105.8300, 21.0100],
      [105.8200, 21.0100],
    ],
    population: 8500,
    description: "Located near tectonic fault line. Moderate seismic activity recorded.",
  },
  {
    id: "LS_2025_003",
    name: "Western Hills District",
    type: "landslide",
    riskLevel: "high",
    coordinates: [
      [105.8100, 21.0350],
      [105.8200, 21.0350],
      [105.8200, 21.0250],
      [105.8100, 21.0250],
    ],
    population: 4200,
    lastIncident: "June 2024",
    description: "Steep slopes with high rainfall. Previous landslides recorded.",
  },
  {
    id: "FR_2025_004",
    name: "Eastern Forest Reserve",
    type: "fire",
    riskLevel: "medium",
    coordinates: [
      [105.8500, 21.0150],
      [105.8600, 21.0150],
      [105.8600, 21.0050],
      [105.8500, 21.0050],
    ],
    population: 2800,
    description: "Dense forest area with dry conditions during summer months.",
  },
];

// Mock shelters
export const mockShelters: Shelter[] = [
  {
    id: "SH_001",
    name: "Community Center Alpha",
    coordinates: [105.8380, 21.0240],
    capacity: 500,
    contact: "+84-24-3826-7890",
    facilities: ["Medical aid", "Food supplies", "Clean water", "Generators"],
    status: "operational",
  },
  {
    id: "SH_002",
    name: "Regional Sports Complex",
    coordinates: [105.8250, 21.0160],
    capacity: 1000,
    contact: "+84-24-3826-7891",
    facilities: ["Medical aid", "Food supplies", "Clean water", "Sleeping quarters"],
    status: "operational",
  },
  {
    id: "SH_003",
    name: "School Assembly Hall",
    coordinates: [105.8150, 21.0300],
    capacity: 300,
    contact: "+84-24-3826-7892",
    facilities: ["Basic supplies", "First aid"],
    status: "operational",
  },
];

// Mock evacuation routes
export const mockEvacuationRoutes: EvacuationRoute[] = [
  {
    id: "ER_001",
    name: "Northern Highway Route",
    coordinates: [
      [105.8340, 21.0280],
      [105.8360, 21.0260],
      [105.8380, 21.0240],
    ],
    type: "primary",
    status: "clear",
  },
  {
    id: "ER_002",
    name: "Eastern Bypass",
    coordinates: [
      [105.8450, 21.0200],
      [105.8420, 21.0180],
      [105.8380, 21.0160],
    ],
    type: "primary",
    status: "clear",
  },
  {
    id: "ER_003",
    name: "Western Access Road",
    coordinates: [
      [105.8150, 21.0300],
      [105.8200, 21.0280],
      [105.8250, 21.0260],
    ],
    type: "secondary",
    status: "clear",
  },
];

// Mock critical facilities
export const mockCriticalFacilities: CriticalFacility[] = [
  {
    id: "CF_001",
    name: "Central Hospital",
    type: "hospital",
    coordinates: [105.8320, 21.0220],
    contact: "+84-24-3826-1111",
    status: "operational",
  },
  {
    id: "CF_002",
    name: "District Police Station",
    type: "police",
    coordinates: [105.8280, 21.0180],
    contact: "+84-24-3826-2222",
    status: "operational",
  },
  {
    id: "CF_003",
    name: "Fire Department Station 1",
    type: "fire_station",
    coordinates: [105.8400, 21.0260],
    contact: "+84-24-3826-3333",
    status: "operational",
  },
  {
    id: "CF_004",
    name: "Regional Power Plant",
    type: "power_plant",
    coordinates: [105.8180, 21.0120],
    contact: "+84-24-3826-4444",
    status: "operational",
  },
];

// Mock hazard layers for admin view
export const mockHazardLayers: HazardLayer[] = [
  {
    id: "layer_flood",
    name: "Flood Zones",
    type: "flood",
    visible: true,
    data: mockRiskZones.filter((z) => z.type === "flood"),
  },
  {
    id: "layer_earthquake",
    name: "Earthquake Zones",
    type: "earthquake",
    visible: false,
    data: mockRiskZones.filter((z) => z.type === "earthquake"),
  },
  {
    id: "layer_landslide",
    name: "Landslide Zones",
    type: "landslide",
    visible: false,
    data: mockRiskZones.filter((z) => z.type === "landslide"),
  },
  {
    id: "layer_fire",
    name: "Fire Risk Zones",
    type: "fire",
    visible: false,
    data: mockRiskZones.filter((z) => z.type === "fire"),
  },
];

export const mockApi = {
  async getRiskZones(): Promise<RiskZone[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRiskZones;
  },

  async getShelters(): Promise<Shelter[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockShelters;
  },

  async getEvacuationRoutes(): Promise<EvacuationRoute[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockEvacuationRoutes;
  },

  async getCriticalFacilities(): Promise<CriticalFacility[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCriticalFacilities;
  },

  async getHazardLayers(): Promise<HazardLayer[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockHazardLayers;
  },
};
