'use client';

import React, { useState } from 'react';
import { useF1Store } from '../../store/f1Store';
import { Award, Zap, Trophy, GitCompare, Timer } from 'lucide-react';

export default function ComparePage() {
  const { drivers, constructors } = useF1Store();

  // Driver comparison state
  const [driver1Id, setDriver1Id] = useState('antonelli');
  const [driver2Id, setDriver2Id] = useState('max_verstappen');

  // Constructor comparison state
  const [team1Id, setTeam1Id] = useState('mercedes');
  const [team2Id, setTeam2Id] = useState('ferrari');

  const d1 = drivers.find(d => d.id === driver1Id) || drivers[0];
  const d2 = drivers.find(d => d.id === driver2Id) || drivers[1];

  const t1 = constructors.find(t => t.id === team1Id) || constructors[0];
  const t2 = constructors.find(t => t.id === team2Id) || constructors[1];

  // RADAR CHART SVG GENERATOR HELPER
  // 5 metrics: [Points, Wins, Podiums, Poles, Career Wins]
  // Center is (150, 150), radius is 100.
  const calculateRadarPath = (drvr: typeof d1, maxValues: number[]) => {
    const center = 150;
    const rMax = 100;
    const angles = [0, 72, 144, 216, 288]; // 5 axes
    
    const values = [
      drvr.points,
      drvr.wins * 20, // amplify for visual comparison
      drvr.podiums * 15,
      drvr.polePositions * 3,
      drvr.careerWins
    ];

    const points = angles.map((angle, idx) => {
      const val = Math.min(values[idx] / maxValues[idx], 1.0) * rMax;
      const x = center + val * Math.cos((angle - 90) * Math.PI / 180);
      const y = center + val * Math.sin((angle - 90) * Math.PI / 180);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')} Z`;
  };

  // Define scale maximums for radar chart normalization
  const radarMaxes = [200, 140, 120, 150, 120];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. DRIVER COMPARISON VIEWPORT */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <GitCompare size={24} style={{ color: 'var(--f1-red)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase' }}>Driver Head-to-Head Comparison</h2>
        </div>

        {/* Dropdowns Selector */}
        <div className="card" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <select 
              value={driver1Id} 
              onChange={(e) => setDriver1Id(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                outline: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minWidth: '220px'
              }}
            >
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>

            <span className="vs-badge" style={{ backgroundColor: 'var(--f1-red)', color: 'white', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.8rem' }}>VS</span>

            <select 
              value={driver2Id} 
              onChange={(e) => setDriver2Id(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                outline: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minWidth: '220px'
              }}
            >
              {drivers.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === driver1Id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparative statistics matrix */}
        {d1 && d2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px 1fr', gap: '1.5rem' }} className="grid-responsive-compare">
            {/* Left Driver Profile Info */}
            <div className="card highlight" style={{ borderTopColor: d1.color, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={d1.photo} 
                  alt={d1.lastName} 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${d1.color}` }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{d1.firstName} {d1.lastName}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d1.teamName}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>2026 points</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d1.points} PTS</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Season wins</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d1.wins}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Podiums</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d1.podiums}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fastest laps</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d1.fastestLaps}</strong>
                </div>
              </div>
            </div>

            {/* Radar Chart Center */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>Radar Pace Overlap</h4>
              <div style={{ width: '100%', height: '260px' }}>
                <svg viewBox="0 0 300 300" width="100%" height="100%">
                  {/* Concentric grids circles */}
                  <circle cx="150" cy="150" r="25" fill="none" stroke="var(--border-color)" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx="150" cy="150" r="50" fill="none" stroke="var(--border-color)" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx="150" cy="150" r="75" fill="none" stroke="var(--border-color)" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx="150" cy="150" r="100" fill="none" stroke="var(--border-color)" strokeWidth={1} />
                  
                  {/* 5 Axis lines */}
                  {[0, 72, 144, 216, 288].map((angle, idx) => {
                    const x = 150 + 100 * Math.cos((angle - 90) * Math.PI / 180);
                    const y = 150 + 100 * Math.sin((angle - 90) * Math.PI / 180);
                    return <line key={idx} x1="150" y1="150" x2={x} y2={y} stroke="var(--border-color)" strokeWidth={1} />;
                  })}

                  {/* Axis Text Labels */}
                  <text x="150" y="38" fill="var(--text-muted)" fontSize="9px" textAnchor="middle">Points</text>
                  <text x="255" y="112" fill="var(--text-muted)" fontSize="9px" textAnchor="start">Wins</text>
                  <text x="220" y="235" fill="var(--text-muted)" fontSize="9px" textAnchor="start">Podiums</text>
                  <text x="80" y="235" fill="var(--text-muted)" fontSize="9px" textAnchor="end">Poles</text>
                  <text x="45" y="112" fill="var(--text-muted)" fontSize="9px" textAnchor="end">Career Wins</text>

                  {/* Driver Radar polygons */}
                  <path 
                    d={calculateRadarPath(d1, radarMaxes)} 
                    fill={`${d1.color}25`} 
                    stroke={d1.color} 
                    strokeWidth={2.5} 
                  />
                  
                  <path 
                    d={calculateRadarPath(d2, radarMaxes)} 
                    fill={`${d2.color}25`} 
                    stroke={d2.color} 
                    strokeWidth={2.5} 
                  />
                </svg>
              </div>

              {/* Legends */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '10px' }}>
                <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d1.color }}></span> {d1.lastName}
                </span>
                <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d2.color }}></span> {d2.lastName}
                </span>
              </div>
            </div>

            {/* Right Driver Profile Info */}
            <div className="card highlight" style={{ borderTopColor: d2.color, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{d2.firstName} {d2.lastName}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d2.teamName}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={d2.photo} 
                  alt={d2.lastName} 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${d2.color}` }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>2026 points</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d2.points} PTS</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Season wins</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d2.wins}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Podiums</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d2.podiums}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fastest laps</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{d2.fastestLaps}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. CONSTRUCTOR COMPARISON VIEWPORT */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <GitCompare size={24} style={{ color: 'var(--f1-red)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase' }}>Constructor comparator</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
            <select 
              value={team1Id} 
              onChange={(e) => setTeam1Id(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                outline: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minWidth: '220px'
              }}
            >
              {constructors.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <span className="vs-badge" style={{ backgroundColor: 'var(--f1-red)', color: 'white', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.8rem' }}>VS</span>

            <select 
              value={team2Id} 
              onChange={(e) => setTeam2Id(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                outline: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minWidth: '220px'
              }}
            >
              {constructors.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === team1Id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Constructor point bar progression charts comparison */}
          {t1 && t2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>Season Points Standing comparison</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', alignItems: 'center', gap: '1.5rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: t1.color }}>{t1.name}</strong>
                  <div style={{ height: '36px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${(t1.points / (t1.points + t2.points)) * 100}%`, height: '100%', backgroundColor: t1.color || '#fff', display: 'flex', alignItems: 'center', paddingLeft: '10px', color: 'black', fontWeight: 800, fontSize: '0.85rem' }}>
                      {t1.points}
                    </div>
                    <div style={{ width: `${(t2.points / (t1.points + t2.points)) * 100}%`, height: '100%', backgroundColor: t2.color || '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', color: 'black', fontWeight: 800, fontSize: '0.85rem' }}>
                      {t2.points}
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: t2.color, textAlign: 'right' }}>{t2.name}</strong>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>Historical Constructors Titles</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', alignItems: 'center', gap: '1.5rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: t1.color }}>{t1.championships} Titles</strong>
                  <div style={{ height: '24px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${t1.championships ? (t1.championships / (t1.championships + t2.championships)) * 100 : 0}%`, height: '100%', backgroundColor: t1.color || '#fff' }}></div>
                    <div style={{ width: `${t2.championships ? (t2.championships / (t1.championships + t2.championships)) * 100 : 0}%`, height: '100%', backgroundColor: t2.color || '#fff' }}></div>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: t2.color, textAlign: 'right' }}>{t2.championships} Titles</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 768px) {
          .grid-responsive-compare {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
