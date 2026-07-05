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
            
            <div className="track-svg-canvas" style={{ position: 'relative', backgroundColor: '#0A0A0D' }}>
              {/* Official F1 Circuit Map Background Watermark */}
              <div 
                style={{
                  position: 'absolute',
                  inset: '16px',
                  backgroundImage: `url('https://media.formula1.com/image/upload/c_fit,h_220/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.95,
                  filter: 'invert(1) brightness(1.2) contrast(1.15)',
                  zIndex: 0
                }}
              />
              <svg viewBox="0 0 600 360" width="100%" height="100%" style={{ padding: '20px', zIndex: 1, position: 'relative' }}>
                {/* Silverstone Circuit Outline Path - Hidden to show only official map, active for coordinates */}
                <path 
                  ref={pathRef}
                  id="live-track-path" 
                  d="M 380,310 C 430,310 470,290 480,260 C 490,230 450,210 410,220 C 380,230 370,260 350,280 L 210,280 C 130,280 110,220 160,200 C 190,190 220,210 240,230 L 280,220 C 290,170 240,130 200,100 C 220,70 260,65 290,75 C 310,85 330,105 350,115 C 370,125 390,115 410,110 L 550,180 C 580,200 590,240 550,260 C 510,280 470,295 440,310 C 410,320 360,310 380,310 Z" 
                  style={{ stroke: 'transparent', strokeWidth: '10px' }}
                />

                {/* DRS activation overlay straight zone - Hidden, using official map's green zones */}
                <path 
                  d="M 410,110 L 550,180" 
                  fill="none"
                  style={{ stroke: 'transparent', strokeWidth: '8px' }}
                />

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
                        r={isSelected ? 8 : 5}
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
