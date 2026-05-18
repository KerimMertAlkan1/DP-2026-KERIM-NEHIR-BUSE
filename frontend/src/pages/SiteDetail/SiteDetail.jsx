import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import RiskBadge from '../../components/RiskBadge/RiskBadge'
import ComplaintList from '../../components/ComplaintList/ComplaintList'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { apiService } from '../../services/api'
import { getRiskLevel, SENTIMENT_COLORS, hexToRgba } from '../../utils/constants'
import './SiteDetail.css'

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / 20)
    const t = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(t) }
      else setDisplay(start)
    }, 40)
    return () => clearInterval(t)
  }, [value])
  return <span>{display}</span>
}

const SiteDetail = () => {
  const { domain } = useParams()
  const navigate = useNavigate()
  const [siteInfo, setSiteInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => { loadSiteInfo() }, [domain])

  const loadSiteInfo = async () => {
    try {
      setIsLoading(true); setError('')
      const info = await apiService.getSiteInfo(decodeURIComponent(domain))
      setSiteInfo(info)
    } catch (err) {
      setError(err.message || 'Site bilgileri yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReanalyze = async () => {
    if (!siteInfo) return
    setIsAnalyzing(true); setError('')
    try {
      const result = await apiService.analyzeSite(`https://${siteInfo.domain}`)
      if (result.error) { setError(result.error); setIsAnalyzing(false); return }
      await loadSiteInfo()
      setIsAnalyzing(false)
    } catch (err) {
      setError(err.message || 'Analiz sırasında bir hata oluştu')
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="site-detail">
        <div className="container">
          <div className="site-detail-loading">
            <LoadingSpinner size="large" text="Site bilgileri yükleniyor..." />
          </div>
        </div>
      </div>
    )
  }

  if (error && !siteInfo) {
    return (
      <div className="site-detail">
        <div className="container">
          <div className="site-detail-error">
            <div className="error-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2>Bir Hata Oluştu</h2>
            <p>{error}</p>
            <div className="error-actions">
              <Link to="/" className="button-primary">Ana Sayfaya Dön</Link>
              <button onClick={loadSiteInfo} className="button-secondary">Tekrar Dene</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!siteInfo) return null

  const riskLevel = getRiskLevel(siteInfo.risk_score || 0)
  const statistics = siteInfo.statistics || { total: 0, negative: 0, positive: 0, neutral: 0, resolved: 0, unresolved: 0 }

  const formatDate = (d) => {
    if (!d) return 'Henüz analiz edilmedi'
    return new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
  }

  const statCards = [
    { label: 'Toplam Şikayet', value: statistics.total, icon: '📋', color: '#a78bfa', bg: hexToRgba('#a78bfa', 0.1) },
    { label: 'Negatif',        value: statistics.negative, icon: '👎', color: SENTIMENT_COLORS.negative, bg: hexToRgba(SENTIMENT_COLORS.negative, 0.1) },
    { label: 'Pozitif',        value: statistics.positive, icon: '👍', color: SENTIMENT_COLORS.positive, bg: hexToRgba(SENTIMENT_COLORS.positive, 0.1) },
    { label: 'Nötr',           value: statistics.neutral,  icon: '➖', color: SENTIMENT_COLORS.neutral,  bg: hexToRgba(SENTIMENT_COLORS.neutral, 0.1)  },
    { label: 'Çözüldü',        value: statistics.resolved || 0,   icon: '✅', color: '#22c55e', bg: hexToRgba('#22c55e', 0.1) },
    { label: 'Çözülmedi',      value: statistics.unresolved || 0, icon: '❌', color: '#ef4444', bg: hexToRgba('#ef4444', 0.1) },
  ]

  return (
    <div className="site-detail">
      <div className="container">
        {/* Back */}
        <Link to="/sites" className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          <span>Sitelere Dön</span>
        </Link>

        {/* ── Hero header ── */}
        <div className="sd-hero">
          <div className="sd-hero-glow" style={{ background: riskLevel.color }}></div>

          <div className="sd-hero-left">
            <div className="sd-favicon">
              <img
                src={`https://www.google.com/s2/favicons?domain=${siteInfo.domain}&sz=48`}
                alt=""
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
              />
              <span style={{ display:'none', fontSize:32 }}>🌐</span>
            </div>
            <div>
              <h1 className="sd-title">{siteInfo.site_name || siteInfo.domain}</h1>
              <a
                href={`https://${siteInfo.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sd-domain-link"
              >
                {siteInfo.domain}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="sd-hero-right">
            <RiskBadge score={siteInfo.risk_score || 0} />
            <button onClick={handleReanalyze} disabled={isAnalyzing} className="reanalyze-button">
              {isAnalyzing ? (
                <><span className="button-spinner"></span><span>Analiz Ediliyor...</span></>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  <span>Yeniden Analiz Et</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Risk score big display ── */}
        <div className="sd-risk-section">
          <div className="sd-risk-card" style={{ '--risk-color': riskLevel.color }}>
            <div className="sd-risk-left">
              <div className="sd-risk-emoji">{riskLevel.emoji || '🔍'}</div>
              <div>
                <div className="sd-risk-label">Risk Seviyesi</div>
                <div className="sd-risk-level" style={{ color: riskLevel.color }}>{riskLevel.label}</div>
              </div>
            </div>
            <div className="sd-risk-score-wrap">
              <div className="sd-risk-score" style={{ color: riskLevel.color }}>
                <AnimatedNumber value={siteInfo.risk_score || 0} />
              </div>
              <div className="sd-risk-max">/100</div>
            </div>
            <div className="sd-risk-bar-wrap">
              <div className="sd-risk-bar-track">
                <div
                  className="sd-risk-bar-fill"
                  style={{ width: `${siteInfo.risk_score || 0}%`, background: `linear-gradient(90deg, ${riskLevel.color}aa, ${riskLevel.color})` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="sd-stats-grid">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="sd-stat-card"
              style={{
                '--stat-color': s.color,
                '--stat-bg': s.bg,
                animationDelay: `${i * 0.07}s`
              }}
            >
              <div className="sd-stat-icon">{s.icon}</div>
              <div className="sd-stat-body">
                <div className="sd-stat-value" style={{ color: s.color }}>
                  <AnimatedNumber value={s.value} />
                </div>
                <div className="sd-stat-label">{s.label}</div>
              </div>
              <div className="sd-stat-glow"></div>
            </div>
          ))}
        </div>

        {/* ── Meta dates ── */}
        <div className="sd-meta-section">
          <div className="sd-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <span className="sd-meta-label">Son Analiz</span>
              <span className="sd-meta-value">{formatDate(siteInfo.last_scanned_date)}</span>
            </div>
          </div>
          {siteInfo.created_date && (
            <div className="sd-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <span className="sd-meta-label">İlk Analiz</span>
                <span className="sd-meta-value">{formatDate(siteInfo.created_date)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Complaints ── */}
        <div className="sd-complaints-section">
          <ComplaintList complaints={siteInfo.complaints || []} isLoading={isAnalyzing} />
        </div>
      </div>
    </div>
  )
}

export default SiteDetail
