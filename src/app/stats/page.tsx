'use client';

import React from 'react';
import { useF1Store } from '../../store/f1Store';
import { BarChart3, LineChart, PieChart, Info } from 'lucide-react';

export default function StatsPage() {
  const { drivers, constructors } = useF1Store();

  // 1. Driver progression charts normalization (Bahrain to Austria points)
  // We'll draw a nice multi-line SVG chart with points progression.
  // Races: Bahrain (25), Jeddah (50), Melbourne (75), Monaco (100), Spain (125), Austria (171)
  const racesList = ['Bahrain', 'Jeddah', 'Melbourne', 'Monaco', 'Spain', 'Austria'];
  const topDrivers = drivers.slice(0, 5); // top 5 drivers

  // SVG dimensions
  const width = 500;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Max score for scale
  const maxScore = 180;

  const getCoordinates = (pointsIndex: number, score: number) => {
    const x = paddingLeft + (pointsIndex / (racesList.length - 1)) * chartW;
    const y = height - paddingBottom - (score / maxScore) * chartH;
    return `${x},${y}`;
  };

  // 2. Tyre compound usage statistics
  const tyreStats = [
    { compound: 'Soft', percentage: 42, color: 'var(--f1-red)' },
    { compound: 'Medium', percentage: 38, color: 'var(--yellow-accent)' },
    { compound: 'Hard', percentage: 20, color: 'white' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Championship Insights & Analytics</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Advanced telemetry insights, progression data, and compound usages</span>
      </div>

      {/* Row 1: Driver and Constructor Progression lines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive-compare">
        
        {/* Driver progression chart */}
        <div className="card">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.25rem' }}>
            <LineChart size={18} style={{ color: 'var(--f1-red)' }} />
            <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase' }}>Driver Points Progression</h3>
          </div>

          <div style={{ position: 'relative', height: `${height}px`, width: '100%' }}>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
              {/* Y Axis Grid lines */}
              {[0, 50, 100, 150].map((score) => {
                const y = height - paddingBottom - (score / maxScore) * chartH;
                return (
                  <g key={score}>
                    <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4" />
                    <text x={paddingLeft - 8} y={y + 3} fill="var(--text-muted)" fontSize="9px" textAnchor="end">{score} pts</text>
                  </g>
                );
              })}

              {/* X Axis labels */}
              {racesList.map((race, idx) => {
                const x = paddingLeft + (idx / (racesList.length - 1)) * chartW;
                return (
                  <text key={race} x={x} y={height - 10} fill="var(--text-muted)" fontSize="9px" textAnchor="middle">
                    {race.substr(0, 3)}
                  </text>
                );
              })}

              {/* Driver lines */}
              {topDrivers.map((d) => {
                const pointsTrace = d.seasonProgression.map((p, idx) => getCoordinates(idx, p.points));
                return (
                  <g key={d.id}>
                    <path 
                      d={`M ${pointsTrace.join(' L ')}`}
                      fill="none"
                      stroke={d.color}
                      strokeWidth={3}
                      style={{ filter: `drop-shadow(0px 1px 3px ${d.color}40)` }}
                    />
                    {/* Circle markers */}
                    {d.seasonProgression.map((p, idx) => {
                      const coordsStr = getCoordinates(idx, p.points);
                      const [x, y] = coordsStr.split(',').map(Number);
                      return <circle key={idx} cx={x} cy={y} r={4} fill={d.color} stroke="var(--bg-secondary)" strokeWidth={1} />;
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legends */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '10px', justifyContent: 'center' }}>
            {topDrivers.map(d => (
              <span key={d.id} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }}></span> {d.lastName}
              </span>
            ))}
          </div>
        </div>

        {/* Constructor points distribution */}
        <div className="card">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--f1-red)' }} />
            <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase' }}>Constructor Points breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', height: `${height}px`, justifyContent: 'center' }}>
            {constructors.slice(0, 5).map(c => {
              const maxPts = Math.max(...constructors.map(team => team.points), 1);
              const pct = (c.points / maxPts) * 100;
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                    <strong>{c.name}</strong>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.points} PTS</span>
                  </div>
                  <div style={{ height: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: c.color || '#fff', borderRadius: '6px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Wins, DNFs, Strategies details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Wins by driver */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--f1-red)' }}>
            Wins & Poles Leaderboard
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {drivers.slice(0, 5).map(d => (
              <div 
                key={d.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.6rem 0.8rem', 
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '3px', height: '16px', backgroundColor: d.color, borderRadius: '1.5px' }}></span>
                  <strong>{d.lastName}</strong>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <span title="Wins" style={{ color: 'var(--yellow-accent)' }}>🥇 {d.wins}</span>
                  <span title="Poles" style={{ color: 'var(--purple-accent)' }}>⏱ {d.polePositions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retirments / DNFs */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--f1-red)' }}>
            Reliability & DNFs
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
            Number of retirements / Did Not Finish (DNF) metrics logged this season.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {drivers.slice(0, 5).map(d => (
              <div 
                key={d.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.6rem 0.8rem', 
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              >
                <strong>{d.firstName} {d.lastName}</strong>
                <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>
                  {d.dnfs} DNF{d.dnfs !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tyre Strategy percentage */}
        <div className="card">
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
            <PieChart size={16} style={{ color: 'var(--f1-red)' }} />
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--f1-red)' }}>
              Tyre strategies
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Overall season average compound selection distributions across all teams.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tyreStats.map(stat => (
              <div key={stat.compound}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stat.color }}></span>
                    {stat.compound} Compound
                  </span>
                  <strong>{stat.percentage}%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${stat.percentage}%`, height: '100%', backgroundColor: stat.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
