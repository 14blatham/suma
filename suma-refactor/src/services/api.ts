export interface Row {
  id: string;
  date: string;
  region: string;
  category: string;
  sessions: number;
  avgDuration: number; // minutes
  wellbeingScore: number; // 1–10
  connections: number;
}

export interface KPI {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export interface TrendPoint {
  date: string;
  sessions: number;
  wellbeing: number;
}

// --- Mock data ---

export const MOCK_ROWS: Row[] = [
  { id: '1',  date: '2026-03-01', region: 'Europe',        category: 'Mindfulness', sessions: 142, avgDuration: 18, wellbeingScore: 8.2, connections: 89  },
  { id: '2',  date: '2026-03-01', region: 'North America', category: 'Peer Support', sessions: 98,  avgDuration: 24, wellbeingScore: 7.9, connections: 61  },
  { id: '3',  date: '2026-03-02', region: 'Asia Pacific',  category: 'Social',      sessions: 210, avgDuration: 12, wellbeingScore: 7.4, connections: 134 },
  { id: '4',  date: '2026-03-02', region: 'Europe',        category: 'Peer Support', sessions: 76,  avgDuration: 31, wellbeingScore: 8.7, connections: 54  },
  { id: '5',  date: '2026-03-03', region: 'North America', category: 'Mindfulness', sessions: 189, avgDuration: 22, wellbeingScore: 8.1, connections: 112 },
  { id: '6',  date: '2026-03-03', region: 'Latin America', category: 'Social',      sessions: 55,  avgDuration: 16, wellbeingScore: 7.6, connections: 38  },
  { id: '7',  date: '2026-03-04', region: 'Europe',        category: 'Social',      sessions: 167, avgDuration: 14, wellbeingScore: 7.8, connections: 103 },
  { id: '8',  date: '2026-03-04', region: 'Asia Pacific',  category: 'Mindfulness', sessions: 94,  avgDuration: 26, wellbeingScore: 8.4, connections: 67  },
  { id: '9',  date: '2026-03-05', region: 'North America', category: 'Peer Support', sessions: 121, avgDuration: 28, wellbeingScore: 8.6, connections: 79  },
  { id: '10', date: '2026-03-05', region: 'Latin America', category: 'Mindfulness', sessions: 43,  avgDuration: 19, wellbeingScore: 8.0, connections: 30  },
  { id: '11', date: '2026-03-06', region: 'Europe',        category: 'Mindfulness', sessions: 158, avgDuration: 21, wellbeingScore: 8.3, connections: 97  },
  { id: '12', date: '2026-03-06', region: 'Asia Pacific',  category: 'Social',      sessions: 177, avgDuration: 11, wellbeingScore: 7.3, connections: 118 },
  { id: '13', date: '2026-03-07', region: 'North America', category: 'Social',      sessions: 203, avgDuration: 13, wellbeingScore: 7.5, connections: 141 },
  { id: '14', date: '2026-03-07', region: 'Europe',        category: 'Peer Support', sessions: 88,  avgDuration: 33, wellbeingScore: 8.9, connections: 60  },
  { id: '15', date: '2026-03-08', region: 'Asia Pacific',  category: 'Peer Support', sessions: 64,  avgDuration: 29, wellbeingScore: 8.5, connections: 44  },
];

export const MOCK_KPIS: KPI[] = [
  { label: 'Total Sessions',    value: '1,885',  delta: '+12%',  positive: true  },
  { label: 'Avg Wellbeing',     value: '8.1',    delta: '+0.4',  positive: true  },
  { label: 'Avg Duration',      value: '21 min', delta: '+3 min',positive: true  },
  { label: 'Active Regions',    value: '4',      delta: '—',     positive: true  },
];

export const MOCK_TREND: TrendPoint[] = [
  { date: 'Mar 1', sessions: 240, wellbeing: 8.0 },
  { date: 'Mar 2', sessions: 286, wellbeing: 8.1 },
  { date: 'Mar 3', sessions: 244, wellbeing: 7.9 },
  { date: 'Mar 4', sessions: 261, wellbeing: 8.1 },
  { date: 'Mar 5', sessions: 164, wellbeing: 8.3 },
  { date: 'Mar 6', sessions: 335, wellbeing: 7.8 },
  { date: 'Mar 7', sessions: 291, wellbeing: 8.2 },
  { date: 'Mar 8', sessions: 64,  wellbeing: 8.5 },
];

// Simulate an async fetch
export async function fetchRows(): Promise<Row[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ROWS), 600));
}
