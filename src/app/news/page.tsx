'use client';

import React, { useEffect, useState } from 'react';
import { useF1Store } from '../../store/f1Store';
import { f1ApiService } from '../../services/f1Api';
import { NewsArticle } from '../../types/f1';
import { Newspaper, Clock, Tag, ExternalLink } from 'lucide-react';

export default function NewsPage() {
  const { showToast } = useF1Store();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await f1ApiService.getNews();
        setArticles(data);
      } catch (err) {
        showToast('Failed to load news feed', 'warning');
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [showToast]);

  const categories = ['All', 'Racing', 'Tech', 'Paddock', 'Transfer'];

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Motorsport Latest Feed</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>F1 paddock rumors, aerodynamic technology upgrades, and driver transfer updates</span>
      </div>

      {/* Category filters tags */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="badge"
              style={{
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                backgroundColor: isActive ? 'var(--f1-red)' : 'var(--bg-secondary)',
                color: isActive ? 'white' : 'var(--text-primary)',
                padding: '0.4rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* News grids list */}
      {loading ? (
        <div className="grid-2">
          <div style={{ height: '200px' }} className="skeleton"></div>
          <div style={{ height: '200px' }} className="skeleton"></div>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {filteredArticles.map((art) => (
            <article 
              key={art.id} 
              className="card highlight" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '1.2rem',
                borderTopColor: art.category === 'Racing' 
                  ? 'var(--f1-red)' 
                  : art.category === 'Tech' 
                    ? 'var(--purple-accent)' 
                    : 'var(--yellow-accent)'
              }}
            >
              <div>
                {/* Meta details tag & date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span 
                    className="badge" 
                    style={{ 
                      fontSize: '0.65rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Tag size={10} style={{ marginRight: '4px' }} /> {art.category}
                  </span>
                  
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {art.date}
                  </span>
                </div>

                {/* Title and summary */}
                <h3 style={{ fontSize: '1.15rem', lineHeight: '1.4', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {art.title}
                </h3>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {art.summary}
                </p>
              </div>

              {/* Source link footer details */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '0.8rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span>{art.source}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {art.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
