// Mock API service to simulate backend data fetching

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface DisasterData {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  lastEvent: string;
}

export interface HistoricalEvent {
  type: string;
  location: string;
  date: string;
  intensity: string;
  casualties: number;
  economicLoss: string;
}

export interface ExposureData {
  population: {
    urban: number;
    rural: number;
    vulnerableGroups: {
      children: number;
      elderly: number;
      disabled: number;
      lowIncome: number;
    };
  };
  infrastructure: {
    hospitals: number;
    schools: number;
    powerPlants: number;
    commTowers: number;
    transportHubs: number;
  };
  economicAssets: {
    factories: number;
    warehouses: number;
    commercial: number;
    farms: number;
  };
  culturalHeritage: {
    temples: number;
    monuments: number;
    archives: number;
  };
}

// Simulate API calls with realistic delays
export const mockApi = {
  async getDisasterTypes(): Promise<DisasterData[]> {
    await delay(800);
    return [
      {
        title: "Earthquake",
        description: "Seismic activity and ground movement monitoring",
        severity: "medium",
        lastEvent: "2024-03-15, 5.2 magnitude"
      },
      {
        title: "Flood",
        description: "Water level tracking and flood risk assessment",
        severity: "high",
        lastEvent: "2024-10-02, Regional flooding"
      },
      {
        title: "Tsunami",
        description: "Ocean wave monitoring and coastal alerts",
        severity: "low",
        lastEvent: "2023-11-08, Minor warning"
      },
      {
        title: "Cyclone",
        description: "Storm system tracking and wind monitoring",
        severity: "medium",
        lastEvent: "2024-09-20, Category 3"
      },
      {
        title: "Wildfire",
        description: "Fire hotspot detection and spread prediction",
        severity: "high",
        lastEvent: "2024-10-01, Active fires"
      },
      {
        title: "Landslide",
        description: "Slope stability and soil movement analysis",
        severity: "medium",
        lastEvent: "2024-08-12, Minor slides"
      },
      {
        title: "Epidemic",
        description: "Disease outbreak tracking and health monitoring",
        severity: "low",
        lastEvent: "2024-07-30, Contained"
      },
      {
        title: "Industrial Accident",
        description: "Facility monitoring and hazardous material tracking",
        severity: "low",
        lastEvent: "2024-06-15, Minor incident"
      }
    ];
  },

  async getHistoricalEvents(): Promise<HistoricalEvent[]> {
    await delay(600);
    return [
      {
        type: "Earthquake",
        location: "Northern Region, District A",
        date: "2024-03-15",
        intensity: "5.2 Magnitude",
        casualties: 12,
        economicLoss: "$2.3M"
      },
      {
        type: "Flood",
        location: "Central Valley, District B",
        date: "2024-10-02",
        intensity: "Severe",
        casualties: 45,
        economicLoss: "$15.7M"
      },
      {
        type: "Cyclone",
        location: "Coastal Region, District C",
        date: "2024-09-20",
        intensity: "Category 3",
        casualties: 8,
        economicLoss: "$8.4M"
      },
      {
        type: "Wildfire",
        location: "Forest Area, District D",
        date: "2024-10-01",
        intensity: "High",
        casualties: 3,
        economicLoss: "$4.2M"
      },
      {
        type: "Landslide",
        location: "Mountain Region, District E",
        date: "2024-08-12",
        intensity: "Moderate",
        casualties: 6,
        economicLoss: "$1.8M"
      }
    ];
  },

  async getExposureData(): Promise<ExposureData> {
    await delay(700);
    return {
      population: {
        urban: 2450000,
        rural: 1320000,
        vulnerableGroups: {
          children: 850000,
          elderly: 420000,
          disabled: 180000,
          lowIncome: 920000
        }
      },
      infrastructure: {
        hospitals: 45,
        schools: 380,
        powerPlants: 8,
        commTowers: 120,
        transportHubs: 25
      },
      economicAssets: {
        factories: 156,
        warehouses: 89,
        commercial: 420,
        farms: 1250
      },
      culturalHeritage: {
        temples: 78,
        monuments: 34,
        archives: 12
      }
    };
  }
};
