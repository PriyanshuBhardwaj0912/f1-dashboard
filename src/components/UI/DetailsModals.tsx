'use client';

import React from 'react';
import { useF1Store } from '../../store/f1Store';
import { Modal } from './Modal';
import { Award, Zap, Trophy, User, Calendar, Settings } from 'lucide-react';

export const DetailsModals: React.FC = () => {
  const { 
    activeModalDriverId, setActiveModalDriverId,
    activeModalTeamId, setActiveModalTeamId,
    drivers, constructors
  } = useF1Store();

  const driver = drivers.find(d => d.id === activeModalDriverId);
  const constructor = constructors.find(c => c.id === activeModalTeamId);

  return (
    <>
      {/* Driver Details Modal */}
      <Modal 
        isOpen={!!driver} 
        onClose={() => setActiveModalDriverId(null)}
        title={driver ? `${driver.firstName} ${driver.lastName} Details` : ''}
      >
        {driver && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              {/* Profile card left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-color)',
                  height: '240px',
                  position: 'relative',
                  backgroundColor: 'var(--bg-tertiary)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={driver.photo} 
                    alt={driver.lastName} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="%232a2a35"/><path d="M16 8a4 4 0 100 8 4 4 0 000-8zM16 18c-4.4 0-8 2.6-8 5.8V25h16v-1.2c0-3.2-3.6-5.8-8-5.8z" fill="%23a0a0b0"/></svg>`;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    #{driver.number}
                  </div>
                </div>

                <div style={{ 
                  background: 'var(--bg-tertiary)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={driver.flag} 
                    alt={driver.nationality} 
                    style={{ width: '28px', border: '1px solid var(--border-color)', borderRadius: '2px' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Nationality</span>
                    <strong style={{ fontSize: '0.9rem' }}>{driver.nationality}</strong>
                  </div>
                </div>

                <div style={{ 
                  background: 'var(--bg-tertiary)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}>
                  <div style={{ width: '6px', height: '24px', backgroundColor: driver.color, borderRadius: '3px' }}></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Current Constructor</span>
                    <strong style={{ fontSize: '0.9rem' }}>{driver.teamName}</strong>
                  </div>
                </div>
              </div>

              {/* Bio & Stats right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Biography</h3>
                  <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{driver.bio}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Career Statistics</h3>
                  <div className="grid-3" style={{ gap: '0.75rem' }}>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <Award size={18} style={{ color: 'var(--yellow-accent)', margin: '0 auto 4px auto' }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Championships</span>
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{driver.championships}</strong>
                    </div>

                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <Trophy size={18} style={{ color: 'var(--f1-red)', margin: '0 auto 4px auto' }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Grand Prix Wins</span>
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{driver.careerWins}</strong>
                    </div>

                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <Zap size={18} style={{ color: 'var(--green-accent)', margin: '0 auto 4px auto' }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Career Podiums</span>
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{driver.careerPodiums}</strong>
                    </div>
                  </div>

                  <div className="grid-3" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Pole Positions</span>
                      <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{driver.polePositions}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Fastest Laps</span>
                      <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{driver.fastestLaps}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>2026 Points</span>
                      <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: 'var(--f1-red)' }}>{driver.points}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom history & chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Team History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {driver.teamHistory.map((h, index) => (
                    <div 
                      key={index}
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
                      <strong style={{ color: 'var(--text-primary)' }}>{h.team}</strong>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{h.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Season Points Progression</h3>
                <div style={{ height: '140px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  {driver.seasonProgression.map((prog, index) => {
                    const maxVal = Math.max(...driver.seasonProgression.map(p => p.points), 1);
                    const pct = (prog.points / maxVal) * 90; // scale to 90% height
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          width: `${100 / driver.seasonProgression.length}%` 
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {prog.points}
                        </span>
                        <div 
                          style={{ 
                            width: '12px', 
                            height: `${pct}px`, 
                            backgroundColor: driver.color,
                            borderRadius: '3px 3px 0 0',
                            boxShadow: `0 0 8px ${driver.color}60`
                          }}
                        ></div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase' }}>
                          {prog.race.substr(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Constructor Details Modal */}
      <Modal 
        isOpen={!!constructor} 
        onClose={() => setActiveModalTeamId(null)}
        title={constructor ? `${constructor.name} Profile` : ''}
      >
        {constructor && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              {/* Profile Card Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  borderRadius: '12px', 
                  background: `linear-gradient(135deg, ${constructor.color || '#1A1A24'} 0%, #0E0E12 100%)`, 
                  border: '1px solid var(--border-color)',
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={constructor.logo} 
                    alt={constructor.name} 
                    style={{ width: '60px', height: '40px', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '10px' }}
                  />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.5px' }}>
                    {constructor.name}
                  </h2>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={15} style={{ color: 'var(--f1-red)' }} />
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Team Principal</span>
                      <strong style={{ fontSize: '0.85rem' }}>{constructor.principal}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={15} style={{ color: 'var(--f1-red)' }} />
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Engine / Power Unit</span>
                      <strong style={{ fontSize: '0.85rem' }}>{constructor.engine}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Stats Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Team Legacy</h3>
                  <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{constructor.historyText}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Championship Stats</h3>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <Award size={24} style={{ color: 'var(--yellow-accent)' }} />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Constructors Titles</span>
                        <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{constructor.championships}</strong>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <Trophy size={24} style={{ color: 'var(--f1-red)' }} />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Grand Prix Wins</span>
                        <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{constructor.wins}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drivers and points charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Active Driver Lineup</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {constructor.drivers.map((driverName, idx) => {
                    const match = drivers.find(d => `${d.firstName} ${d.lastName}` === driverName);
                    return (
                      <div 
                        key={idx}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.8rem 1rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          cursor: match ? 'pointer' : 'default'
                        }}
                        onClick={() => {
                          if (match) {
                            setActiveModalTeamId(null);
                            setActiveModalDriverId(match.id);
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ width: '4px', height: '20px', backgroundColor: constructor.color || '#fff', borderRadius: '2px' }}></div>
                          <strong style={{ fontSize: '0.9rem' }}>{driverName}</strong>
                        </div>
                        {match && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>#{match.number}</span>
                            <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{match.points} PTS</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', textTransform: 'uppercase', color: 'var(--f1-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Championship Progression</h3>
                <div style={{ height: '140px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  {constructor.seasonProgression.map((prog, index) => {
                    const maxVal = Math.max(...constructor.seasonProgression.map(p => p.points), 1);
                    const pct = (prog.points / maxVal) * 90; // scale to 90% height
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          width: `${100 / constructor.seasonProgression.length}%` 
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {prog.points}
                        </span>
                        <div 
                          style={{ 
                            width: '16px', 
                            height: `${pct}px`, 
                            backgroundColor: constructor.color || '#E10600',
                            borderRadius: '3px 3px 0 0',
                            boxShadow: `0 0 8px ${(constructor.color || '#E10600')}60`
                          }}
                        ></div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase' }}>
                          {prog.race.substr(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
