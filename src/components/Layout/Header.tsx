'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useF1Store } from '../../store/f1Store';
import { Search, RefreshCw, Sun, Moon, Bell, X, Clock, Menu } from 'lucide-react';
import { f1ApiService } from '../../services/f1Api';
import { Race } from '../../types/f1';

function formatGPDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const parts = dateStr.split(' ');
      if (parts.length >= 2) {
        return `${parts[1]} ${parseInt(parts[0])}`;
      }
      return dateStr;
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export const Header: React.FC = () => {
  const { 
    theme, toggleTheme, 
    drivers, constructors, 
    raceState, isSimulating, lapCount, maxLaps,
    setActiveModalDriverId, setActiveModalTeamId,
    isMobileSidebarOpen, setIsMobileSidebarOpen
  } = useF1Store();

  const [inputVal, setInputVal] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [updateTime, setUpdateTime] = useState('Just Now');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liveGP, setLiveGP] = useState<Race | null>(null);
  const [nextGP, setNextGP] = useState<Race | null>(null);
  const [lastGP, setLastGP] = useState<Race | null>(null);

  useEffect(() => {
    const loadGPData = async () => {
      try {
        const calendar = await f1ApiService.getCalendar();
        const live = calendar.find(r => r.status === 'live');
        const upcoming = calendar.filter(r => r.status === 'upcoming').sort((a, b) => a.round - b.round);
        const completed = calendar.filter(r => r.status === 'completed').sort((a, b) => b.round - a.round);

        if (live) {
          setLiveGP(live);
          if (upcoming.length > 0) setNextGP(upcoming[0]);
        } else {
          if (upcoming.length > 0) setNextGP(upcoming[0]);
          if (completed.length > 0) setLastGP(completed[0]);
        }
      } catch (err) {
        console.error('Header data load error:', err);
      }
    };
    loadGPData();
  }, []);

  // Keybind listeners: '/' to search, 'Esc' to blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update timestamps simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setUpdateTime(`Last synced: ${now.toLocaleTimeString()}`);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const valClean = inputVal.trim().toLowerCase();

  // Filter search database
  const matchedDrivers = valClean.length >= 2 
    ? drivers.filter(d => 
        d.firstName.toLowerCase().includes(valClean) || 
        d.lastName.toLowerCase().includes(valClean) || 
        d.code.toLowerCase().includes(valClean) ||
        d.teamName.toLowerCase().includes(valClean)
      )
    : [];

  const matchedConstructors = valClean.length >= 2 
    ? constructors.filter(c => 
        c.name.toLowerCase().includes(valClean) ||
        c.engine.toLowerCase().includes(valClean)
      )
    : [];
  const hasResults = matchedDrivers.length > 0 || matchedConstructors.length > 0;

  return (
    <header className="top-navbar">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        aria-label="Toggle Navigation Menu"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '0.4rem',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '0.75rem'
        }}
      >
        <Menu size={24} />
      </button>
      {/* Session status widgets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} id="nav-status-widget">
        {isSimulating || liveGP ? (
          <>
            <span className="badge badge-live" style={{ backgroundColor: 'var(--f1-red)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              {isSimulating ? 'LIVE TIMING' : 'LIVE'}
            </span>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {liveGP ? liveGP.gpName.replace(' Grand Prix', ' GP').toUpperCase() : 'BRITISH GP'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {isSimulating 
                  ? `Sunday Race (Lap ${lapCount}/${maxLaps})` 
                  : 'Sunday Race (Live)'}
              </span>
            </div>
            {nextGP && (
              <div className="header-next-gp-widget" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.75rem' }}>
                <Clock size={14} style={{ color: 'var(--f1-red)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Next Race Event
                  </span>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--f1-red)', fontWeight: 700 }}>
                    {nextGP.gpName.replace(' Grand Prix', ' GP').toUpperCase()} – {formatGPDate(nextGP.date)}
                  </strong>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <span className="badge badge-green" style={{ backgroundColor: 'var(--green-accent)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              FINISHED
            </span>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lastGP ? lastGP.gpName.replace(' Grand Prix', ' GP').toUpperCase() : 'AUSTRIAN GP'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Session Ended</span>
            </div>
            {nextGP && (
              <div className="header-next-gp-widget" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.75rem' }}>
                <Clock size={14} style={{ color: 'var(--f1-red)' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Next Race Event
                  </span>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--f1-red)', fontWeight: 700 }}>
                    {nextGP.gpName.replace(' Grand Prix', ' GP').toUpperCase()} – {formatGPDate(nextGP.date)}
                  </strong>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Autocomplete Global Search */}
      <div ref={containerRef} className="nav-search-container" style={{ position: 'relative', width: '250px' }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search..." 
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          {inputVal && (
            <button 
              onClick={() => setInputVal('')}
              style={{
                position: 'absolute',
                right: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown items */}
        {showDropdown && inputVal.length >= 2 && (
          <div 
            className="search-results-dropdown" 
            style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              width: '100%', 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              marginTop: '4px',
              boxShadow: 'var(--shadow-md)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 100
            }}
          >
            {!hasResults ? (
              <div style={{ padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No drivers or constructors found matching &quot;{inputVal}&quot;
              </div>
            ) : (
              <>
                {matchedDrivers.length > 0 && (
                  <div>
                    <div style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--f1-red)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                      Drivers
                    </div>
                    {matchedDrivers.map(d => (
                      <button 
                        key={d.id} 
                        onClick={() => {
                          setActiveModalDriverId(d.id);
                          setShowDropdown(false);
                          setInputVal('');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 0.8rem',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.85rem'
                        }}
                      >
                        <strong>{d.firstName} {d.lastName} ({d.code})</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.teamName}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedConstructors.length > 0 && (
                  <div>
                    <div style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--f1-red)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', marginTop: '4px' }}>
                      Constructors
                    </div>
                    {matchedConstructors.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => {
                          setActiveModalTeamId(c.id);
                          setShowDropdown(false);
                          setInputVal('');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 0.8rem',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.85rem'
                        }}
                      >
                        <strong>{c.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.engine} Engine</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right control buttons */}
      <div className="nav-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="update-status" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>Updated: Just Now</span>
        </div>

        <button 
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
