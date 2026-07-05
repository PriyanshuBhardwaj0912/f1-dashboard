'use client';

import React, { useEffect, useState } from 'react';
import { useF1Store } from '../../store/f1Store';
import { f1ApiService } from '../../services/f1Api';
import { Race } from '../../types/f1';
import { Timer, Award, Zap } from 'lucide-react';

// Returns the official Formula1.com URL for each circuit map image
const getOfficialCircuitImage = (round: number): string => {
  const map: { [key: number]: string } = {
    1: 'Australia_Circuit.png',
    2: 'China_Circuit.png',
    3: 'Japan_Circuit.png',
    4: 'Miami_Circuit.png',
    5: 'Canada_Circuit.png',
    6: 'Monaco_Circuit.png',
    7: 'Spain_Circuit.png',
    8: 'Austria_Circuit.png',
    9: 'Great_Britain_Circuit.png',
    10: 'Belgium_Circuit.png',
    11: 'Hungary_Circuit.png',
    12: 'Netherlands_Circuit.png',
    13: 'Italy_Circuit.png',
    14: 'Spain_Circuit.png', // Fallback for Madrid
    15: 'Baku_Circuit.png',
    16: 'Singapore_Circuit.png',
    17: 'USA_Circuit.png',
    18: 'Las_Vegas_Circuit.png',
    19: 'Qatar_Circuit.png',
    20: 'Abu_Dhabi_Circuit.png'
  };
  const filename = map[round] || 'Great_Britain_Circuit.png';
  return `https://media.formula1.com/image/upload/c_fit,h_220/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${filename}`;
};

export default function CalendarPage() {
  const { showToast } = useF1Store();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setLoading(true);
        const data = await f1ApiService.getCalendar();
        setRaces(data);
      } catch (err) {
        showToast('Failed to load race calendar', 'warning');
      } finally {
        setLoading(false);
      }
    };
    loadCalendar();
  }, [showToast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>2026 Season Calendar</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full schedule of Grand Prix races, results, and upcoming session countdowns</span>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <div style={{ height: '280px' }} className="skeleton"></div>
          <div style={{ height: '280px' }} className="skeleton"></div>
          <div style={{ height: '280px' }} className="skeleton"></div>
          <div style={{ height: '280px' }} className="skeleton"></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {races.map((race) => (
            <CalendarRaceCard key={race.round} race={race} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component to manage countdown timers individually for each card
const CalendarRaceCard: React.FC<{ race: Race }> = ({ race }) => {
  const [countdownText, setCountdownText] = useState('Calculating...');

  useEffect(() => {
    if (race.status !== 'upcoming') return;

    let targetDate = new Date(race.date);
    if (isNaN(targetDate.getTime())) {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + (race.round * 4));
      targetDate.setHours(13, 0, 0, 0);
    } else {
      if (!race.date.includes('T')) {
        targetDate.setHours(15, 0, 0, 0); // Default to 15:00 race time
      }
    }

    const updateTimer = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setCountdownText('SESSION LIVE');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      setCountdownText(`${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [race]);

  const statusBadgeClass = race.status === 'live' 
    ? 'badge-live' 
    : race.status === 'completed' 
      ? 'badge-green' 
      : 'badge-purple';

  return (
    <div className="card highlight" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between', minHeight: '340px' }}>
      <div>
        {/* Header flag & status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={race.flag} 
              alt={race.country} 
              style={{ width: '32px', height: '20px', border: '1px solid var(--border-color)', borderRadius: '2px' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ROUND {race.round}</span>
          </div>
          <span className={`badge ${statusBadgeClass}`}>{race.status.toUpperCase()}</span>
        </div>

        {/* GP names */}
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {race.gpName}
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
          {race.circuit.name}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {race.date.split('T')[0]}
        </span>
      </div>

      {/* Official F1 Circuit Image Card */}
      <div 
        style={{ 
          height: '110px', 
          background: 'var(--bg-primary)', 
          borderRadius: '8px', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          margin: '0.4rem 0',
          overflow: 'hidden'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={getOfficialCircuitImage(race.round)} 
          alt={`${race.circuit.name} Map`}
          style={{ 
            maxHeight: '100px', 
            maxWidth: '100%', 
            objectFit: 'contain',
            filter: 'invert(1) brightness(1.2)' 
          }}
        />
      </div>

      {/* Conditional stats footer details */}
      {race.status === 'completed' ? (
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '0.6rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>🥇 Winner</span>
            <strong style={{ color: 'var(--text-primary)' }}>{race.winnerName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>⏱️ Pole Position</span>
            <span style={{ color: 'var(--text-secondary)' }}>{race.poleName || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>⚡ Fastest Lap</span>
            <span style={{ color: 'var(--text-secondary)' }}>{race.fastestLapName || 'N/A'}</span>
          </div>
        </div>
      ) : race.status === 'live' ? (
        <div style={{ background: 'rgba(225, 6, 0, 0.04)', border: '1px solid rgba(225, 6, 0, 0.2)', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--f1-red)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Session Running</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Live Telemetry active in Race Center</span>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.7rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--yellow-accent)' }}>
          <Timer size={14} />
          <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            {countdownText}
          </span>
        </div>
      )}
    </div>
  );
};
