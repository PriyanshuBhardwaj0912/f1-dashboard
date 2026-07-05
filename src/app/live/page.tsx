'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useF1Store, RaceFlagState } from '../../store/f1Store';
import { Play, Pause, RotateCcw, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { f1ApiService } from '../../services/f1Api';

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
                  onClick={() => setIsSimulating(true)}
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
                onClick={resetSimulator}
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

          {/* British GP Layout SVG visualizer */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase' }}>Silverstone Circuit Tracker</h3>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Silverstone</span>
            </div>
            
            <div className="track-svg-canvas" style={{ position: 'relative', backgroundColor: '#09090C', minHeight: '380px' }}>
              <svg viewBox="0 0 600 360" width="100%" height="100%" style={{ padding: '15px', zIndex: 1, position: 'relative' }}>
                {/* Checker flag finish line overlay next to Turn 18 */}
                <line x1="220" y1="15" x2="220" y2="45" stroke="#ffffff" strokeWidth="4" strokeDasharray="2 2" />

                {/* Main invisible tracker path (for high resolution math alignment) */}
                <path 
                  ref={pathRef}
                  id="live-track-path" 
                  d="M 220,50 C 170,50 130,70 120,100 C 110,130 150,150 190,140 C 220,130 230,100 250,80 L 390,80 C 470,80 490,140 440,160 C 410,170 380,150 360,130 L 320,140 C 310,190 360,230 400,260 C 380,290 340,295 310,285 C 290,275 270,255 250,245 C 230,235 210,245 190,250 L 50,180 C 20,160 10,120 50,100 C 90,80 130,65 160,50 C 190,40 240,50 220,50 Z" 
                  fill="none"
                  stroke="transparent" 
                  strokeWidth="10"
                />

                {/* Sector 1: Abbey, Farm, Arena, Wellington Straight (Light Blue) */}
                <path 
                  d="M 220,50 C 170,50 130,70 120,100 C 110,130 150,150 190,140 C 220,130 230,100 250,80 L 390,80" 
                  fill="none"
                  stroke="#00D2FF" 
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Sector 2: Brooklands, Luffield, Woodcote, Copse (Orange) */}
                <path 
                  d="M 390,80 C 470,80 490,140 440,160 C 410,170 380,150 360,130 L 320,140 C 310,190 360,230 400,260" 
                  fill="none"
                  stroke="#FF8C00" 
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Sector 3: Maggotts, Becketts, Hangar Straight, Stowe, Club (Dark Blue/Purple) */}
                <path 
                  d="M 400,260 C 380,290 340,295 310,285 C 290,275 270,255 250,245 C 230,235 210,245 190,250 L 50,180 C 20,160 10,120 50,100 C 90,80 130,65 160,50 C 190,40 240,50 220,50 Z" 
                  fill="none"
                  stroke="#0055FF" 
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Sector label text overlays */}
                <text x="280" y="70" fill="#00D2FF" fontSize="7px" fontWeight={800} textAnchor="middle">SECTOR 1</text>
                <text x="430" y="195" fill="#FF8C00" fontSize="7px" fontWeight={800} textAnchor="middle">SECTOR 2</text>
                <text x="150" y="165" fill="#0055FF" fontSize="7px" fontWeight={800} textAnchor="middle">SECTOR 3</text>

                {/* Pink DRS Detection Zone 1 Overlay and Line */}
                <g>
                  <path d="M 300,160 C 300,180 220,180 220,140" stroke="#FF00A8" strokeWidth="1" fill="none" />
                  <circle cx="220" cy="140" r="2.5" fill="#FF00A8" />
                  <g transform="translate(280, 148)">
                    <rect x="0" y="0" width="75" height="24" rx="4" fill="#FF00A8" />
                    <text x="37.5" y="10" fill="white" fontSize="7px" fontWeight={800} textAnchor="middle">DRS DETECTION</text>
                    <text x="37.5" y="18" fill="white" fontSize="7px" fontWeight={800} textAnchor="middle">ZONE 1</text>
                  </g>
                </g>

                {/* Pink DRS Detection Zone 2 Overlay and Line */}
                <g>
                  <path d="M 330,322 C 280,322 215,280 215,235" stroke="#FF00A8" strokeWidth="1" fill="none" />
                  <circle cx="215" cy="235" r="2.5" fill="#FF00A8" />
                  <g transform="translate(330, 310)">
                    <rect x="0" y="0" width="75" height="24" rx="4" fill="#FF00A8" />
                    <text x="37.5" y="10" fill="white" fontSize="7px" fontWeight={800} textAnchor="middle">DRS DETECTION</text>
                    <text x="37.5" y="18" fill="white" fontSize="7px" fontWeight={800} textAnchor="middle">ZONE 2</text>
                  </g>
                </g>

                {/* Speed Trap Overlay and Line */}
                <g>
                  <path d="M 62.5,180 L 62.5,130" stroke="#00D200" strokeWidth="1" fill="none" />
                  <circle cx="62.5" cy="130" r="2.5" fill="#00D200" />
                  <g transform="translate(40, 180)">
                    <rect x="0" y="0" width="45" height="20" rx="3" fill="#00D200" />
                    <text x="22.5" y="8" fill="white" fontSize="7px" fontWeight={800} textAnchor="middle">SPEED</text>
                    <text x="22.5" y="16" fill="white" fontSize="7px" fontWeight={800} textAnchor="middle">TRAP</text>
                  </g>
                </g>

                {/* Turn Numbers Circular Badges */}
                {[
                  { num: '01', x: 160, y: 75 },
                  { num: '02', x: 160, y: 125 },
                  { num: '03', x: 220, y: 140 },
                  { num: '04', x: 255, y: 100 },
                  { num: '05', x: 320, y: 95 },
                  { num: '06', x: 390, y: 60 },
                  { num: '07', x: 470, y: 95 },
                  { num: '08', x: 425, y: 165 },
                  { num: '09', x: 310, y: 305 },
                  { num: '10', x: 250, y: 265 },
                  { num: '11', x: 215, y: 235 },
                  { num: '12', x: 180, y: 235 },
                  { num: '13', x: 150, y: 225 },
                  { num: '14', x: 50, y: 200 },
                  { num: '15', x: 35, y: 90 },
                  { num: '18', x: 220, y: 30 }
                ].map(c => (
                  <g key={c.num}>
                    <circle cx={c.x} cy={c.y} r="7.5" fill="#13131a" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
                    <text x={c.x} y={c.y + 2.5} fill="#ffffff" fontSize="7.5px" fontWeight={800} textAnchor="middle">{c.num}</text>
                  </g>
                ))}

                {/* Render coordinates of driver dots */}
                {Object.keys(coords).map(driverId => {
                  const driverState = liveDrivers.find(d => d.id === driverId);
                  if (!driverState) return null;
                  const coord = coords[driverId];
                  const isSelected = driverId === selectedLiveDriverId;

                  return (
                    <g key={driverId} style={{ transition: 'transform 0.15s linear' }}>
                      <circle 
                        cx={coord.x} 
                        cy={coord.y} 
                        r={isSelected ? 7 : 4.5}
                        fill={driverState.color}
                        stroke={isSelected ? 'white' : 'none'}
                        strokeWidth={2}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedLiveDriverId(driverId)}
                      />
                      {isSelected && (
                        <text 
                          x={coord.x} 
                          y={coord.y - 12}
                          fill="white"
                          fontSize="10px"
                          fontWeight={700}
                          textAnchor="middle"
                          style={{ filter: 'drop-shadow(0px 1px 2px black)' }}
                        >
                          {driverState.code}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected Driver Telemetry Dashboard */}
          {activeDriver && (
            <div className="card highlight" style={{ borderTopColor: activeDriver.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Driver Telemetry</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {activeDriver.firstName} {activeDriver.lastName} ({activeDriver.code})
                  </h3>
                </div>
                <span className="badge" style={{ backgroundColor: activeDriver.color, color: 'black', fontWeight: 800 }}>
                  #{activeDriver.number}
                </span>
              </div>

              {/* Dials Speed, RPM and Gear */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Speed</span>
                  <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {activeDriver.telemetry.speed} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KM/H</span>
                  </strong>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Engine RPM</span>
                  <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {activeDriver.telemetry.rpm}
                  </strong>
                </div>

                <div style={{ 
                  background: 'var(--bg-secondary)', 
                  border: `2px solid ${activeDriver.telemetry.drs ? 'var(--green-accent)' : 'var(--border-color)'}`, 
                  borderRadius: '8px', 
                  height: '74px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: activeDriver.telemetry.drs ? '0 0 10px rgba(0, 210, 122, 0.2)' : 'none'
                }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gear</span>
                  <strong style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', lineHeight: 1, color: activeDriver.telemetry.drs ? 'var(--green-accent)' : 'var(--text-primary)' }}>
                    {activeDriver.telemetry.gear === 0 ? 'N' : activeDriver.telemetry.gear}
                  </strong>
                </div>
              </div>

              {/* Throttle, Brake slide graphs and DRS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>THROTTLE %</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{activeDriver.telemetry.throttle}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${activeDriver.telemetry.throttle}%`, height: '100%', backgroundColor: 'var(--green-accent)', transition: 'width 0.15s ease' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>BRAKE %</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{activeDriver.telemetry.brake}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${activeDriver.telemetry.brake}%`, height: '100%', backgroundColor: 'var(--f1-red)', transition: 'width 0.15s ease' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>DRS STATUS</span>
                  <span className={`badge ${activeDriver.telemetry.drs ? 'badge-green' : 'badge-muted'}`}>
                    {activeDriver.telemetry.drs ? 'DRS ACTIVE' : 'DRS DISABLED'}
                  </span>
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
