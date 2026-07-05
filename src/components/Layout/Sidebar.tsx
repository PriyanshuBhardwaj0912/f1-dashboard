'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useF1Store } from '../../store/f1Store';
import { 
  Home, Trophy, Calendar, Clock, UserCheck, Users, 
  BarChart2, Newspaper, ChevronLeft, ChevronRight, Sparkles, ChevronDown
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [compareExpanded, setCompareExpanded] = useState(false);
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useF1Store();

  // Sync sub-menu expansion state and auto-close on path changes (mobile)
  useEffect(() => {
    if (pathname.startsWith('/compare')) {
      setCompareExpanded(true);
    }
    setIsMobileSidebarOpen(false);
  }, [pathname, setIsMobileSidebarOpen]);

  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Standings', path: '/standings', icon: Trophy },
    { name: 'Race Calendar', path: '/calendar', icon: Calendar },
    { name: 'Live Timing', path: '/live', icon: Clock },
    { 
      name: 'Compare', 
      path: '/compare', 
      icon: UserCheck,
      isParent: true,
      subItems: [
        { name: 'Drivers', path: '/compare?tab=drivers', param: 'drivers' },
        { name: 'Constructors', path: '/compare?tab=teams', param: 'teams' }
      ]
    },
    { name: 'Statistics', path: '/stats', icon: BarChart2 },
    { name: 'Latest News', path: '/news', icon: Newspaper },
  ];

  return (
    <>
      {isMobileSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 98,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
      <div 
        className="sidebar-brand" 
        style={{ 
          height: '70px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)',
          padding: collapsed ? '0.5rem 0' : '0 1.25rem'
        }}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: '100%',
              height: '100%',
              padding: 0
            }}
            aria-label="Expand sidebar"
          >
            <span className="logo-f1" style={{ fontSize: '1.05rem', lineHeight: 1 }}>F1</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        ) : (
          <>
            <div className="brand-logo" style={{ display: 'flex' }}>
              <span className="logo-f1">F1</span>
              <span className="logo-hub">HUB</span>
            </div>
            <button 
              onClick={() => setCollapsed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isParent) {
            const isSubActive = pathname.startsWith('/compare');
            return (
              <div key={item.name} style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      setCompareExpanded(true);
                    } else {
                      setCompareExpanded(!compareExpanded);
                    }
                  }}
                  className={`menu-link ${isSubActive ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: '0.8rem 1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Icon size={18} />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                  {!collapsed && (
                    <span style={{ transition: 'transform 0.2s ease', transform: compareExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown size={14} />
                    </span>
                  )}
                </button>

                {/* Collapsible Nested Sub-menu */}
                {compareExpanded && !collapsed && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginLeft: '1.75rem', 
                    borderLeft: '1px solid var(--border-color)', 
                    paddingLeft: '0.8rem',
                    marginTop: '0.2rem',
                    marginBottom: '0.2rem',
                    gap: '0.2rem'
                  }}>
                    {item.subItems.map((sub) => {
                      // Safe check client side query parameter matching
                      let isTabActive = false;
                      if (typeof window !== 'undefined') {
                        const searchStr = window.location.search || '';
                        if (sub.param === 'drivers' && (searchStr.includes('drivers') || searchStr === '')) {
                          isTabActive = true;
                        } else if (sub.param === 'teams' && searchStr.includes('teams')) {
                          isTabActive = true;
                        }
                      }

                      return (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className="menu-link"
                          style={{
                            fontSize: '0.85rem',
                            padding: '0.5rem 0.8rem',
                            color: isTabActive ? 'var(--f1-red)' : '#A0A0AA',
                            fontWeight: isTabActive ? '700' : '500',
                            backgroundColor: isTabActive ? 'rgba(225, 6, 0, 0.05)' : 'transparent',
                            borderRadius: '6px',
                            borderLeft: isTabActive ? '2px solid var(--f1-red)' : 'none',
                            paddingLeft: isTabActive ? '0.68rem' : '0.8rem'
                          }}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.path && !pathname.startsWith('/compare');
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`menu-link ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div 
        className="sidebar-footer" 
        style={{ 
          padding: '1rem', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {!collapsed ? (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '4px', color: 'var(--yellow-accent)', fontSize: '0.8rem' }}>
              <Sparkles size={14} />
              <span>Season: 2026</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>&copy; 2026 F1 Racing Hub</div>
          </div>
        ) : (
          <Sparkles size={14} style={{ color: 'var(--yellow-accent)' }} />
        )}
      </div>
    </aside>
    </>
  );
};
