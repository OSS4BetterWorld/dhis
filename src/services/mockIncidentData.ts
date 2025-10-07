export interface IncidentReport {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'responding' | 'resolved';
  evidence: {
    photos: string[];
    videos: string[];
  };
  resourceNeeds: ResourceNeed[];
  urgentCases: UrgentCase[];
}

export interface ResourceNeed {
  id: string;
  type: 'medical' | 'food' | 'water' | 'boat' | 'blanket' | 'fuel' | 'other';
  quantity: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'needed' | 'en-route' | 'delivered';
  requestedAt: string;
}

export interface UrgentCase {
  id: string;
  type: 'injured' | 'child' | 'infant' | 'pregnant' | 'elderly' | 'disabled';
  description: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'pending' | 'evacuating' | 'evacuated';
}

export interface RescueTeam {
  id: string;
  name: string;
  type: 'rescue' | 'medical' | 'delivery';
  status: 'standby' | 'en-route' | 'on-site' | 'returning';
  currentLocation: {
    lat: number;
    lng: number;
  };
  destination?: {
    lat: number;
    lng: number;
    incidentId: string;
  };
  route?: Array<{ lat: number; lng: number }>;
  members: number;
  resources: string[];
  eta?: string;
}

// Mock data
export const mockIncidents: IncidentReport[] = [
  {
    id: 'INC-001',
    location: {
      lat: 10.7769,
      lng: 106.7009,
      address: 'District 1, Ho Chi Minh City'
    },
    severity: 'critical',
    type: 'Severe Flooding',
    description: 'Water level rising rapidly, multiple families trapped on rooftops',
    reportedBy: 'Nguyen Van A',
    reportedAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'responding',
    evidence: {
      photos: ['/placeholder.svg', '/placeholder.svg'],
      videos: []
    },
    resourceNeeds: [
      {
        id: 'RN-001',
        type: 'boat',
        quantity: 3,
        priority: 'critical',
        status: 'en-route',
        requestedAt: new Date(Date.now() - 1200000).toISOString()
      },
      {
        id: 'RN-002',
        type: 'medical',
        quantity: 1,
        priority: 'high',
        status: 'needed',
        requestedAt: new Date(Date.now() - 1200000).toISOString()
      },
      {
        id: 'RN-003',
        type: 'food',
        quantity: 50,
        priority: 'medium',
        status: 'needed',
        requestedAt: new Date(Date.now() - 600000).toISOString()
      }
    ],
    urgentCases: [
      {
        id: 'UC-001',
        type: 'pregnant',
        description: 'Pregnant woman in labor, needs immediate medical attention',
        priority: 'critical',
        status: 'pending'
      },
      {
        id: 'UC-002',
        type: 'infant',
        description: '2 infants, 6 months old, need evacuation',
        priority: 'high',
        status: 'pending'
      }
    ]
  },
  {
    id: 'INC-002',
    location: {
      lat: 10.7850,
      lng: 106.6950,
      address: 'District 3, Ho Chi Minh City'
    },
    severity: 'high',
    type: 'Flooding',
    description: 'Street flooding, 15 households affected',
    reportedBy: 'Tran Thi B',
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'responding',
    evidence: {
      photos: ['/placeholder.svg'],
      videos: ['/placeholder.svg']
    },
    resourceNeeds: [
      {
        id: 'RN-004',
        type: 'water',
        quantity: 100,
        priority: 'high',
        status: 'en-route',
        requestedAt: new Date(Date.now() - 2400000).toISOString()
      },
      {
        id: 'RN-005',
        type: 'blanket',
        quantity: 30,
        priority: 'medium',
        status: 'needed',
        requestedAt: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    urgentCases: [
      {
        id: 'UC-003',
        type: 'elderly',
        description: '3 elderly people with mobility issues',
        priority: 'high',
        status: 'evacuating'
      }
    ]
  },
  {
    id: 'INC-003',
    location: {
      lat: 10.7700,
      lng: 106.7100,
      address: 'District 4, Ho Chi Minh City'
    },
    severity: 'medium',
    type: 'Moderate Flooding',
    description: 'Road partially flooded, traffic disrupted',
    reportedBy: 'Le Van C',
    reportedAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'resolved',
    evidence: {
      photos: ['/placeholder.svg', '/placeholder.svg'],
      videos: []
    },
    resourceNeeds: [],
    urgentCases: []
  }
];

export const mockRescueTeams: RescueTeam[] = [
  {
    id: 'TEAM-001',
    name: 'Rescue Team Alpha',
    type: 'rescue',
    status: 'en-route',
    currentLocation: {
      lat: 10.7750,
      lng: 106.6980
    },
    destination: {
      lat: 10.7769,
      lng: 106.7009,
      incidentId: 'INC-001'
    },
    route: [
      { lat: 10.7750, lng: 106.6980 },
      { lat: 10.7760, lng: 106.6990 },
      { lat: 10.7769, lng: 106.7009 }
    ],
    members: 8,
    resources: ['3 boats', 'Medical supplies', 'Life jackets'],
    eta: '15 minutes'
  },
  {
    id: 'TEAM-002',
    name: 'Medical Team Beta',
    type: 'medical',
    status: 'on-site',
    currentLocation: {
      lat: 10.7850,
      lng: 106.6950
    },
    destination: {
      lat: 10.7850,
      lng: 106.6950,
      incidentId: 'INC-002'
    },
    members: 5,
    resources: ['Ambulance', 'Medical equipment', 'First aid kits']
  },
  {
    id: 'TEAM-003',
    name: 'Supply Delivery Gamma',
    type: 'delivery',
    status: 'en-route',
    currentLocation: {
      lat: 10.7800,
      lng: 106.6900
    },
    destination: {
      lat: 10.7850,
      lng: 106.6950,
      incidentId: 'INC-002'
    },
    route: [
      { lat: 10.7800, lng: 106.6900 },
      { lat: 10.7825, lng: 106.6925 },
      { lat: 10.7850, lng: 106.6950 }
    ],
    members: 4,
    resources: ['100L water', '30 blankets', 'Food supplies'],
    eta: '25 minutes'
  }
];

// Mock API functions
export const mockIncidentApi = {
  getIncidents: () => Promise.resolve(mockIncidents),
  getRescueTeams: () => Promise.resolve(mockRescueTeams),
  updateIncidentStatus: (id: string, status: IncidentReport['status']) => 
    Promise.resolve({ success: true }),
  updateResourceStatus: (incidentId: string, resourceId: string, status: ResourceNeed['status']) =>
    Promise.resolve({ success: true }),
  updateUrgentCaseStatus: (incidentId: string, caseId: string, status: UrgentCase['status']) =>
    Promise.resolve({ success: true })
};
