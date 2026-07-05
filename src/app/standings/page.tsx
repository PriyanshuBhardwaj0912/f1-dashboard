'use client';

import React, { useState, useMemo } from 'react';
import { useF1Store } from '../../store/f1Store';
import { Download, Search, SlidersHorizontal } from 'lucide-react';

type StandingsTab = 'drivers' | 'constructors';
type SortField = 'points' | 'wins' | 'podiums' | 'fastestLaps';

export default function StandingsPage() {
  const { 
    drivers, constructors, loading, refreshStandings, 
    toggleFavoriteDriver, isFavoriteDriver,
    toggleFavoriteTeam, isFavoriteTeam,
    setActiveModalDriverId, setActiveModalTeamId
  } = useF1Store();

  const [activeTab, setActiveTab] = useState<StandingsTab>('drivers');
  
  // Filtering & Sorting states
  const [searchVal, setSearchVal] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortField>('points');

  // CSV Exporter helper
  const exportToCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (activeTab === 'drivers') {
      filename = 'f1_2026_driver_standings.csv';
      headers = ['Position', 'Driver Code', 'Driver Name', 'Number', 'Nationality', 'Constructor', 'Wins', 'Podiums', 'Fastest Laps', 'Points'];
      
      const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);
      rows = sortedDrivers.map((d, index) => [
        String(index + 1),
        d.code,
        `${d.firstName} ${d.lastName}`,
        String(d.number),
        d.nationality,
        d.teamName,
        String(d.wins),
        String(d.podiums),
        String(d.fastestLaps),
        String(d.points)
      ]);
    } else {
      filename = 'f1_2026_constructor_standings.csv';
      headers = ['Position', 'Team Name', 'Principal', 'Engine Supplier', 'Drivers', 'Wins', 'Championships', 'Points'];
      
      const sortedTeams = [...constructors].sort((a, b) => b.points - a.points);
      rows = sortedTeams.map((c, index) => [
        String(index + 1),
        c.name,
        c.principal,
        c.engine,
        c.drivers.join(' / '),
        String(c.wins),
        String(c.championships),
        String(c.points)
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Drivers Database
  const processedDrivers = useMemo(() => {
    let list = [...drivers];

    // Search query match
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      list = list.filter(d => 
        d.firstName.toLowerCase().includes(q) || 
        d.lastName.toLowerCase().includes(q) || 
        d.code.toLowerCase().includes(q)
      );
    }

    // Constructor filter match
    if (selectedTeamFilter !== 'All') {
      list = list.filter(d => d.teamId === selectedTeamFilter || d.teamName.toLowerCase().includes(selectedTeamFilter.toLowerCase()));
    }

    // Sort metrics
    list.sort((a, b) => {
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'wins') {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - a.points; // Tiebreaker
      }
      if (sortBy === 'podiums') {
        if (b.podiums !== a.podiums) return b.podiums - a.podiums;
        return b.points - a.points;
      }
      if (sortBy === 'fastestLaps') {
        if (b.fastestLaps !== a.fastestLaps) return b.fastestLaps - a.fastestLaps;
        return b.points - a.points;
      }
      return 0;
    });

    return list;
  }, [drivers, searchVal, selectedTeamFilter, sortBy]);

  // Lead driver points for gap calculations
  const leaderPoints = drivers[0]?.points || 0;

  // Render dummy form results (represented as past GP finish highlights: Gold/1st, Silver/2nd, Bronze/3rd, Green/Points, Gray/Out of points)
  const getFormBubble = (finishPos: number) => {
    const title = `Finished P${finishPos}`;
    if (finishPos === 1) return <span key={finishPos} title={title} className="form-pill gold" style={{ width: '18px', height: '18px', fontSize: '0.6rem', margin: '0 2px' }}>P1</span>;
    if (finishPos <= 3) return <span key={finishPos} title={title} className="form-pill silver" style={{ width: '18px', height: '18px', fontSize: '0.6rem', margin: '0 2px' }}>P{finishPos}</span>;
    if (finishPos <= 10) return <span key={finishPos} title={title} className="form-pill points" style={{ width: '18px', height: '18px', fontSize: '0.6rem', margin: '0 2px', backgroundColor: 'var(--green-accent)', color: 'white' }}>P{finishPos}</span>;
    return <span key={finishPos} title={title} className="form-pill points" style={{ width: '18px', height: '18px', fontSize: '0.6rem', margin: '0 2px' }}>P{finishPos}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top action header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Championship Standings</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Season 2026 Standings Progression and Driver Stat Logs</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={refreshStandings}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Sync Updates
          </button>
          <button 
            onClick={exportToCSV}
            style={{
              backgroundColor: 'var(--f1-red)',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              padding: '0.5rem 1.2rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Switch pill toggle selector */}
      <div style={{ 
        display: 'flex', 
        alignSelf: 'flex-start',
        backgroundColor: 'var(--bg-tertiary)', 
        padding: '4px', 
        borderRadius: '30px', 
        border: '1px solid var(--border-color)',
        position: 'relative',
        width: 'fit-content',
        marginBottom: '0.5rem'
      }}>
        {/* Active sliding background indicator */}
        <div style={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          left: activeTab === 'drivers' ? '4px' : '50%',
          width: '50%',
          backgroundColor: 'var(--f1-red)',
          borderRadius: '26px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 10px rgba(225, 6, 0, 0.35)',
          zIndex: 1
        }} />

        <button 
          onClick={() => setActiveTab('drivers')}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'drivers' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 700,
            padding: '0.5rem 1.6rem',
            cursor: 'pointer',
            borderRadius: '26px',
            transition: 'color 0.2s ease',
            zIndex: 2,
            outline: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Drivers Championship
        </button>
        <button 
          onClick={() => setActiveTab('constructors')}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'constructors' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 700,
            padding: '0.5rem 1.6rem',
            cursor: 'pointer',
            borderRadius: '26px',
            transition: 'color 0.2s ease',
            zIndex: 2,
            outline: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Constructors Championship
        </button>
      </div>

      {/* Conditional Filtering bar (Only for Drivers tab) */}
      {activeTab === 'drivers' && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ width: '280px' }}>
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search driver name or code..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Team:</span>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                outline: 'none'
              }}
            >
              <option value="All">All Constructors</option>
              {constructors.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                outline: 'none'
              }}
            >
              <option value="points">Championship Points</option>
              <option value="wins">Race Wins</option>
              <option value="podiums">Podium Finishes</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Table viewports */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ height: '40px' }} className="skeleton"></div>
          <div style={{ height: '250px' }} className="skeleton"></div>
        </div>
      ) : activeTab === 'drivers' ? (
        <div className="table-container">
          <table className="f1-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Pos</th>
                <th>Driver</th>
                <th style={{ width: '120px' }}>Nationality</th>
                <th>Constructor</th>
                <th style={{ textAlign: 'right' }}>Wins</th>
                <th style={{ textAlign: 'right' }}>Podiums</th>
                <th style={{ textAlign: 'right' }}>Points</th>
                <th style={{ textAlign: 'right' }}>Gap</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Fav</th>
              </tr>
            </thead>
            <tbody>
              {processedDrivers.map((d, index) => {
                const pos = drivers.findIndex(orig => orig.id === d.id) + 1;
                const isLeader = pos === 1;
                const gap = isLeader ? 'Leader' : `-${leaderPoints - d.points}`;
                const isFav = isFavoriteDriver(d.id);

                return (
                  <tr key={d.id} className="standing-row-animated">
                    <td style={{ textAlign: 'center' }}>
                      <span className={`form-pill ${pos === 1 ? 'gold' : pos === 2 ? 'silver' : pos === 3 ? 'bronze' : 'points'}`}>
                        {pos}
                      </span>
                    </td>
                    <td onClick={() => setActiveModalDriverId(d.id)} style={{ cursor: 'pointer' }}>
                      <div className="constructor-cell-stripes" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span className="team-stripe" style={{ width: '4px', height: '24px', backgroundColor: d.color, borderRadius: '2px' }}></span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={d.photo} 
                          alt={d.lastName} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="%232a2a35"/><path d="M16 8a4 4 0 100 8 4 4 0 000-8zM16 18c-4.4 0-8 2.6-8 5.8V25h16v-1.2c0-3.2-3.6-5.8-8-5.8z" fill="%23a0a0b0"/></svg>`;
                          }}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.92rem' }}>{d.firstName} {d.lastName}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>#{d.number}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={d.flag} alt={d.nationality} style={{ width: '20px', border: '1px solid var(--border-color)', borderRadius: '1px' }} />
                        <span style={{ fontSize: '0.85rem' }}>{d.code}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }} onClick={() => setActiveModalTeamId(d.teamId)}>
                      <span style={{ cursor: 'pointer' }}>{d.teamName}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{d.wins}</td>
                    <td style={{ textAlign: 'right' }}>{d.podiums}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--f1-red)' }}>{d.points}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{gap}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteDriver(d.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isFav ? 'var(--yellow-accent)' : 'var(--text-muted)',
                          fontSize: '1.2rem',
                          cursor: 'pointer'
                        }}
                        aria-label="Toggle Favorite"
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table className="f1-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Pos</th>
                <th>Constructor</th>
                <th>Engine PU</th>
                <th>Drivers Lineup</th>
                <th style={{ textAlign: 'right' }}>Wins</th>
                <th style={{ textAlign: 'right' }}>Championships</th>
                <th style={{ textAlign: 'right' }}>Points</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Fav</th>
              </tr>
            </thead>
            <tbody>
              {[...constructors].sort((a, b) => b.points - a.points).map((c, index) => {
                const pos = index + 1;
                const isFav = isFavoriteTeam(c.id);

                return (
                  <tr key={c.id}>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`form-pill ${pos === 1 ? 'gold' : pos === 2 ? 'silver' : pos === 3 ? 'bronze' : 'points'}`}>
                        {pos}
                      </span>
                    </td>
                    <td onClick={() => setActiveModalTeamId(c.id)} style={{ cursor: 'pointer' }}>
                      <div className="constructor-cell-stripes" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span className="team-stripe" style={{ width: '4px', height: '24px', backgroundColor: c.color || '#fff', borderRadius: '2px' }}></span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={c.logo} 
                          alt={c.name} 
                          style={{ width: '22px', height: '14px', borderRadius: '2px', border: '1px solid var(--border-color)' }}
                        />
                        {c.livery && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={c.livery} 
                            alt={`${c.name} Car`} 
                            style={{ 
                              width: '70px', 
                              height: '24px', 
                              objectFit: 'contain',
                              marginLeft: '2px',
                              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))'
                            }}
                          />
                        )}
                        <strong style={{ fontSize: '0.92rem' }}>{c.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{c.engine}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {c.drivers.join(' / ')}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.wins}</td>
                    <td style={{ textAlign: 'right' }}>{c.championships}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--f1-red)' }}>{c.points}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTeam(c.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isFav ? 'var(--yellow-accent)' : 'var(--text-muted)',
                          fontSize: '1.2rem',
                          cursor: 'pointer'
                        }}
                        aria-label="Toggle Favorite"
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
