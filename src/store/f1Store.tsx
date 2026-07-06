'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { LiveDriverState, TimelineEvent, Driver, Constructor } from '../types/f1';
import { INITIAL_LIVE_DRIVERS, INITIAL_TIMELINE_EVENTS, updateDriverTelemetry } from '../services/liveSim';
import { f1ApiService } from '../services/f1Api';

interface FavoritesState {
  drivers: string[];
  teams: string[];
}

export type RaceFlagState = 'green' | 'yellow' | 'red' | 'safety-car';

interface ToastMessage {
  message: string;
  type: 'success' | 'info' | 'warning';
  id: number;
}

interface F1ContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  favorites: FavoritesState;
  isFavoriteDriver: (id: string) => boolean;
  toggleFavoriteDriver: (id: string) => void;
  isFavoriteTeam: (id: string) => boolean;
  toggleFavoriteTeam: (id: string) => void;
  
  // Modal controllers
  activeModalDriverId: string | null;
  setActiveModalDriverId: (id: string | null) => void;
  activeModalTeamId: string | null;
  setActiveModalTeamId: (id: string | null) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Live Simulator States
  liveDrivers: LiveDriverState[];
  raceState: RaceFlagState;
  setRaceState: (state: RaceFlagState) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  lapCount: number;
  maxLaps: number;
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (type: TimelineEvent['type'], message: string) => void;
  resetSimulator: () => void;
  selectedLiveDriverId: string;
  setSelectedLiveDriverId: (id: string) => void;
  
  // Toast Warnings
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: number) => void;

  // Static API Datasets (shared context cache)
  drivers: Driver[];
  constructors: Constructor[];
  loading: boolean;
  refreshStandings: () => Promise<void>;
  
  // Mobile sidebar states
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

const F1Context = createContext<F1ContextType | undefined>(undefined);

export const F1Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme & Favorites State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [favorites, setFavorites] = useState<FavoritesState>({ drivers: [], teams: [] });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modal states
  const [activeModalDriverId, setActiveModalDriverId] = useState<string | null>(null);
  const [activeModalTeamId, setActiveModalTeamId] = useState<string | null>(null);

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toast Alert Queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);
  
  // Static API Data States
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Timing States
  const [liveDrivers, setLiveDrivers] = useState<LiveDriverState[]>(INITIAL_LIVE_DRIVERS);
  const [raceState, setRaceState] = useState<RaceFlagState>('green');
  const [isSimulating, setIsSimulating] = useState(false);
  const [lapCount, setLapCount] = useState(24);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [selectedLiveDriverId, setSelectedLiveDriverId] = useState('antonelli');
  const maxLaps = 52;

  // Local storage synchronization on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('f1_theme') as 'dark' | 'light';
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }

      const storedFavs = localStorage.getItem('f1_favorites');
      if (storedFavs) {
        try {
          setFavorites(JSON.parse(storedFavs));
        } catch (e) {}
      }

      // Versioned cache eviction to clear out-of-date standings points and calendar cache
      if (!localStorage.getItem('f1_cache_eviction_v3')) {
        localStorage.removeItem('f1_drivers_dynamic');
        localStorage.removeItem('f1_constructors_dynamic');
        localStorage.removeItem('f1_calendar_dynamic');
        localStorage.removeItem('f1_cache_drivers');
        localStorage.removeItem('f1_cache_constructors');
        localStorage.removeItem('f1_cache_calendar');
        localStorage.setItem('f1_cache_eviction_v3', 'true');
      }

      // Evict old calendar cache containing the incorrect Monday date, incorrect Belgian GP times, or incorrect British GP winner (Kimi Antonelli instead of Charles Leclerc)
      const storedCalendar = localStorage.getItem('f1_calendar_dynamic');
      if (storedCalendar) {
        let needsEviction = false;
        try {
          const parsed = JSON.parse(storedCalendar);
          const round9 = parsed.find((r: any) => r.round === 9);
          if (round9 && round9.status === 'completed' && round9.winnerName.includes('Antonelli')) {
            needsEviction = true;
          }
        } catch (e) {
          needsEviction = true;
        }

        if (storedCalendar.includes('2026-07-06T02:30:00Z') || 
            (storedCalendar.includes('Belgian Grand Prix') && storedCalendar.includes('T11:30:00Z'))) {
          needsEviction = true;
        }

        if (needsEviction) {
          localStorage.removeItem('f1_calendar_dynamic');
        }
      }
    }

    // Load initial static datasets
    const loadStaticData = async () => {
      try {
        setLoading(true);
        const drvs = await f1ApiService.getDrivers();
        const consts = await f1ApiService.getConstructors();
        setDrivers(drvs);
        setConstructors(consts);
      } catch (err) {
        console.error('Failed loading F1 static data catalog', err);
      } finally {
        setLoading(false);
      }
    };
    loadStaticData();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('f1_theme', nextTheme);
  };

  // Toast utilities
  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Favorites handlers
  const toggleFavoriteDriver = (id: string) => {
    const isFav = favorites.drivers.includes(id);
    const updated = isFav 
      ? favorites.drivers.filter(dId => dId !== id)
      : [...favorites.drivers, id];
    const next = { ...favorites, drivers: updated };
    
    setFavorites(next);
    localStorage.setItem('f1_favorites', JSON.stringify(next));
    
    const driverName = drivers.find(d => d.id === id)?.lastName || id;
    showToast(`${isFav ? 'Removed' : 'Added'} ${driverName} ${isFav ? 'from' : 'to'} favorites`, 'success');
  };

  const isFavoriteDriver = (id: string) => favorites.drivers.includes(id);

  const toggleFavoriteTeam = (id: string) => {
    const isFav = favorites.teams.includes(id);
    const updated = isFav
      ? favorites.teams.filter(tId => tId !== id)
      : [...favorites.teams, id];
    const next = { ...favorites, teams: updated };

    setFavorites(next);
    localStorage.setItem('f1_favorites', JSON.stringify(next));

    const teamName = constructors.find(t => t.id === id)?.name || id;
    showToast(`${isFav ? 'Removed' : 'Added'} ${teamName} ${isFav ? 'from' : 'to'} favorites`, 'success');
  };

  const isFavoriteTeam = (id: string) => favorites.teams.includes(id);

  const addTimelineEvent = (type: TimelineEvent['type'], message: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newEvent: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: timeStr,
      type,
      message,
      lap: lapCount
    };
    setTimelineEvents(prev => [newEvent, ...prev].slice(0, 50)); // Limit to last 50 events
  };

  const completeRace = (finalRoster: LiveDriverState[]) => {
    setIsSimulating(false);
    
    const winner = finalRoster.find(d => d.position === 1);
    const p2 = finalRoster.find(d => d.position === 2);
    const p3 = finalRoster.find(d => d.position === 3);
    
    if (!winner) return;

    const pointsSchema = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    
    // Update Drivers Standings (wins, podiums, points)
    const updatedDrivers = drivers.map(d => {
      const raceResult = finalRoster.find(r => r.id === d.id);
      if (!raceResult) return d;
      
      let ptsWon = 0;
      if (raceResult.position <= 10) {
        ptsWon += pointsSchema[raceResult.position - 1];
      }
      if (raceResult.id === winner.id) {
        ptsWon += 1; // Fastest lap bonus
      }

      const isWin = raceResult.position === 1;
      const isPodium = raceResult.position <= 3;

      return {
        ...d,
        points: d.points + ptsWon,
        wins: d.wins + (isWin ? 1 : 0),
        podiums: d.podiums + (isPodium ? 1 : 0),
        careerWins: d.careerWins + (isWin ? 1 : 0),
        careerPodiums: d.careerPodiums + (isPodium ? 1 : 0)
      };
    });
    // Sort updated drivers list
    updatedDrivers.sort((a, b) => b.points - a.points);
    setDrivers(updatedDrivers);
    localStorage.setItem('f1_drivers_dynamic', JSON.stringify(updatedDrivers));

    // Update Constructors Standings
    const updatedConsts = constructors.map(c => {
      let teamPtsWon = 0;
      finalRoster.forEach(r => {
        if (r.teamName === c.name || (c.id === 'red_bull' && r.teamName.includes('Red Bull'))) {
          if (r.position <= 10) {
            teamPtsWon += pointsSchema[r.position - 1];
          }
          if (r.position === 1) {
            teamPtsWon += 1;
          }
        }
      });

      const isWin = finalRoster.some(r => r.position === 1 && (r.teamName === c.name || (c.id === 'red_bull' && r.teamName.includes('Red Bull'))));

      return {
        ...c,
        points: c.points + teamPtsWon,
        wins: c.wins + (isWin ? 1 : 0)
      };
    });
    updatedConsts.sort((a, b) => b.points - a.points);
    setConstructors(updatedConsts);
    localStorage.setItem('f1_constructors_dynamic', JSON.stringify(updatedConsts));

    // Update Calendar status (mark round 9 completed, update next event to Round 10)
    f1ApiService.getCalendar().then(calendar => {
      const updatedCalendar = calendar.map(r => {
        if (r.round === 9) {
          return {
            ...r,
            status: 'completed' as const,
            winnerName: `${winner.firstName} ${winner.lastName}`,
            winnerId: winner.id,
            secondPlaceName: p2 ? `${p2.firstName} ${p2.lastName}` : 'George Russell',
            thirdPlaceName: p3 ? `${p3.firstName} ${p3.lastName}` : 'Lewis Hamilton',
            poleName: 'Andrea Kimi Antonelli',
            fastestLapName: `${winner.firstName} ${winner.lastName}`
          };
        }
        return r;
      });
      localStorage.setItem('f1_calendar_dynamic', JSON.stringify(updatedCalendar));
    });

    showToast(`🏁 Chequered Flag! ${winner.firstName} ${winner.lastName} wins the British GP! Standings and calendar updated.`, 'success');
  };

  const resetSimulator = () => {
    setLiveDrivers(INITIAL_LIVE_DRIVERS);
    setRaceState('green');
    setIsSimulating(false);
    setLapCount(24);
    setTimelineEvents(INITIAL_TIMELINE_EVENTS);
    
    // Clear dynamic session records
    localStorage.removeItem('f1_drivers_dynamic');
    localStorage.removeItem('f1_constructors_dynamic');
    localStorage.removeItem('f1_calendar_dynamic');
    
    // Refresh fallback mock datasets
    f1ApiService.getDrivers().then(setDrivers);
    f1ApiService.getConstructors().then(setConstructors);
    
    showToast('Telemetry simulator and standings reset successfully', 'success');
  };

  const refreshStandings = async () => {
    try {
      setLoading(true);
      // Evict cache by calling api direct
      const drvs = await f1ApiService.getDrivers();
      const consts = await f1ApiService.getConstructors();
      setDrivers(drvs);
      setConstructors(consts);
      showToast('Standings updated with latest results', 'success');
    } catch (e) {
      showToast('Standings update failed, utilizing cache', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Real-time telemetry simulation ticking mechanism
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setLiveDrivers(prevDrivers => {
        // Create deep clone
        const updated = prevDrivers.map(d => ({
          ...d,
          telemetry: { ...d.telemetry }
        }));

        // Tick each driver
        let maxLapSeen = lapCount;
        let crossedLineAny = false;

        updated.forEach(drv => {
          const cross = updateDriverTelemetry(drv, 1.0, raceState);
          if (cross) {
            crossedLineAny = true;
            if (drv.lap > maxLapSeen) {
              maxLapSeen = drv.lap;
            }
          }
        });

        if (maxLapSeen > lapCount) {
          setLapCount(maxLapSeen);
        }

        // Sort positions by lap (desc) then by progress (desc)
        updated.sort((a, b) => {
          if (a.lap !== b.lap) return b.lap - a.lap;
          return b.progress - a.progress;
        });

        // Trigger race completion if the leader completes maxLaps
        const leadDriver = updated[0];
        if (leadDriver && leadDriver.lap >= maxLaps) {
          setTimeout(() => {
            completeRace(updated);
          }, 0);
          return prevDrivers; // Freeze live telemetry updates
        }

        // Update positions array index + calculate gaps (average lap = 68 seconds)
        const lapTimeSeconds = 68.0;

        updated.forEach((drv, index) => {
          const newPos = index + 1;
          
          // Overtake notice
          if (drv.position > newPos && isSimulating && raceState === 'green' && Math.random() < 0.3) {
            // Trigger overtake timeline event
            const overtaken = prevDrivers.find(p => p.position === newPos);
            if (overtaken) {
              addTimelineEvent('overtake', `Overtake: ${drv.firstName} ${drv.lastName} overtakes ${overtaken.lastName} for P${newPos}`);
            }
          }
          
          drv.position = newPos;

          // Gap Calculations
          if (index === 0) {
            drv.gap = 'LEADER';
            drv.interval = 'LEADER';
          } else {
            const lapDiff = leadDriver.lap - drv.lap;
            const progressDiff = leadDriver.progress - drv.progress + lapDiff;
            const gapSeconds = progressDiff * lapTimeSeconds;
            
            drv.gap = `+${gapSeconds.toFixed(3)}s`;

            // Interval to preceding car
            const precDriver = updated[index - 1];
            const precLapDiff = precDriver.lap - drv.lap;
            const precProgressDiff = precDriver.progress - drv.progress + precLapDiff;
            const intervalSeconds = precProgressDiff * lapTimeSeconds;
            
            drv.interval = `+${intervalSeconds.toFixed(3)}s`;
          }
        });

        // Trigger dynamic timeline incidents randomly during green flags
        if (raceState === 'green' && Math.random() < 0.03) {
          const rngDriver = updated[Math.floor(Math.random() * updated.length)];
          const eventRoll = Math.random();

          if (eventRoll < 0.3) {
            // Yellow flag event
            setRaceState('yellow');
            addTimelineEvent('flag-yellow', `Yellow Flag: Debris in Sector 2 near Turn 4. Speed limits enforced.`);
            showToast('Yellow Flag Deployed', 'warning');
            setTimeout(() => {
              setRaceState('green');
              addTimelineEvent('overtake', `Green Flag: Track clear in Sector 2. Racing resumed.`);
            }, 6000);
          } else if (eventRoll < 0.6) {
            // Safety car
            setRaceState('safety-car');
            addTimelineEvent('safety-car', `Safety Car Deployed: Incident involving backmarkers at Turn 3.`);
            showToast('Safety Car Deployed', 'warning');
            setTimeout(() => {
              setRaceState('green');
              addTimelineEvent('overtake', `Safety Car In: Racing resumes this lap.`);
            }, 10000);
          } else {
            // Pit stop simulation
            rngDriver.pitStops += 1;
            const prevCompound = rngDriver.tyreCompound;
            const nextCompound = prevCompound === 'S' ? 'M' : prevCompound === 'M' ? 'H' : 'S';
            rngDriver.tyreCompound = nextCompound;
            rngDriver.tyreAge = 0;
            addTimelineEvent('pit-stop', `Box Box: ${rngDriver.firstName} ${rngDriver.lastName} pits for ${nextCompound} tyres (2.2s)`);
          }
        }

        return updated;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulating, raceState, lapCount]);

  return (
    <F1Context.Provider value={{
      theme,
      toggleTheme,
      favorites,
      isFavoriteDriver,
      toggleFavoriteDriver,
      isFavoriteTeam,
      toggleFavoriteTeam,
      searchQuery,
      setSearchQuery,
      
      // Modal controllers
      activeModalDriverId,
      setActiveModalDriverId,
      activeModalTeamId,
      setActiveModalTeamId,

      // Live state
      liveDrivers,
      raceState,
      setRaceState,
      isSimulating,
      setIsSimulating,
      lapCount,
      maxLaps,
      timelineEvents,
      addTimelineEvent,
      resetSimulator,
      selectedLiveDriverId,
      setSelectedLiveDriverId,
      
      // Toast warnings
      toasts,
      showToast,
      dismissToast,
      
      // Static API data
      drivers,
      constructors,
      loading,
      refreshStandings,
      
      // Mobile sidebar states
      isMobileSidebarOpen,
      setIsMobileSidebarOpen
    }}>
      {children}
    </F1Context.Provider>
  );
};

export const useF1Store = () => {
  const context = useContext(F1Context);
  if (context === undefined) {
    throw new Error('useF1Store must be used within an F1Provider');
  }
  return context;
};
