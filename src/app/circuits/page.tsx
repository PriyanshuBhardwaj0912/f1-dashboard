'use client';

import React, { useState } from 'react';
import { MOCK_CALENDAR } from '../../services/f1Api';
import { MapPin, Navigation, RotateCw, Shield, Zap } from 'lucide-react';

export default function CircuitsPage() {
  const [selectedRound, setSelectedRound] = useState(4); // Default Austria

  const race = MOCK_CALENDAR.find(r => r.round === selectedRound) || MOCK_CALENDAR[3];
  const c = race.circuit;

  // SVG Outlines for circuits
  const getCircuitSVGPath = (round: number) => {
    switch(round) {
      case 1: // Australia
        return "M 200,300 C 120,320 80,260 70,220 L 70,80 L 150,90 L 220,70 L 320,100 L 350,150 C 370,180 340,240 280,260 L 230,270 Z";
      case 2: // Spain
        return "M 100,180 L 250,180 C 300,180 380,100 420,130 C 460,160 480,240 430,280 C 380,320 320,240 250,260 L 120,260 C 80,260 60,200 100,180 Z";
      case 3: // British (Silverstone)
        return "M 280,350 C 180,340 100,280 80,240 C 60,200 70,140 120,90 C 170,40 240,40 320,60 C 400,80 480,120 520,180 C 560,240 540,290 480,310 C 420,330 380,270 340,290 C 300,310 380,360 280,350 Z";
      case 4: // Austria (Red Bull Ring)
        return "M 280,300 C 180,290 120,260 100,230 L 100,100 L 220,110 L 320,80 L 460,110 L 500,160 C 510,190 480,240 430,260 L 330,270 Z";
      case 5: // Belgium (Spa)
        return "M 80,280 L 80,140 C 100,80 200,40 280,80 C 360,120 440,80 500,140 C 540,180 520,260 450,290 C 380,320 340,220 280,250 C 220,280 140,300 80,280 Z";
      default:
        return "M 280,300 C 180,290 120,260 100,230 L 100,100 L 220,110 L 320,80 L 460,110 L 500,160 C 510,190 480,240 430,260 L 330,270 Z";
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Circuit Explorer</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interactive maps, statistics, and records for global racing circuits</span>
        </div>

        <div>
          <select 
            value={selectedRound} 
            onChange={(e) => setSelectedRound(parseInt(e.target.value))}
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
            {MOCK_CALENDAR.map(r => (
              <option key={r.round} value={r.round}>Round {r.round}: {r.gpName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid splits map and details */}
      {race && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="grid-responsive-compare">
          {/* SVG Map Card */}
          <div className="card highlight" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={18} style={{ color: 'var(--f1-red)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{c.name} Map Layout</h3>
              </div>
              <span className="badge badge-muted">{race.country}</span>
            </div>

            <div 
              style={{ 
                height: '350px', 
                background: 'var(--bg-primary)', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <svg viewBox="0 0 600 400" width="100%" height="100%">
                <path 
                  d={getCircuitSVGPath(race.round)} 
                  fill="none" 
                  stroke="var(--f1-red)" 
                  strokeWidth="8px"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(225,6,0,0.3))' }}
                />
              </svg>
            </div>
          </div>

          {/* Details stats lists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stat parameters card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                Circuit Specifications
              </h3>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Track Length</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{c.length}</strong>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Number of Laps</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{c.laps}</strong>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Corners</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{c.corners || 15}</strong>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Average Speed</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{c.avgSpeed || '230 km/h'}</strong>
                </div>
              </div>

              {/* Lap Record holder */}
              <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', alignItems: 'center' }}>
                <Zap size={24} style={{ color: 'var(--yellow-accent)' }} />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Official Lap Record</span>
                  <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', display: 'block' }}>{c.recordTime}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Set by {c.recordHolder}</span>
                </div>
              </div>
            </div>

            {/* Historical winners card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                Recent Winners
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {c.historicalWinners?.map((winner, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.6rem 0.8rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <strong>{winner.split(' (')[0]}</strong>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {winner.includes('(') ? winner.split(' (')[1].replace(')', '') : '2026'}
                    </span>
                  </div>
                )) || (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No historical logs available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
