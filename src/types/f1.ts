export interface TeamHistoryEntry {
  year: string;
  team: string;
}

export interface SeasonProgressionEntry {
  race: string;
  points: number;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  flag: string;
  photo: string;
  nationality: string;
  teamId: string;
  teamName: string;
  color: string;
  points: number;
  wins: number;
  podiums: number;
  fastestLaps: number;
  dnfs: number;
  bio: string;
  championships: number;
  polePositions: number;
  careerWins: number;
  careerPodiums: number;
  teamHistory: TeamHistoryEntry[];
  seasonProgression: SeasonProgressionEntry[];
  speedTrace?: string;
  throttleTrace?: string;
}

export interface Constructor {
  id: string;
  name: string;
  logo: string;
  principal: string;
  drivers: string[];
  engine: string;
  points: number;
  wins: number;
  championships: number;
  historyText: string;
  seasonProgression: SeasonProgressionEntry[];
  color?: string;
  livery?: string;
}

export interface Circuit {
  name: string;
  length: string;
  laps: number;
  recordTime: string;
  recordHolder: string;
  corners?: number;
  avgSpeed?: string;
  weather?: string;
  historicalWinners?: string[];
}

export interface Race {
  round: number;
  gpName: string;
  country: string;
  flag: string;
  status: 'completed' | 'live' | 'upcoming';
  winnerName: string;
  winnerId: string;
  secondPlaceName?: string;
  thirdPlaceName?: string;
  poleName?: string;
  poleId?: string;
  fastestLapName?: string;
  fastestLapId?: string;
  circuit: Circuit;
  date: string;
}

export interface WeatherInfo {
  temperature: string;
  trackTemp: string;
  windSpeed: string;
  rainProbability: string;
  humidity: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'flag-yellow' | 'flag-red' | 'safety-car' | 'pit-stop' | 'overtake' | 'incident';
  message: string;
  lap: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  source: string;
  date: string;
}

export interface LiveDriverTelemetry {
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  drs: boolean;
}

export interface LiveDriverState {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  teamName: string;
  color: string;
  progress: number; // 0.0 to 1.0 around the track
  lap: number;
  s1: string;
  s2: string;
  s3: string;
  lastLap: string;
  bestLap: string;
  pitStops: number;
  tyreCompound: 'S' | 'M' | 'H' | 'I' | 'W';
  tyreAge: number;
  telemetry: LiveDriverTelemetry;
  gap: string;
  interval: string;
  position: number;
}
