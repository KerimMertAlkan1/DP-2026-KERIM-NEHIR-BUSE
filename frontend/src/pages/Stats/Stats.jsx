import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import { apiService } from '../../services/api'
import './Stats.css'

const AnimatedCount = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const duration = 1500
    const step = Math.max(1, Math.ceil(value / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return <span>{count.toLocaleString('tr-TR')}{suffix}</span>
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((pld, idx) => (
          <div key={idx} className="tooltip-item">
            <span className="tooltip-color" style={{ backgroundColor: pld.color }}></span>
            <span className="tooltip-name">{pld.name}:</span>
            <span className="tooltip-value">{pld.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const Stats = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getAllSites()
        const sites = res.sites || []
        
        // Calculate aggregations
        let totalC = 0, totalP = 0, totalN = 0, totalNeu = 0, totalRes = 0
        let totalRisk = 0
        
        sites.forEach(s => {
          totalRisk += s.risk_score || 0
          if (s.statistics) {
            totalC += s.statistics.total || 0
            totalP += s.statistics.positive || 0
            totalN += s.statistics.negative || 0
            totalNeu += s.statistics.neutral || 0
            totalRes += s.statistics.resolved || 0
          }
        })

        const avgRisk = sites.length ? Math.round(totalRisk / sites.length) : 0
        const resRate = totalC ? Math.round((totalRes / totalC) * 100) : 0

        setData({ 
          totalSites: sites.length, 
          totalC, totalP, totalN, totalNeu, totalRes, 
          avgRisk, resRate, sites 
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="stats-loading-screen">
        <div className="spinner-modern"></div>
        <p>Analitik Verileri Yükleniyor...</p>
      </div>
    )
  }

  if (!data || data.sites.length === 0) {
    return (
      <div className="stats-empty-screen">
        <div className="empty-icon">📊</div>
        <h2>Yeterli Veri Yok</h2>
        <p>Dashboard'un oluşturulabilmesi için sistemde analiz edilmiş siteler bulunmalıdır.</p>
        <Link to="/" className="btn-modern">Analiz Başlat</Link>
      </div>
    )
  }

  // --- Chart Data Preperation ---
  // 1. Sentiment Pie Data
  const sentimentData = [
    { name: 'Pozitif', value: data.totalP, color: '#22c55e' },
    { name: 'Negatif', value: data.totalN, color: '#ef4444' },
    { name: 'Nötr', value: data.totalNeu, color: '#f59e0b' },
  ].filter(d => d.value > 0)

  // 2. Top Sites Bar Data (Stacked Pos/Neg/Neu)
  const topSitesData = [...data.sites]
    .sort((a, b) => (b.statistics?.total || 0) - (a.statistics?.total || 0))
    .slice(0, 7)
    .map(s => ({
      name: s.site_name || s.domain.split('.')[0],
      Pozitif: s.statistics?.positive || 0,
      Negatif: s.statistics?.negative || 0,
      Nötr: s.statistics?.neutral || 0,
      total: s.statistics?.total || 0,
      risk: s.risk_score || 0
    }))

  // 3. Risk Distribution Data
  const riskDist = [
    { name: '0-20', count: 0 }, { name: '21-40', count: 0 }, 
    { name: '41-60', count: 0 }, { name: '61-80', count: 0 }, { name: '81-100', count: 0 }
  ]
  data.sites.forEach(s => {
    const r = s.risk_score || 0
    if (r <= 20) riskDist[0].count++
    else if (r <= 40) riskDist[1].count++
    else if (r <= 60) riskDist[2].count++
    else if (r <= 80) riskDist[3].count++
    else riskDist[4].count++
  })

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="dash-header-left">
          <h1>Sistem Analitiği</h1>
          <p>Yapay Zeka Destekli Platform Görünümleri</p>
        </div>
        <div className="dash-header-right">
          <div className="live-indicator">
            <span className="live-dot"></span> Canlı İzleme Aktif
          </div>
        </div>
      </header>

      {/* METRICS ROW */}
      <div className="metric-cards">
        <div className="metric-card">
          <div className="metric-icon">🌐</div>
          <div className="metric-info">
            <span className="metric-val"><AnimatedCount value={data.totalSites} /></span>
            <span className="metric-name">Analiz Edilen Site</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-info">
            <span className="metric-val"><AnimatedCount value={data.totalC} /></span>
            <span className="metric-name">Toplam Şikayet</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-info">
            <span className="metric-val" style={{color: data.avgRisk >= 70 ? '#ef4444' : data.avgRisk >= 40 ? '#f59e0b' : '#22c55e'}}>
              <AnimatedCount value={data.avgRisk} />
            </span>
            <span className="metric-name">Ortalama Risk Skoru</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <span className="metric-val"><AnimatedCount value={data.resRate} suffix="%" /></span>
            <span className="metric-name">Çözüm Oranı</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="charts-grid">
        {/* Top Sites Stacked Bar */}
        <div className="chart-panel wide-panel">
          <div className="panel-title">
            <h3>Sitelerin Duygu Analizi Dağılımı</h3>
            <p>En çok şikayet alan sitelerin analiz sonuçları</p>
          </div>
          <div className="panel-content">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSitesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Negatif" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Nötr" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Pozitif" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Donut */}
        <div className="chart-panel">
          <div className="panel-title">
            <h3>Genel Duygu Dağılımı</h3>
            <p>Platform genelindeki şikayet trendleri</p>
          </div>
          <div className="panel-content donut-content">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-info">
              <span>{data.totalC.toLocaleString()}</span>
              <label>Toplam</label>
            </div>
          </div>
        </div>

        {/* Risk Area Chart */}
        <div className="chart-panel">
          <div className="panel-title">
            <h3>Risk Skoru Dağılımı</h3>
            <p>Sitelerin risk puanlarına göre yoğunluğu</p>
          </div>
          <div className="panel-content">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskDist} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: '#94a3b8', fontSize: 11}} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Site Sayısı" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Table */}
        <div className="chart-panel wide-panel">
          <div className="panel-title">
            <h3>Risk Haritası</h3>
            <p>Sistemdeki en yüksek riskli sitelerin detaylı görünümü</p>
          </div>
          <div className="panel-content table-content">
            <div className="modern-table">
              <div className="tr th">
                <div className="td">Site</div>
                <div className="td">Şikayet</div>
                <div className="td">Çözüm Oranı</div>
                <div className="td">Risk Durumu</div>
                <div className="td">Aksiyon</div>
              </div>
              {[...data.sites]
                .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
                .slice(0, 5)
                .map((site, i) => {
                  const sResRate = site.statistics?.total ? Math.round((site.statistics.resolved / site.statistics.total) * 100) : 0
                  const rScore = site.risk_score || 0
                  const rColor = rScore >= 70 ? '#ef4444' : rScore >= 40 ? '#f59e0b' : '#22c55e'
                  
                  return (
                    <div className="tr" key={i}>
                      <div className="td site-name-col">
                        <img src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`} alt="" />
                        <span>{site.site_name || site.domain}</span>
                      </div>
                      <div className="td text-muted">{site.statistics?.total || 0} Adet</div>
                      <div className="td">
                        <div className="progress-mini">
                          <div className="progress-mini-fill" style={{width: `${sResRate}%`, background: '#22c55e'}}></div>
                        </div>
                        <span className="text-sm">%{sResRate}</span>
                      </div>
                      <div className="td">
                        <span className="badge-risk" style={{color: rColor, borderColor: `${rColor}50`, background: `${rColor}15`}}>
                          Skor: {rScore}
                        </span>
                      </div>
                      <div className="td">
                        <Link to={`/site/${encodeURIComponent(site.domain)}`} className="btn-icon">
                          Detay →
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Stats
