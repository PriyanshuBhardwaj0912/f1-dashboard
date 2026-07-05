import { LiveDriverState, TimelineEvent } from '../types/f1';
import { MOCK_DRIVERS } from './f1Api';

// Track zones on the Silverstone Circuit, UK
// 0.0 is the start-finish line (which starts at Stowe in the SVG path definition)
export const TRACK_ZONES = [
  { start: 0.0, end: 0.05, type: 'medium-corner', name: 'Turn 15 (Stowe)' },
  { start: 0.05, end: 0.12, type: 'straight', name: 'Vale Straight' },
  { start: 0.12, end: 0.22, type: 'slow-corner', name: 'Turn 16 & 17 (Vale)' },
  { start: 0.22, end: 0.27, type: 'medium-corner', name: 'Turn 18 (Club)' },
  { start: 0.27, end: 0.33, type: 'straight', name: 'Hamilton Straight' },
  { start: 0.33, end: 0.36, type: 'fast-corner', name: 'Turn 1 (Abbey)' },
  { start: 0.36, end: 0.39, type: 'medium-corner', name: 'Turn 2 (Arena)' },
  { start: 0.39, end: 0.43, type: 'slow-corner', name: 'Turn 3 & 4 (The Loop)' },
  { start: 0.43, end: 0.45, type: 'medium-corner', name: 'Turn 5' },
  { start: 0.45, end: 0.53, type: 'straight', name: 'Wellington Straight' },
  { start: 0.53, end: 0.56, type: 'medium-corner', name: 'Turn 6 (Brooklands)' },
  { start: 0.56, end: 0.63, type: 'slow-corner', name: 'Turn 7 & 8 (Luffield)' },
  { start: 0.63, end: 0.67, type: 'straight', name: 'Woodcote Straight' },
  { start: 0.67, end: 0.70, type: 'fast-corner', name: 'Turn 9 (Copse)' },
  { start: 0.70, end: 0.74, type: 'straight', name: 'Maggotts Straight' },
  { start: 0.74, end: 0.85, type: 'fast-corner', name: 'Turn 10-14 (Maggotts-Becketts-Chapel)' },
  { start: 0.85, end: 0.98, type: 'straight', name: 'Hangar Straight' },
  { start: 0.98, end: 1.0, type: 'medium-corner', name: 'Turn 15 (Stowe Entry)' }
];

export const INITIAL_LIVE_DRIVERS: LiveDriverState[] = MOCK_DRIVERS.map((d, index) => {
  // Distribute starting progress evenly across the entire track layout to prevent overlapping clusters
  const startingProgress = index / MOCK_DRIVERS.length;
  
  return {
    id: d.id,
    firstName: d.firstName,
    lastName: d.lastName,
    code: d.code,
    number: d.number,
    teamName: d.teamName,
    color: d.color,
    progress: startingProgress,
    lap: 24,
    s1: '-',
    s2: '-',
    s3: '-',
    lastLap: '-',
    bestLap: index === 0 ? '1:07.980' : index === 1 ? '1:08.120' : '1:08.450',
    pitStops: 1,
    tyreCompound: index % 3 === 0 ? 'S' : index % 3 === 1 ? 'M' : 'H',
    tyreAge: 6 + index,
    gap: '+0.000',
    interval: '+0.000',
    position: index + 1,
    telemetry: {
      speed: 0,
      rpm: 0,
      gear: 1,
      throttle: 0,
      brake: 0,
      drs: false
    }
  };
});

const getRelativeTimestamp = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toTimeString().split(' ')[0];
};

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'pole', timestamp: getRelativeTimestamp(9), type: 'overtake', message: 'Kimi Antonelli secures a sensational maiden F1 pole position at Silverstone with a 1:26.890!', lap: 24 },
  { id: 'leclerc', timestamp: getRelativeTimestamp(18), type: 'overtake', message: "Charles Leclerc jumps to P2 on the grid for Ferrari, trailing Antonelli's Mercedes by just 0.082s.", lap: 18 },
  { id: 'hamilton', timestamp: getRelativeTimestamp(32), type: 'overtake', message: 'Lewis Hamilton clinches P3 for his final British Grand Prix with Scuderia Ferrari.', lap: 12 },
  { id: 'verstappen', timestamp: getRelativeTimestamp(45), type: 'flag-yellow', message: 'Yellow Flag: Max Verstappen runs wide into the gravel at Copse, causing significant floor damage.', lap: 8 },
  { id: 'green', timestamp: getRelativeTimestamp(60), type: 'incident', message: 'Green Light: Tricky mixed conditions as Q1 officially gets underway at a damp Silverstone.', lap: 4 },
  { id: 'gasly', timestamp: getRelativeTimestamp(75), type: 'flag-red', message: 'Gasly confirmed to start from the back of the grid after Alpine takes a 50-place power unit penalty.', lap: 1 }
];

export function updateDriverTelemetry(driver: LiveDriverState, deltaProgress: number, raceState: 'green' | 'yellow' | 'red' | 'safety-car') {
  // 1. Progress increment
  let speedMultiplier = 1.0;
  if (raceState === 'safety-car') speedMultiplier = 0.5;
  if (raceState === 'yellow') speedMultiplier = 0.7;
  if (raceState === 'red') speedMultiplier = 0.0;

  // Base speed factor based on driver rankings + random variance
  const rankPerformance = (11 - driver.position) * 0.00008;
  const rawBaseSpeed = 0.0025 + rankPerformance + (Math.random() * 0.0003);
  
  const step = rawBaseSpeed * deltaProgress * speedMultiplier;
  
  let newProgress = driver.progress + step;
  let crossedLine = false;
  if (newProgress >= 1.0) {
    newProgress -= 1.0;
    crossedLine = true;
  }
  driver.progress = newProgress;

  // 2. Identify Zone and Update Telemetry
  const zone = TRACK_ZONES.find(z => newProgress >= z.start && newProgress < z.end) || TRACK_ZONES[0];
  
  let targetSpeed = 0;
  let throttle = 0;
  let brake = 0;
  let gear = 1;
  let drs = false;

  if (raceState === 'red') {
    driver.telemetry = { speed: 0, rpm: 0, gear: 0, throttle: 0, brake: 0, drs: false };
    return crossedLine;
  }

  switch (zone.type) {
    case 'straight':
      targetSpeed = raceState === 'green' ? 300 + (Math.random() * 15) : 150;
      throttle = 100;
      brake = 0;
      gear = raceState === 'green' ? 8 : 5;
      drs = raceState === 'green' && zone.name.includes('Straight') && driver.position > 1; // DRS enabled for chasers on straights
      break;
    case 'slow-corner':
      targetSpeed = raceState === 'green' ? 80 + (Math.random() * 8) : 60;
      throttle = 15 + (Math.random() * 10);
      brake = 75 + (Math.random() * 15);
      gear = 2;
      drs = false;
      break;
    case 'medium-corner':
      targetSpeed = raceState === 'green' ? 140 + (Math.random() * 12) : 90;
      throttle = 40 + (Math.random() * 15);
      brake = 30 + (Math.random() * 15);
      gear = 4;
      drs = false;
      break;
    case 'fast-corner':
      targetSpeed = raceState === 'green' ? 220 + (Math.random() * 15) : 120;
      throttle = 80 + (Math.random() * 10);
      brake = 10 + (Math.random() * 5);
      gear = 6;
      drs = false;
      break;
  }

  // Smooth telemetry interpolation to prevent rapid value flickers
  const prevSpeed = driver.telemetry.speed || 50;
  const speedDiff = targetSpeed - prevSpeed;
  const currentSpeed = Math.round(prevSpeed + (speedDiff * 0.3));
  
  const rpm = Math.round(5000 + (currentSpeed / 330) * 8000 + (Math.random() * 150));

  driver.telemetry = {
    speed: currentSpeed,
    rpm: rpm > 13000 ? 13000 : rpm,
    gear,
    throttle: Math.round(throttle),
    brake: Math.round(brake),
    drs
  };

  // 3. Lap sectors tracking
  // Sector 1: 0.0 to 0.35, Sector 2: 0.35 to 0.70, Sector 3: 0.70 to 1.0
  const prevProgress = driver.progress - step;
  
  if (prevProgress < 0.35 && newProgress >= 0.35) {
    driver.s1 = formatSectorTime(20.5 + (Math.random() * 0.8) - (driver.position * 0.05));
  } else if (prevProgress < 0.70 && newProgress >= 0.70) {
    driver.s2 = formatSectorTime(28.2 + (Math.random() * 1.1) - (driver.position * 0.06));
  }

  if (crossedLine) {
    driver.lap += 1;
    driver.s3 = formatSectorTime(19.1 + (Math.random() * 0.6) - (driver.position * 0.04));
    
    // Calculate final lap time
    const s1Val = parseFloat(driver.s1);
    const s2Val = parseFloat(driver.s2);
    const s3Val = parseFloat(driver.s3);
    
    if (!isNaN(s1Val) && !isNaN(s2Val) && !isNaN(s3Val)) {
      const lapTotal = s1Val + s2Val + s3Val;
      const minutes = Math.floor(lapTotal / 60);
      const seconds = (lapTotal % 60).toFixed(3);
      driver.lastLap = `${minutes}:${seconds.padStart(6, '0')}`;
      
      // Check if best lap
      const bestLapSeconds = parseLapTimeToSeconds(driver.bestLap);
      if (lapTotal < bestLapSeconds) {
        driver.bestLap = driver.lastLap;
      }
    }
  }

  return crossedLine;
}

function formatSectorTime(seconds: number): string {
  return seconds.toFixed(3);
}

function parseLapTimeToSeconds(lapTimeStr: string): number {
  if (lapTimeStr === '-') return 999;
  const parts = lapTimeStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(lapTimeStr) || 999;
}
