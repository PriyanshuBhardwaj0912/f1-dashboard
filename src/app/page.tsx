'use client';

import React, { useEffect, useState } from 'react';
import { useF1Store } from '../store/f1Store';
import { f1ApiService } from '../services/f1Api';
import { Race } from '../types/f1';
import { 
  Timer, Calendar, MapPin, Compass, Zap, 
  ChevronRight, MessageSquare, Clock, Trophy, Route, Flag, Newspaper, Tag
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { timelineEvents, showToast, isSimulating } = useF1Store();
  const [nextGP, setNextGP] = useState<Race | null>(null);
  const [lastRaces, setLastRaces] = useState<Race[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const calendar = await f1ApiService.getCalendar();
        // Since British GP (Round 9) is 'live', we want it to be the main countdown target or active GP
        const upcoming = calendar.find(r => r.status === 'live' || r.status === 'upcoming');
        const completed = calendar.filter(r => r.status === 'completed').sort((a, b) => b.round - a.round);
        
        setNextGP(upcoming || null);
        setLastRaces(completed.slice(0, 2));

        // Load F1 News
        const newsData = await f1ApiService.getNews();
        setNews(newsData.slice(0, 2));
      } catch (err) {
        showToast('Failed loading homepage F1 telemetry', 'warning');
      }
    };
    loadHomeData();
  }, [showToast]);

  // Countdown clock calculations (runs client-side)
  useEffect(() => {
    if (!nextGP) return;
    
    // Parse target date (July 5, 2026 15:00:00 for British GP)
    let targetDate = new Date(nextGP.date);
    if (isNaN(targetDate.getTime())) {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 5);
      targetDate.setHours(15, 0, 0, 0);
    } else {
      if (!nextGP.date.includes('T')) {
        targetDate.setHours(15, 0, 0, 0);
      }
    }

    const updateTimer = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ d: days, h: hours, m: minutes, s: seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextGP]);

  const renderTimeSegment = (num: number, label: string) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '2px' }}>
        <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{pad(num)}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontWeight: 700, marginRight: '6px' }}>{label}</span>
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Banner */}
      <section className="card card-hero">
        <div className="hero-content" style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            FORMULA 1 <span className="highlight-text" style={{ fontStyle: 'normal', color: 'var(--f1-red)', fontWeight: 900 }}>2026 HUB</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '580px', lineHeight: 1.6, margin: 0 }}>
            Welcome to the ultimate F1 analytics suite. Track driver progression, constructor status, 
            dynamic comparisons, and live telemetry feeds.
          </p>
        </div>

        {nextGP && (
          <div 
            style={{ 
              background: 'rgba(20, 20, 27, 0.75)', 
              padding: '1.2rem 1.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              minWidth: '290px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', fontWeight: 600 }}>
              NEXT EVENT
            </span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--f1-red)', display: 'block', margin: '4px 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {nextGP.gpName}
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
              {nextGP.circuit.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              {nextGP.status === 'live' && timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0 ? (
                <span className="badge badge-live" style={{ backgroundColor: 'var(--f1-red)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px', animation: 'flash 1.5s infinite' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#fff', borderRadius: '50%' }}></span>
                  SESSION LIVE NOW
                </span>
              ) : (
                <>
                  <Clock size={15} style={{ color: 'var(--f1-red)' }} />
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    {renderTimeSegment(timeLeft.d, 'd')}
                    {renderTimeSegment(timeLeft.h, 'h')}
                    {renderTimeSegment(timeLeft.m, 'm')}
                    {renderTimeSegment(timeLeft.s, 's')}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Split grid for Weather and Last Races */}
      <div className="home-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Left Card: Last Two Race Results */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0, fontWeight: 700 }}>
            LAST TWO RACE RESULTS
          </h3>
          {lastRaces.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {lastRaces.map((race, index) => (
                <div 
                  key={index} 
                  style={{ 
                    borderTop: index > 0 ? '1px solid var(--border-color)' : 'none', 
                    paddingTop: index > 0 ? '1.25rem' : '0' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img 
                        src={race.flag} 
                        alt={race.country} 
                        style={{ width: '22px', height: '14px', border: '1px solid var(--border-color)', borderRadius: '2px' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>{race.gpName}</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{race.circuit.name}</span>
                      </div>
                    </div>
                    <span className="badge badge-muted" style={{ fontSize: '0.65rem', textTransform: 'none', backgroundColor: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>
                      Rnd {race.round}
                    </span>
                  </div>

                  {/* Podium standings container */}
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                      PODIUM STANDINGS
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🥇 <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>1st</span>
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{race.winnerName}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🥈 <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>2nd</span>
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{race.secondPlaceName || 'George Russell'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🥉 <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>3rd</span>
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{race.thirdPlaceName || 'Lewis Hamilton'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Pole & Fastest Lap Footer metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Compass size={14} style={{ color: 'var(--f1-red)' }} />
                      <div>
                        <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)' }}>Pole Position</span>
                        <strong style={{ color: 'var(--text-secondary)' }}>{race.poleName || 'Kimi Antonelli'}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} style={{ color: 'var(--purple-accent)' }} />
                      <div>
                        <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)' }}>Fastest Lap</span>
                        <strong style={{ color: 'var(--text-secondary)' }}>{race.fastestLapName || 'George Russell'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Card: Next GP Weekend */}
        <section className="card highlight" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTopColor: 'var(--f1-red)' }}>
          {nextGP && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontWeight: 700 }}>
                  <Calendar size={14} style={{ color: 'var(--f1-red)' }} /> NEXT GP WEEKEND
                </h3>
                <span className="badge" style={{ backgroundColor: 'var(--f1-red)', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  ROUND {nextGP.round}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img 
                  src={nextGP.flag} 
                  alt={nextGP.country} 
                  style={{ width: '26px', height: '16px', border: '1px solid var(--border-color)', borderRadius: '2px' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {nextGP.gpName.toUpperCase()}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={11} /> {nextGP.circuit.name}, UK
                  </span>
                </div>
              </div>

              {/* Glowing Silverstone Track Path layout */}
              <div 
                style={{ 
                  flex: 1,
                  background: 'var(--bg-tertiary)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  minHeight: '220px',
                  overflow: 'hidden'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://media.formula1.com/image/upload/c_fit,h_220/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png" 
                  alt="Silverstone Circuit Map"
                  style={{ 
                    maxHeight: '180px', 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    filter: 'invert(1) brightness(1.2) contrast(1.1)'
                  }}
                />
              </div>

              {/* Circuit Info Grid (laps, track length, lap record, historical winner) */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                fontSize: '0.8rem', 
                background: 'rgba(255, 255, 255, 0.02)', 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)', 
                marginTop: '0.5rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
                    <Route size={16} style={{ color: '#00D2FF' }} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Track Length</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{nextGP.circuit.length}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                    <Flag size={16} style={{ color: '#FACC15' }} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Number of Laps</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{nextGP.circuit.laps} Laps</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <Zap size={16} style={{ color: '#A855F7' }} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Lap Record</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{nextGP.circuit.recordTime}</strong>
                    <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: '1.1' }}>{nextGP.circuit.recordHolder}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(225, 6, 0, 0.1)', border: '1px solid rgba(225, 6, 0, 0.2)' }}>
                    <Trophy size={16} style={{ color: 'var(--f1-red)' }} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Last Winner</span>
                    <strong style={{ color: 'var(--f1-red)', fontSize: '0.85rem' }}>{nextGP.circuit.historicalWinners?.[0] || 'Lando Norris (2025)'}</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Bottom Grid: Live Event Timeline & Latest F1 News */}
      <div className="home-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start', marginTop: '0.5rem' }}>
        {/* Live Race Event Timeline */}
        <section className="card" style={{ margin: 0, height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontWeight: 700 }}>
              <MessageSquare size={16} style={{ color: 'var(--f1-red)' }} /> LIVE COMMENTARY
            </h3>
            {isSimulating && <span className="badge badge-live">Live Feeding</span>}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: 1.5 }}>
            A real-time ticker tracking major track incidents, qualifying laps, flag updates, and session commentary.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '310px', overflowY: 'auto', paddingRight: '6px' }}>
            {timelineEvents.map((event) => {
              const isRed = event.type === 'flag-red' || event.type === 'incident';
              const isYellow = event.type === 'flag-yellow' || event.type === 'safety-car';
              const accent = isRed 
                ? 'var(--f1-red)' 
                : isYellow 
                  ? 'var(--yellow-accent)' 
                  : 'var(--green-accent)';

              return (
                <div 
                  key={event.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem', 
                    padding: '0.75rem 1rem', 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    borderLeft: `3px solid ${accent}`
                  }}
                >
                  <div style={{ minWidth: '60px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {event.timestamp}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    {event.message}
                  </div>
                  <div className="badge badge-muted" style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '2px 6px' }}>
                    LAP {event.lap}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Latest News Feed */}
        <section className="card" style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontWeight: 700 }}>
              <Newspaper size={16} style={{ color: 'var(--f1-red)' }} /> LATEST F1 NEWS
            </h3>
            <Link href="/news" style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontWeight: 700, textDecoration: 'none' }}>
              VIEW ALL
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {news.map((art) => {
              const borderCol = art.category === 'Racing' 
                ? 'var(--f1-red)' 
                : art.category === 'Tech' 
                  ? 'var(--purple-accent)' 
                  : 'var(--yellow-accent)';

              return (
                <div 
                  key={art.id} 
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    borderTop: `3px solid ${borderCol}`,
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span 
                      className="badge" 
                      style={{ 
                        fontSize: '0.6rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        padding: '2px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Tag size={9} /> {art.category}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {art.date}
                    </span>
                  </div>
                  
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                    {art.title}
                  </h4>
                  
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    {art.summary.length > 110 ? `${art.summary.substring(0, 110)}...` : art.summary}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                    <span>{art.source}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {art.readTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0px 0px 4px rgba(225,6,0,0.6)); }
          50% { filter: drop-shadow(0px 0px 12px rgba(225,6,0,0.9)); }
          100% { filter: drop-shadow(0px 0px 4px rgba(225,6,0,0.6)); }
        }
      `}</style>
    </div>
  );
}
