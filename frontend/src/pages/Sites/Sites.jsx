import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiService } from '../../services/api'
import './Sites.css'

const getRiskLevel = (score) => {
  if (score >= 70) return { label: 'Yüksek Risk', color: '#ef4444', emoji: '🚨', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' }
  if (score >= 40) return { label: 'Orta Risk',  color: '#f59e0b', emoji: '⚠️', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' }
  return                 { label: 'Düşük Risk', color: '#22c55e', emoji: '✅', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)' }
}

const SiteCardPremium = ({ site, index, onClick }) => {
  const risk = getRiskLevel(site.risk_score || 0)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`
  }

  const handleMouseLeave = (e) => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = ''
  }

  const formatDate = (d) => {
    if (!d) return 'Henüz taranmadı'
    return new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d))
  }

  return (
    <div
      ref={cardRef}
      className="pcard"
      style={{ animationDelay: `${index * 0.07}s`, '--risk-color': risk.color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(site.domain)}
    >
      {/* Top glow bar */}
      <div className="pcard-top-bar" style={{ background: `linear-gradient(90deg, transparent, ${risk.color}, transparent)` }}></div>

      {/* Floating orb bg */}
      <div className="pcard-orb" style={{ background: risk.color }}></div>

      <div className="pcard-header">
        <div className="pcard-favicon">
          <img
            src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=40`}
            alt=""
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
          />
          <span className="pcard-favicon-fallback">🌐</span>
        </div>
        <div className="pcard-info">
          <h3 className="pcard-name">{site.site_name || site.domain}</h3>
          <p className="pcard-domain">{site.domain}</p>
        </div>
        <div className="pcard-risk-badge" style={{ background: risk.bg, borderColor: risk.border, color: risk.color }}>
          <span>{risk.emoji}</span>
          <span>{site.risk_score || 0}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="pcard-stats">
        <div className="pcard-stat">
          <span className="pcard-stat-num">{site.statistics?.total || 0}</span>
          <span className="pcard-stat-lbl">Şikayet</span>
        </div>
        <div className="pcard-divider"></div>
        <div className="pcard-stat">
          <span className="pcard-stat-num" style={{ color: '#ef4444' }}>{site.statistics?.negative || 0}</span>
          <span className="pcard-stat-lbl">Negatif</span>
        </div>
        <div className="pcard-divider"></div>
        <div className="pcard-stat">
          <span className="pcard-stat-num" style={{ color: '#22c55e' }}>{site.statistics?.positive || 0}</span>
          <span className="pcard-stat-lbl">Pozitif</span>
        </div>
        <div className="pcard-divider"></div>
        <div className="pcard-stat">
          <span className="pcard-stat-num">{site.statistics?.resolved || 0}</span>
          <span className="pcard-stat-lbl">Çözüldü</span>
        </div>
      </div>

      {/* Risk progress bar */}
      <div className="pcard-risk-bar-wrap">
        <span className="pcard-risk-label">Risk Skoru</span>
        <div className="pcard-risk-track">
          <div
            className="pcard-risk-fill"
            style={{ width: `${site.risk_score || 0}%`, background: risk.color }}
          ></div>
        </div>
        <span className="pcard-risk-pct" style={{ color: risk.color }}>{site.risk_score || 0}%</span>
      </div>

      {/* Footer */}
      <div className="pcard-footer">
        <span className="pcard-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {formatDate(site.last_scanned_date)}
        </span>
        <Link
          to={`/site/${encodeURIComponent(site.domain)}`}
          className="pcard-btn"
          onClick={e => e.stopPropagation()}
        >
          İncele
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}

const Sites = () => {
  const [sites, setSites]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all') // all | low | mid | high
  const [sortBy, setSortBy]           = useState('date') // date | risk | complaints
  const navigate = useNavigate()

  useEffect(() => { loadSites() }, [])

  const loadSites = async () => {
    try {
      setLoading(true); setError('')
      const res = await apiService.getAllSites()
      setSites(res.sites || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = sites
    .filter(s => {
      const q = search.toLowerCase()
      const match = !q || (s.domain || '').toLowerCase().includes(q) || (s.site_name || '').toLowerCase().includes(q)
      if (!match) return false
      const score = s.risk_score || 0
      if (filter === 'low')  return score < 40
      if (filter === 'mid')  return score >= 40 && score < 70
      if (filter === 'high') return score >= 70
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'risk')       return (b.risk_score || 0) - (a.risk_score || 0)
      if (sortBy === 'complaints') return ((b.statistics?.total) || 0) - ((a.statistics?.total) || 0)
      // date
      return new Date(b.last_scanned_date || 0) - new Date(a.last_scanned_date || 0)
    })

  const counts = {
    all:  sites.length,
    low:  sites.filter(s => (s.risk_score||0) < 40).length,
    mid:  sites.filter(s => (s.risk_score||0) >= 40 && (s.risk_score||0) < 70).length,
    high: sites.filter(s => (s.risk_score||0) >= 70).length,
  }

  return (
    <div className="sites-page">
      {/* ── Hero header ── */}
      <div className="sites-hero">
        <div className="sites-hero-bg">
          <div className="sites-hero-orb sites-hero-orb-1"></div>
          <div className="sites-hero-orb sites-hero-orb-2"></div>
        </div>
        <div className="container">
          <div className="sites-hero-inner">
            <div>
              <div className="sites-hero-badge">
                <span className="badge-dot"></span>
                <span>{sites.length} Site Analiz Edildi</span>
              </div>
              <h1 className="sites-hero-title">
                Analiz Edilmiş <span className="gradient-text">Siteler</span>
              </h1>
              <p className="sites-hero-desc">
                Güvenlik analizi yapılmış tüm siteleri filtreleyin, sıralayın ve inceleyin.
              </p>
            </div>
            <div className="sites-hero-actions">
              <button onClick={loadSites} className="sites-refresh-btn" disabled={loading}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spinning' : ''}>
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                <span>{loading ? 'Yükleniyor...' : 'Yenile'}</span>
              </button>
              <Link to="/" className="sites-analyze-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Yeni Analiz
              </Link>
            </div>
          </div>

          {/* Search + filters */}
          <div className="sites-controls">
            <div className="sites-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sites-search-icon">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="sites-search-input"
                placeholder="Site adı veya domain ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="sites-search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <div className="sites-filter-tabs">
              {[
                { key: 'all',  label: 'Tümü',      emoji: '📋' },
                { key: 'low',  label: 'Düşük Risk', emoji: '✅' },
                { key: 'mid',  label: 'Orta Risk',  emoji: '⚠️' },
                { key: 'high', label: 'Yüksek Risk',emoji: '🚨' },
              ].map(f => (
                <button
                  key={f.key}
                  className={`sites-filter-tab ${filter === f.key ? 'active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                  <span className="sites-filter-count">{counts[f.key]}</span>
                </button>
              ))}
            </div>

            <select className="sites-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date">En Yeni</option>
              <option value="risk">Risk ↓</option>
              <option value="complaints">Şikayet ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container">
        {error && (
          <div className="sites-error fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="sites-skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="sites-skeleton-card" style={{ animationDelay: `${i * 0.08}s` }}></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="sites-empty">
            <div className="sites-empty-icon">
              {search || filter !== 'all' ? '🔍' : '📦'}
            </div>
            <h3>{search || filter !== 'all' ? 'Sonuç bulunamadı' : 'Henüz analiz edilmiş site yok'}</h3>
            <p>
              {search || filter !== 'all'
                ? 'Arama kriterlerinizi değiştirmeyi deneyin.'
                : 'Ana sayfadan bir site URL\'si girerek analiz başlatın.'}
            </p>
            {!search && filter === 'all' && (
              <Link to="/" className="sites-analyze-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Analiz Başlat
              </Link>
            )}
            {(search || filter !== 'all') && (
              <button className="sites-refresh-btn" onClick={() => { setSearch(''); setFilter('all') }}>
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="sites-result-info">
              <span>{filtered.length} site gösteriliyor</span>
              {(search || filter !== 'all') && (
                <button onClick={() => { setSearch(''); setFilter('all') }} className="sites-clear-filters">
                  Filtreleri Temizle ✕
                </button>
              )}
            </div>
            <div className="sites-premium-grid">
              {filtered.map((site, i) => (
                <SiteCardPremium
                  key={site.domain}
                  site={site}
                  index={i}
                  onClick={(domain) => navigate(`/site/${encodeURIComponent(domain)}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sites
