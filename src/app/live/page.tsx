'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useF1Store, RaceFlagState } from '../../store/f1Store';
import { Play, Pause, RotateCcw, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { f1ApiService } from '../../services/f1Api';

interface TrackConfig {
  name: string;
  location: string;
  pathD: string;
  checkeredLine: { x1: number; y1: number; x2: number; y2: number };
  customSectors?: { stroke: string; width: number; pathD: string; glow?: string }[];
  sectorLabels: { text: string; x: number; y: number; color: string }[];
  drsZones: {
    pointerD: string;
    circle: { cx: number; cy: number };
    transform: string;
    num: string;
  }[];
  speedTrap: {
    pointerD: string;
    circle: { cx: number; cy: number };
    transform: string;
  };
  turns: { num: string; x: number; y: number; sector: number }[];
}

const SILVERSTONE_CONFIG: TrackConfig = {
  name: 'Silverstone Circuit',
  location: 'SILVERSTONE, UK',
  pathD: "M 1330.62239,363.40298 C 1343.0739,412.61609 1349.20249,448.31414 1358.83541,498.41516 C 1361.82797,513.97948 1355.22009,533.03075 1350.54659,540.7283 C 1342.95311,553.23519 1324.32458,571.48656 1311.56629,579.06757 C 1274.53507,601.07163 1244.58597,612.2948 1203.57078,626.7917 C 1168.22982,639.28303 1129.06052,648.62591 1090.33388,654.56339 C 1058.00743,659.51961 1021.93785,661.36769 990.75486,671.62525 C 967.09722,679.40737 949.30077,693.65348 931.19565,709.5797 C 923.96358,715.94139 909.06662,722.59256 893.34059,718.42385 C 876.70807,714.01485 858.88221,709.37025 841.38632,706.51766 C 825.6892,703.95835 808.85024,702.09257 794.06066,705.47814 C 778.90437,708.94765 767.91813,719.28209 755.13781,729.17653 C 745.54893,736.60018 741.87195,748.2166 726.35488,753.84332 C 712.46598,758.87964 701.68068,759.23662 690.15212,757.34669 C 679.67227,755.62869 669.34057,750.6552 661.52602,742.72042 C 645.88899,726.84282 635.13406,705.5372 618.60101,690.69502 C 603.38423,677.0345 583.755,666.98497 564.18289,659.90417 C 452.57997,619.52847 338.8464,579.67613 226.5941,536.81186 C 167.8302,514.37249 111.0504,490.33537 55.9199,461.89963 C 42.4996,454.9776 28.5324,441.5682 22.7363,428.34582 C 16.987,415.23026 16.6631,396.94292 20.0873,382.88583 C 23.5182,368.80102 33.1737,355.70208 44.1988,345.71468 C 63.8412,327.92097 98.8139,316.9997 115.9779,296.25252 C 154.8941,249.2123 191.3181,207.90667 235.4665,159.51693 C 246.7132,147.18979 241.5437,137.13074 236.5206,132.96988 C 228.0558,125.9581 216.0249,120.21473 212.1529,111.2794 C 206.6442,98.56712 205.2779,81.84427 211.9678,66.83067 C 218.3862,52.42645 230.6034,37.66949 244.9946,30.02973 C 259.8277,22.15537 280.2721,17.77106 296.9488,20.2883 C 318.5162,23.54376 339.6706,36.56683 359.7269,47.34782 C 459.81491,101.14888 557.1484,161.42035 657.3816,214.03445 C 665.74726,218.42573 685.90966,221.02475 694.19714,207.59669 C 701.52499,195.7235 711.24018,171.39554 739.60059,163.60389 C 767.32868,155.98597 851.17406,137.81695 855.45727,137.18542 C 869.65679,135.09178 906.09649,130.97138 918.23535,136.10304 C 930.12096,141.12763 958.96688,174.8125 976.41308,194.40934 C 993.99216,214.15543 1006.12435,231.52237 1025.60441,244.11314 C 1035.70942,250.64443 1062.27669,251.42005 1071.7483,243.70007 C 1095.98661,223.94428 1120.96546,200.8216 1143.62677,177.34748 C 1150.97036,169.7405 1151.5973,154.51282 1146.5037,146.78459 C 1141.13429,138.6379 1128.06716,132.84756 1116.425,133.31182 C 1099.93229,133.96952 1080.80321,135.04553 1064.35674,135.02066 C 1054.82787,135.00598 1043.97656,127.32993 1038.37961,119.86733 C 1032.07037,111.45501 1027.41068,97.74202 1028.63818,87.39591 C 1029.93623,76.4552 1038.20232,64.3135 1047.45172,59.29687 C 1059.48914,52.7681 1077.93396,54.87111 1092.49864,59.33973 C 1132.57511,71.63566 1173.27387,82.59255 1209.39575,103.0763 C 1232.44401,116.14635 1268.20113,138.98502 1276.58907,163.59022 C 1298.93841,229.14985 1312.76724,292.83262 1330.62239,363.40298 z",
  checkeredLine: { x1: 490, y1: 102, x2: 465, y2: 152 },
  sectorLabels: [
    { text: 'SECTOR 1', x: 800, y: 180, color: '#00D2FF' },
    { text: 'SECTOR 2', x: 1150, y: 240, color: '#FF8C00' },
    { text: 'SECTOR 3', x: 280, y: 480, color: '#0055FF' }
  ],
  drsZones: [
    { pointerD: 'M 740,164 L 740,240', circle: { cx: 740, cy: 164 }, transform: 'translate(675, 240)', num: '1' },
    { pointerD: 'M 1091,655 L 1091,720', circle: { cx: 1091, cy: 655 }, transform: 'translate(1026, 720)', num: '2' }
  ],
  speedTrap: { pointerD: 'M 227,537 L 227,610', circle: { cx: 227, cy: 537 }, transform: 'translate(182, 610)' },
  turns: [
    { num: '01', x: 658, y: 215, sector: 1 },
    { num: '02', x: 695, y: 208, sector: 1 },
    { num: '03', x: 740, y: 164, sector: 1 },
    { num: '04', x: 855, y: 137, sector: 1 },
    { num: '05', x: 919, y: 136, sector: 1 },
    { num: '06', x: 1145, y: 170, sector: 2 },
    { num: '07', x: 1035, y: 100, sector: 2 },
    { num: '08', x: 1048, y: 60, sector: 2 },
    { num: '09', x: 1305, y: 270, sector: 2 },
    { num: '10', x: 1205, y: 630, sector: 3 },
    { num: '11', x: 1091, y: 655, sector: 3 },
    { num: '12', x: 991, y: 672, sector: 3 },
    { num: '13', x: 895, y: 719, sector: 3 },
    { num: '14', x: 662, y: 743, sector: 3 },
    { num: '15', x: 35, y: 429, sector: 3 },
    { num: '16', x: 116, y: 297, sector: 3 },
    { num: '17', x: 236, y: 160, sector: 3 },
    { num: '18', x: 297, y: 40, sector: 3 }
  ]
};

const SPA_CONFIG: TrackConfig = {
  name: 'Spa-Francorchamps',
  location: 'SPA-FRANCORCHAMPS, BELGIUM',
  pathD: "M 350,550 L 250,520 C 230,510 220,490 230,470 C 240,450 260,440 280,450 L 380,360 C 400,340 420,330 450,320 L 850,100 C 870,90 890,95 905,105 L 920,110 C 940,115 955,130 965,145 L 980,150 C 995,160 1010,180 1025,200 C 1045,220 1060,240 1050,260 C 1040,280 1010,290 980,280 C 950,270 910,290 880,305 L 780,350 C 740,370 730,410 750,440 C 770,470 820,460 850,470 L 900,480 C 930,490 950,510 965,530 L 980,550 C 995,570 990,590 970,610 C 950,630 900,640 850,620 C 780,590 680,530 520,420 C 470,390 420,480 370,570 Z",
  checkeredLine: { x1: 330, y1: 550, x2: 340, y2: 525 },
  customSectors: [
    { stroke: '#FF1801', width: 8, pathD: "M 350,550 L 250,520 C 230,510 220,490 230,470 C 240,450 260,440 280,450 L 380,360 C 400,340 420,330 450,320 L 500,280", glow: '#FF1801' },
    { stroke: '#00D2FF', width: 8, pathD: "M 500,280 L 850,100 C 870,90 890,95 905,105 L 920,110 C 940,115 955,130 965,145 L 980,150 C 995,160 1010,180 1025,200 C 1045,220 1060,240 1050,260 C 1040,280 1010,290 980,280 C 950,270 910,290 880,305 L 780,350 C 740,370 730,410 750,440 C 770,470 820,460 850,470 L 900,480 C 930,490 950,510 965,530 L 980,550 C 995,570 990,590 970,610 C 950,630 900,640 850,620", glow: '#00D2FF' },
    { stroke: '#FFCC00', width: 8, pathD: "M 850,620 C 780,590 680,530 520,420 C 470,390 420,480 370,570 Z", glow: '#FFCC00' }
  ],
  sectorLabels: [
    { text: 'SECTOR 1', x: 310, y: 340, color: '#FF1801' },
    { text: 'SECTOR 2', x: 920, y: 350, color: '#00D2FF' },
    { text: 'SECTOR 3', x: 650, y: 650, color: '#FFCC00' }
  ],
  drsZones: [
    { pointerD: 'M 380,360 L 300,320', circle: { cx: 380, cy: 360 }, transform: 'translate(170, 300)', num: '1' },
    { pointerD: 'M 370,570 L 450,620', circle: { cx: 370, cy: 570 }, transform: 'translate(385, 620)', num: '2' }
  ],
  speedTrap: { pointerD: 'M 580,240 L 580,180', circle: { cx: 580, cy: 240 }, transform: 'translate(535, 120)' },
  turns: [
    { num: '01', x: 230, y: 470, sector: 1 },
    { num: '02', x: 380, y: 360, sector: 1 },
    { num: '03', x: 420, y: 340, sector: 1 },
    { num: '04', x: 450, y: 320, sector: 1 },
    { num: '05', x: 905, y: 105, sector: 2 },
    { num: '06', x: 920, y: 110, sector: 2 },
    { num: '07', x: 965, y: 145, sector: 2 },
    { num: '08', x: 1050, y: 220, sector: 2 },
    { num: '09', x: 980, y: 280, sector: 2 },
    { num: '10', x: 760, y: 360, sector: 2 },
    { num: '11', x: 800, y: 450, sector: 2 },
    { num: '12', x: 915, y: 485, sector: 2 },
    { num: '13', x: 950, y: 515, sector: 2 },
    { num: '14', x: 980, y: 575, sector: 2 },
    { num: '15', x: 850, y: 620, sector: 3 },
    { num: '16', x: 680, y: 530, sector: 3 },
    { num: '17', x: 520, y: 420, sector: 3 },
    { num: '18', x: 370, y: 570, sector: 3 },
    { num: '19', x: 350, y: 550, sector: 3 }
  ]
};

export default function LiveTimingPage() {
  const {
    liveDrivers,
    raceState,
    setRaceState,
    isSimulating,
    setIsSimulating,
    lapCount,
    maxLaps,
    resetSimulator,
    selectedLiveDriverId,
    setSelectedLiveDriverId
  } = useF1Store();

  const pathRef = useRef<SVGPathElement>(null);
  const [coords, setCoords] = useState<{ [id: string]: { x: number; y: number } }>({});
  const [liveGPName, setLiveGPName] = useState('British Grand Prix');
  const [session, setSession] = useState<'practice' | 'qualifying' | 'race'>('race');
  const [isStartingGantryActive, setIsStartingGantryActive] = useState(false);
  const [gantryState, setGantryState] = useState(0); // 0: off, 1-5: red columns, 6: green
  const [isReactionGameMode, setIsReactionGameMode] = useState(false);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  const [reactionTimeResult, setReactionTimeResult] = useState<number | null>(null);
  const [reactionBestScore, setReactionBestScore] = useState<number | null>(null);
  const [reactionStatus, setReactionStatus] = useState<'waiting' | 'ready' | 'clicked-early' | 'clicked-success'>('waiting');
  
  const gantryTimeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const best = localStorage.getItem('f1_best_reaction_time');
      if (best) {
        setReactionBestScore(parseInt(best));
      }
    }
  }, []);

  const clearGantryTimeouts = () => {
    gantryTimeoutsRef.current.forEach(t => clearTimeout(t));
    gantryTimeoutsRef.current = [];
  };

  const triggerStartSequence = (gameMode: boolean = false) => {
    setIsSimulating(false);
    clearGantryTimeouts();
    
    setIsStartingGantryActive(true);
    setIsReactionGameMode(gameMode);
    setGantryState(0);
    setReactionStatus('waiting');
    setReactionTimeResult(null);
    setReactionStartTime(null);

    const timeouts: any[] = [];

    // Turn on red lights column by column at 800ms intervals
    for (let i = 1; i <= 5; i++) {
      timeouts.push(
        setTimeout(() => {
          setGantryState(i);
        }, i * 800)
      );
    }

    // Random delay between all red lights (4.0s) and green lights go (random 1.2s to 3.2s)
    const randomDelay = 4000 + 1200 + Math.random() * 2000;

    timeouts.push(
      setTimeout(() => {
        setGantryState(6);
        setReactionStatus('ready');
        setReactionStartTime(Date.now());

        if (!gameMode) {
          setIsSimulating(true);
          timeouts.push(
            setTimeout(() => {
              setIsStartingGantryActive(false);
              setGantryState(0);
            }, 1500)
          );
        }
      }, randomDelay)
    );

    gantryTimeoutsRef.current = timeouts;
  };

  const handleReactionClick = () => {
    if (!isReactionGameMode) return;

    if (reactionStatus === 'waiting') {
      clearGantryTimeouts();
      setReactionStatus('clicked-early');
    } else if (reactionStatus === 'ready') {
      const elapsed = Date.now() - (reactionStartTime || 0);
      setReactionTimeResult(elapsed);
      setReactionStatus('clicked-success');
      clearGantryTimeouts();

      if (!reactionBestScore || elapsed < reactionBestScore) {
        setReactionBestScore(elapsed);
        if (typeof window !== 'undefined') {
          localStorage.setItem('f1_best_reaction_time', elapsed.toString());
        }
      }
    }
  };

  const handleReset = () => {
    clearGantryTimeouts();
    setIsStartingGantryActive(false);
    setGantryState(0);
    resetSimulator();
  };

  const getReactionRating = (time: number) => {
    if (time < 180) return { text: "⚡ SUPERHUMAN! That's faster than most F1 drivers!", color: '#00ff66' };
    if (time < 220) return { text: "🏎️ ELITE! True F1 driver reaction time!", color: '#00ff66' };
    if (time < 260) return { text: "🟢 FAST! Excellent reflexes!", color: '#a3ff12' };
    if (time < 320) return { text: "🟡 AVERAGE. Decent start.", color: 'var(--yellow-accent)' };
    return { text: "🔴 KEEP PRACTICING! Reflexes need tuning.", color: 'var(--f1-red)' };
  };

  useEffect(() => {
    const loadLiveGPName = async () => {
      try {
        const calendar = await f1ApiService.getCalendar();
        const live = calendar.find(r => r.status === 'live');
        if (live) {
          setLiveGPName(live.gpName);
        }
      } catch (err) {}
    };
    loadLiveGPName();
  }, []);

  const isSpa = liveGPName.toLowerCase().includes('belgian') || liveGPName.toLowerCase().includes('spa');
  const track = isSpa ? SPA_CONFIG : SILVERSTONE_CONFIG;

  // Compute coordinates for driver dots along the SVG path
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    try {
      const pathLength = path.getTotalLength();
      const newCoords: { [id: string]: { x: number; y: number } } = {};

      liveDrivers.forEach(drv => {
        // Find coordinate on SVG path matching current driver progress
        const distance = drv.progress * pathLength;
        const pt = path.getPointAtLength(distance);
        newCoords[drv.id] = { x: pt.x, y: pt.y };
      });

      setCoords(newCoords);
    } catch (e) {
      // getPointAtLength might fail if path is not fully rendered
    }
  }, [liveDrivers]);

  const activeDriver = liveDrivers.find(d => d.id === selectedLiveDriverId) || liveDrivers[0];

  // Helper to color sector cells
  const getSectorColor = (sectorTimeStr: string, idx: number) => {
    if (sectorTimeStr === '-') return 'var(--text-muted)';
    // In our simplified mock, odd driver numbers get fast sectors
    const codeNum = parseInt(activeDriver.code) || 12;
    if (codeNum % 2 === 0 && idx === 1) return 'var(--purple-accent)'; // Purple (overall fastest)
    if (idx === 2) return 'var(--green-accent)'; // Green (personal best)
    return 'var(--yellow-accent)'; // Yellow (normal)
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Race Center Live Timing</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Real-time telemetry, track position indicators, and simulation controls for the {liveGPName}
        </span>
      </div>

      {/* Grid Layout splits visualizer and table */}
      <div className="live-layout-grid">
        {/* Left Side Telemetry and visualizers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Simulation Controls Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Live Simulator Controls</h3>
            
            {/* Session Switch Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Session</span>
              <div style={{ 
                display: 'flex', 
                backgroundColor: 'var(--bg-tertiary)', 
                padding: '4px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                width: 'fit-content'
              }}>
                {(['practice', 'qualifying', 'race'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setSession(s);
                      resetSimulator();
                    }}
                    style={{
                      backgroundColor: session === s ? 'var(--f1-red)' : 'transparent',
                      color: session === s ? 'white' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 1.1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {!isSimulating ? (
                <button 
                  onClick={() => triggerStartSequence(false)}
                  style={{
                    backgroundColor: 'var(--green-accent)',
                    border: 'none',
                    color: 'white',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Play size={16} /> Start Telemetry
                </button>
              ) : (
                <button 
                  onClick={() => setIsSimulating(false)}
                  style={{
                    backgroundColor: 'var(--yellow-accent)',
                    border: 'none',
                    color: 'black',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Pause size={16} /> Pause Timing
                </button>
              )}

              <button 
                onClick={handleReset}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>

              <button 
                onClick={() => triggerStartSequence(true)}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🚦 Reaction Test
              </button>
            </div>

            {/* Flag statuses indicators */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                Track Status Flag
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setRaceState('green')}
                  className={`badge ${raceState === 'green' ? 'badge-green' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'green' ? 1 : 0.4 }}
                >
                  <CheckCircle size={12} style={{ marginRight: '4px' }} /> Green Flag
                </button>
                <button 
                  onClick={() => setRaceState('yellow')}
                  className={`badge ${raceState === 'yellow' ? 'badge-yellow' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'yellow' ? 1 : 0.4 }}
                >
                  <AlertTriangle size={12} style={{ marginRight: '4px' }} /> Yellow Flag
                </button>
                <button 
                  onClick={() => setRaceState('safety-car')}
                  className={`badge ${raceState === 'safety-car' ? 'badge-yellow' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'safety-car' ? 1 : 0.4, color: 'var(--yellow-accent)' }}
                >
                  <Shield size={12} style={{ marginRight: '4px' }} /> Safety Car
                </button>
                <button 
                  onClick={() => setRaceState('red')}
                  className={`badge ${raceState === 'red' ? 'badge-live' : 'badge-muted'}`}
                  style={{ border: 'none', cursor: 'pointer', opacity: raceState === 'red' ? 1 : 0.4 }}
                >
                  <AlertTriangle size={12} style={{ marginRight: '4px' }} /> Red Flag
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic GP Layout SVG visualizer */}
          <div className="card" style={{ border: '1px solid var(--border-color)', background: 'linear-gradient(145deg, #0e0e12 0%, #08080a 100%)', boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--f1-red)', animation: 'ledFlashAnim 1s infinite' }} />
                <span style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LIVE TRACK RADAR</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{track.location}</span>
            </div>
            
            <div className="track-svg-canvas" style={{ position: 'relative', backgroundColor: '#070709', minHeight: '390px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              {/* Start Gantry Lights Animation Overlay */}
              {isStartingGantryActive && (
                <div 
                  onClick={handleReactionClick}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(7, 7, 9, 0.96)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-mono)',
                    cursor: isReactionGameMode && (reactionStatus === 'waiting' || reactionStatus === 'ready') ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                >
                  {/* Reaction Mode Indicator Badge */}
                  {isReactionGameMode && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      display: 'flex',
                      gap: '15px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <span>🎮 REACTION TIME CHALLENGE</span>
                      {reactionBestScore && (
                        <span style={{ color: 'var(--yellow-accent)' }}>⚡ PERSONAL BEST: {reactionBestScore}ms</span>
                      )}
                    </div>
                  )}

                  {/* Lights Gantry Box */}
                  <div style={{
                    display: 'flex',
                    background: '#121216',
                    border: '3px solid #22222a',
                    borderRadius: '16px',
                    padding: '24px 36px',
                    gap: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                  }}>
                    {Array.from({ length: 5 }).map((_, colIdx) => {
                      const isRed = gantryState > colIdx && gantryState <= 5;
                      const isGreen = gantryState === 6;
                      
                      const ledStyle = (active: boolean, color: 'red' | 'green') => ({
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: active 
                          ? (color === 'red' ? '#ff1801' : '#00ff66') 
                          : '#2a2a35',
                        boxShadow: active 
                          ? (color === 'red' 
                            ? '0 0 25px #ff1801, inset 0 0 8px rgba(255,255,255,0.7)' 
                            : '0 0 25px #00ff66, inset 0 0 8px rgba(255,255,255,0.7)') 
                          : 'inset 0 2px 4px rgba(0,0,0,0.6)',
                        transition: 'all 0.05s ease',
                        border: '1px solid #1a1a24'
                      });

                      return (
                        <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={ledStyle(isRed || isGreen, isGreen ? 'green' : 'red')} />
                          <div style={ledStyle(isRed || isGreen, isGreen ? 'green' : 'red')} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Status & Results */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      color: gantryState === 6 ? '#00ff66' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      fontWeight: 700,
                      opacity: gantryState > 0 ? 1 : 0.4,
                      transition: 'all 0.3s ease',
                      textShadow: gantryState === 6 ? '0 0 10px rgba(0, 255, 102, 0.4)' : 'none'
                    }}>
                      IT'S LIGHTS OUT AND AWAY WE GO
                    </div>

                    {/* Reaction Game Status Prompts */}
                    {isReactionGameMode && (
                      <div style={{ textAlign: 'center', minHeight: '60px' }}>
                        {reactionStatus === 'waiting' && (
                          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Wait for green lights...
                          </span>
                        )}
                        {reactionStatus === 'ready' && (
                          <span style={{ fontSize: '1.2rem', color: '#00ff66', fontWeight: 800, animation: 'svgPulseAnim 0.5s infinite alternate' }}>
                            TAP NOW!
                          </span>
                        )}
                        {reactionStatus === 'clicked-early' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.1rem', color: 'var(--f1-red)', fontWeight: 800 }}>
                              🚫 JUMP START!
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              You clicked before the lights went green.
                            </span>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); triggerStartSequence(true); }}
                                style={{ background: 'var(--f1-red)', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 12px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}
                              >
                                Try Again
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsStartingGantryActive(false); }}
                                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '4px 12px', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Exit
                              </button>
                            </div>
                          </div>
                        )}
                        {reactionStatus === 'clicked-success' && reactionTimeResult && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.4rem', color: '#00ff66', fontWeight: 800 }}>
                              {reactionTimeResult} ms
                            </span>
                            <span style={{ fontSize: '0.78rem', color: getReactionRating(reactionTimeResult).color, fontWeight: 700 }}>
                              {getReactionRating(reactionTimeResult).text}
                            </span>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); triggerStartSequence(true); }}
                                style={{ background: 'var(--green-accent)', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 12px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}
                              >
                                Play Again
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsStartingGantryActive(false); }}
                                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '4px 12px', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Exit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Red and White Warning stripe tape */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '16px',
                    background: 'repeating-linear-gradient(-45deg, #ff1801, #ff1801 10px, #ffffff 10px, #ffffff 20px)'
                  }} />
                </div>
              )}
              <svg viewBox="0 0 1375 790" width="100%" height="100%" style={{ padding: '15px', zIndex: 1, position: 'relative' }}>
                <style>{`
                  @keyframes svgPulse {
                    0% { r: 8; opacity: 0.9; stroke-width: 3px; }
                    100% { r: 24; opacity: 0; stroke-width: 0.5px; }
                  }
                  @keyframes svgPulseDouble {
                    0% { r: 14; opacity: 0.6; stroke-width: 2px; }
                    100% { r: 36; opacity: 0; stroke-width: 0.2px; }
                  }
                  @keyframes ledFlashAnim {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                  }
                  @keyframes scanlineAnim {
                    0% { transform: translateY(0px); opacity: 0.05; }
                    50% { opacity: 0.15; }
                    100% { transform: translateY(790px); opacity: 0.05; }
                  }
                  .led-flash {
                    animation: ledFlashAnim 0.15s infinite !important;
                  }
                `}</style>
                <defs>
                  <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 255, 0.04)" />
                  </pattern>
                </defs>

                {/* Grid Overlay */}
                <rect x="-100" y="-100" width="1575" height="990" fill="url(#tactical-grid)" />

                {/* Animated scanline bar */}
                <line x1="0" y1="0" x2="1375" y2="0" stroke="var(--green-accent)" strokeWidth="2" opacity="0.1" style={{ animation: 'scanlineAnim 6s linear infinite' }} />

                <g transform="translate(100, 45) scale(0.85)">
                  {/* Checkered Start/Finish Line */}
                  <line x1={track.checkeredLine.x1} y1={track.checkeredLine.y1} x2={track.checkeredLine.x2} y2={track.checkeredLine.y2} stroke="#ffffff" strokeWidth="8" strokeDasharray="5 5" style={{ filter: 'drop-shadow(0 2px 4px black)' }} />

                  {/* Main invisible tracker path (for high resolution math alignment & SVG reuse) */}
                  <path 
                    ref={pathRef}
                    id="live-track-path" 
                    d={track.pathD} 
                    fill="none"
                    stroke="transparent" 
                    strokeWidth="10"
                  />

                  {/* Sector paths and glowing overlays */}
                  {track.customSectors ? (
                    track.customSectors.map((sec, idx) => (
                      <g key={idx}>
                        <path d={sec.pathD} fill="none" stroke={sec.stroke} strokeWidth={sec.width * 2} strokeLinecap="round" strokeLinejoin="round" opacity="0.12" style={{ filter: 'blur(3px)' }} />
                        <path d={sec.pathD} fill="none" stroke={sec.stroke} strokeWidth={sec.width} strokeLinecap="round" strokeLinejoin="round" style={sec.glow ? { filter: `drop-shadow(0 0 3px ${sec.glow})` } : undefined} />
                      </g>
                    ))
                  ) : (
                    <>
                      {/* Dynamic Glowing neon track backing path */}
                      <use href="#live-track-path" fill="none" stroke="#0055FF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" style={{ filter: 'blur(3px)' }} />

                      {/* Core Track Line - Sector 3 Base (Dark Blue/Purple) */}
                      <use href="#live-track-path" fill="none" stroke="#0055FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Core Track Line - Sector 1 Overlay (Cyan) */}
                      <use 
                        href="#live-track-path" 
                        fill="none" 
                        stroke="#00D2FF" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeDasharray="371, 2589" 
                        strokeDashoffset="-1844" 
                        style={{ filter: 'drop-shadow(0 0 3px #00D2FF)' }}
                      />

                      {/* Core Track Line - Sector 2 Overlay (Orange) */}
                      <use 
                        href="#live-track-path" 
                        fill="none" 
                        stroke="#FF8C00" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeDasharray="672, 2288" 
                        strokeDashoffset="-2215" 
                        style={{ filter: 'drop-shadow(0 0 3px #FF8C00)' }}
                      />
                    </>
                  )}

                  {/* Sector label text overlays */}
                  {track.sectorLabels.map((lbl, idx) => (
                    <text key={idx} x={lbl.x} y={lbl.y} fill={lbl.color} fontSize="13px" fontWeight={900} letterSpacing="0.1em" textAnchor="middle" style={{ filter: 'drop-shadow(0 1px 2px black)' }}>
                      {lbl.text}
                    </text>
                  ))}

                  {/* Pink DRS Detection Zone Overlays and Lines */}
                  {track.drsZones.map((z, idx) => (
                    <g key={idx}>
                      <path d={z.pointerD} stroke="#FF00A8" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
                      <circle cx={z.circle.cx} cy={z.circle.cy} r="5" fill="#FF00A8" />
                      <g transform={z.transform}>
                        <rect x="0" y="0" width="130" height="38" rx="8" fill="rgba(8,8,12,0.9)" stroke="#FF00A8" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                        <text x="65" y="15" fill="#FF00A8" fontSize="9px" fontWeight={900} letterSpacing="0.05em" textAnchor="middle">DRS DETECTION</text>
                        <text x="65" y="28" fill="#ffffff" fontSize="11px" fontWeight={800} textAnchor="middle">ZONE {z.num}</text>
                      </g>
                    </g>
                  ))}

                  {/* Speed Trap Overlay and Line */}
                  <g>
                    <path d={track.speedTrap.pointerD} stroke="#00D27A" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
                    <circle cx={track.speedTrap.circle.cx} cy={track.speedTrap.circle.cy} r="5" fill="#00D27A" />
                    <g transform={track.speedTrap.transform}>
                      <rect x="0" y="0" width="90" height="42" rx="8" fill="rgba(8,8,12,0.9)" stroke="#00D27A" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                      <text x="45" y="17" fill="#00D27A" fontSize="9px" fontWeight={900} letterSpacing="0.05em" textAnchor="middle">SPEED</text>
                      <text x="45" y="31" fill="#ffffff" fontSize="11px" fontWeight={800} textAnchor="middle">TRAP</text>
                    </g>
                  </g>

                  {/* Turn Numbers Circular Badges */}
                  {track.turns.map(c => {
                    const sectorColor = c.sector === 1 ? '#FF1801' : c.sector === 2 ? '#00D2FF' : '#FFCC00';
                    return (
                      <g key={c.num} style={{ cursor: 'pointer' }}>
                        <circle cx={c.x} cy={c.y} r="14" fill="rgba(8, 8, 12, 0.9)" stroke={sectorColor} strokeWidth="1.5" />
                        <text x={c.x} y={c.y + 4} fill="#ffffff" fontSize="11px" fontWeight={800} textAnchor="middle" fontFamily="var(--font-mono)">{c.num}</text>
                      </g>
                    );
                  })}

                  {/* Render coordinates of driver dots */}
                  {Object.keys(coords).map(driverId => {
                    const driverState = liveDrivers.find(d => d.id === driverId);
                    if (!driverState) return null;
                    const coord = coords[driverId];
                    const isSelected = driverId === selectedLiveDriverId;

                    return (
                      <g key={driverId} style={{ transition: 'transform 0.15s linear' }}>
                        {/* Glowing radar rings for active/selected driver */}
                        {isSelected && (
                          <>
                            <circle 
                              cx={coord.x} 
                              cy={coord.y} 
                              r={12}
                              fill="none"
                              stroke={driverState.color}
                              strokeWidth="2"
                              opacity="0.8"
                              style={{
                                animation: 'svgPulse 1.5s infinite ease-out',
                                transformOrigin: `${coord.x}px ${coord.y}px`
                              }}
                            />
                            <circle 
                              cx={coord.x} 
                              cy={coord.y} 
                              r={20}
                              fill="none"
                              stroke={driverState.color}
                              strokeWidth="1"
                              opacity="0.4"
                              style={{
                                animation: 'svgPulseDouble 1.5s infinite ease-out',
                                transformOrigin: `${coord.x}px ${coord.y}px`
                              }}
                            />
                          </>
                        )}
                        <circle 
                          cx={coord.x} 
                          cy={coord.y} 
                          r={isSelected ? 10 : 7}
                          fill={driverState.color}
                          stroke="#ffffff"
                          strokeWidth={2}
                          style={{ cursor: 'pointer', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
                          onClick={() => setSelectedLiveDriverId(driverId)}
                        />
                        {isSelected && (
                          <g transform={`translate(${coord.x}, ${coord.y - 20})`}>
                            <rect x="-18" y="-12" width="36" height="16" rx="4" fill="rgba(8, 8, 12, 0.9)" stroke={driverState.color} strokeWidth="1" />
                            <text 
                              x="0" 
                              y="0"
                              fill="white"
                              fontSize="10px"
                              fontWeight={800}
                              textAnchor="middle"
                            >
                              {driverState.code}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Selected Driver Telemetry Dashboard */}
          {activeDriver && (
            <div className="card highlight" style={{ borderTopColor: activeDriver.color, background: 'linear-gradient(180deg, rgba(22,22,29,0.5) 0%, rgba(8,8,12,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
              
              {/* F1 Steering Wheel Shift Lights strip */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '8px', 
                background: 'rgba(0,0,0,0.3)', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.05)', 
                marginBottom: '1.25rem',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
              }}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const rpm = activeDriver.telemetry.rpm;
                  let isLit = false;
                  let color = '#1a1a24';
                  
                  if (i < 5) {
                    isLit = rpm > (6000 + i * 800);
                    color = isLit ? '#00D27A' : '#103020';
                  } else if (i < 8) {
                    isLit = rpm > (10000 + (i - 5) * 1000);
                    color = isLit ? '#E10600' : '#3d0a0a';
                  } else {
                    isLit = rpm > (13000 + (i - 8) * 750);
                    color = isLit ? '#00B2FF' : '#0a2030';
                  }

                  const isFlashing = rpm > 13800;

                  return (
                    <span 
                      key={i} 
                      className={isFlashing ? 'led-flash' : ''}
                      style={{ 
                        width: '11px', 
                        height: '11px', 
                        borderRadius: '50%', 
                        backgroundColor: isFlashing ? (i % 2 === 0 ? '#E10600' : '#00B2FF') : color,
                        boxShadow: isLit || isFlashing ? `0 0 10px ${isFlashing ? '#E10600' : color}` : 'none',
                        transition: 'all 0.08s ease',
                      }} 
                    />
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telemetry Dashboard</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {activeDriver.firstName} {activeDriver.lastName} ({activeDriver.code})
                  </h3>
                </div>
                <span className="badge" style={{ backgroundColor: activeDriver.color, color: '#000', fontWeight: 800, padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                  #{activeDriver.number}
                </span>
              </div>

              {/* Grid: dials and vertical meters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1.5rem', alignItems: 'center' }}>
                
                {/* Numeric Dials */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>SPEED</span>
                      <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {activeDriver.telemetry.speed} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KM/H</span>
                      </strong>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.02em' }}>RPM</span>
                      <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {activeDriver.telemetry.rpm}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      border: `2px solid ${activeDriver.telemetry.drs ? 'var(--green-accent)' : 'var(--border-color)'}`, 
                      borderRadius: '8px', 
                      height: '74px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: activeDriver.telemetry.drs ? '0 0 10px rgba(0, 210, 122, 0.15)' : 'none'
                    }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>GEAR</span>
                      <strong style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', lineHeight: 1, color: activeDriver.telemetry.drs ? 'var(--green-accent)' : 'var(--text-primary)' }}>
                        {activeDriver.telemetry.gear === 0 ? 'N' : activeDriver.telemetry.gear}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>DRS WING</span>
                      <span className={`badge ${activeDriver.telemetry.drs ? 'badge-green' : 'badge-muted'}`} style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                        {activeDriver.telemetry.drs ? 'ACTIVE' : 'CLOSED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Throttle & Brake Pedals (Actual F1 broadcast style) */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '1rem 0.8rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255,255,255,0.03)',
                  height: '166px',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.02em' }}>THR</span>
                    <div style={{ height: '100px', width: '16px', backgroundColor: '#092518', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ height: `${activeDriver.telemetry.throttle}%`, width: '100%', backgroundColor: 'var(--green-accent)', transition: 'height 0.1s ease', boxShadow: '0 0 6px var(--green-accent)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-accent)' }}>{activeDriver.telemetry.throttle}%</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.02em' }}>BRK</span>
                    <div style={{ height: '100px', width: '16px', backgroundColor: '#300808', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ height: `${activeDriver.telemetry.brake}%`, width: '100%', backgroundColor: 'var(--f1-red)', transition: 'height 0.1s ease', boxShadow: '0 0 6px var(--f1-red)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--f1-red)' }}>{activeDriver.telemetry.brake}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Live Timing table */}
        <div className="table-container">
          <table className="f1-table" id="live-timing-table">
            <thead>
              <tr>
                <th style={{ width: '45px', textAlign: 'center' }}>Pos</th>
                <th>Driver</th>
                <th style={{ textAlign: 'right' }}>{session === 'race' ? 'Gap' : 'Gap (Fastest)'}</th>
                <th style={{ textAlign: 'right' }}>{session === 'race' ? 'Interval' : 'Best Lap'}</th>
                <th style={{ textAlign: 'right', width: '70px' }}>S1</th>
                <th style={{ textAlign: 'right', width: '70px' }}>S2</th>
                <th style={{ textAlign: 'right', width: '70px' }}>S3</th>
                <th style={{ textAlign: 'right', width: '90px' }}>Speed</th>
                <th style={{ textAlign: 'center', width: '60px' }}>Tyre</th>
                <th style={{ textAlign: 'center', width: '50px' }}>Pit</th>
                <th style={{ textAlign: 'center', width: '50px' }}>DRS</th>
              </tr>
            </thead>
            <tbody>
              {liveDrivers.map((drv, index) => {
                const isSelected = drv.id === selectedLiveDriverId;
                
                const displayGap = session === 'practice'
                  ? (index === 0 ? 'FASTEST' : `+${(index * 0.118 + (index % 3) * 0.035).toFixed(3)}s`)
                  : session === 'qualifying'
                    ? (index === 0 ? 'POLE' : `+${(index * 0.082 + (index % 2) * 0.024).toFixed(3)}s`)
                    : drv.gap;

                const displayInterval = session === 'practice'
                  ? `1:27.${(320 + index * 142).toFixed(0)}`
                  : session === 'qualifying'
                    ? `1:26.${(110 + index * 98).toFixed(0)}`
                    : drv.interval;
                 
                return (
                  <tr 
                    key={drv.id}
                    onClick={() => setSelectedLiveDriverId(drv.id)}
                    style={{ 
                      backgroundColor: isSelected ? 'rgba(225, 6, 0, 0.05)' : 'transparent',
                      borderLeft: isSelected ? `3px solid ${drv.color}` : 'none'
                    }}
                  >
                    <td style={{ textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {drv.position}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ width: '3px', height: '16px', backgroundColor: drv.color, borderRadius: '1px' }}></span>
                        <strong>{drv.lastName}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{drv.code}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {displayGap}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {displayInterval}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: getSectorColor(drv.s1, 1) }}>
                      {drv.s1}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: getSectorColor(drv.s2, 2) }}>
                      {drv.s2}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: getSectorColor(drv.s3, 3) }}>
                      {drv.s3}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {drv.telemetry.speed} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>KM/H</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span 
                        className="badge" 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          backgroundColor: drv.tyreCompound === 'S' 
                            ? 'var(--f1-red)' 
                            : drv.tyreCompound === 'M' 
                              ? 'var(--yellow-accent)' 
                              : 'white',
                          color: 'black'
                        }}
                        title={`Compound: ${drv.tyreCompound} (Age: ${drv.tyreAge} laps)`}
                      >
                        {drv.tyreCompound}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {drv.pitStops}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {drv.telemetry.drs ? (
                        <span style={{ color: 'var(--green-accent)', fontWeight: 800, fontSize: '0.7rem' }}>DRS</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
