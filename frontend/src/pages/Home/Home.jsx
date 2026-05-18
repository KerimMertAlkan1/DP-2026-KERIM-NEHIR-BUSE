import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar'
import AnalysisProgress from '../../components/AnalysisProgress/AnalysisProgress'
import { apiService } from '../../services/api'
import './Home.css'

const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateY(-10px)`
    cardRef.current.style.boxShadow = `0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(34,197,94,0.2)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)'
    cardRef.current.style.boxShadow = 'none'
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

const Home = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzingUrl, setAnalyzingUrl] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(el => {
          if (el.isIntersecting) el.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal-anim').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSearch = async (url) => {
    setIsAnalyzing(true)
    setAnalyzingUrl(url)
    setError('')

    try {
      const result = await apiService.analyzeSite(url)
      if (result.error) {
        setError(result.error)
        setIsAnalyzing(false)
        setAnalyzingUrl('')
        return
      }
      const domain = result.domain || url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      navigate(`/site/${encodeURIComponent(domain)}`)
    } catch (err) {
      setError(err.message || 'Analiz sırasında bir hata oluştu')
      setIsAnalyzing(false)
      setAnalyzingUrl('')
    }
  }

  // Marquee Mock Data
  const recentThreats = [
    { domain: 'ucuz-iphone-tr.net', risk: 95 },
    { domain: 'trendyol-indirim.com', risk: 88 },
    { domain: 'hepsiburada-kampanya.org', risk: 92 },
    { domain: 'amazon.com.tr', risk: 40 },
    { domain: 'kargo-takip-ptt.net', risk: 98 },
    { domain: 'ikea.com.tr', risk: 39 },
    { domain: 'bedava-netflix-izle.cc', risk: 99 }
  ]

  return (
    <div className="home-ultra">
      <AnalysisProgress isVisible={isAnalyzing} url={analyzingUrl} />

      {/* Grid Background */}
      <div className="home-grid-bg"></div>

      {/* Live Threat Marquee */}
      <div className="threat-marquee">
        <div className="marquee-label">🔴 CANLI İZLEME:</div>
        <div className="marquee-content">
          <div className="marquee-track">
            {[...recentThreats, ...recentThreats, ...recentThreats].map((site, idx) => (
              <span key={idx} className="marquee-item">
                <span className="mq-domain">{site.domain}</span>
                <span className={`mq-risk ${site.risk >= 70 ? 'mq-high' : site.risk >= 40 ? 'mq-mid' : 'mq-low'}`}>
                  Skor: {site.risk}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-ultra">
        <div className="hero-glow-layer">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
        </div>

        <div className="container hero-ultra-content">
          <div className="reveal-anim" style={{ transitionDelay: '0.1s' }}>
            <div className="premium-badge">
              <span className="badge-ring"></span>
              <span>Türkiye'nin İlk Yapay Zeka Destekli Site Güvenlik Radarı</span>
            </div>
          </div>

          <h1 className="reveal-anim" style={{ transitionDelay: '0.2s' }}>
            E-Ticaretteki <br />
            <span className="gradient-text-ultra">Gizli Riskleri</span> Keşfedin
          </h1>

          <p className="hero-subtitle-ultra reveal-anim" style={{ transitionDelay: '0.3s' }}>
            Gerçek kullanıcı deneyimlerini yapay zeka ile işleyerek, 
            <br />
            alışveriş yapacağınız sitenin gerçek güvenilirlik haritasını çıkarıyoruz.
          </p>

          <div className="search-wrapper-ultra reveal-anim" style={{ transitionDelay: '0.4s' }}>
            <div className="search-pulse-ring"></div>
            <SearchBar onSearch={handleSearch} isLoading={isAnalyzing} />
            {error && (
              <div className="error-box-ultra fade-in">
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <div className="hero-metrics reveal-anim" style={{ transitionDelay: '0.5s' }}>
            <div className="hero-metric">
              <strong>150K+</strong>
              <span>Taranan Şikayet</span>
            </div>
            <div className="hero-metric-divider"></div>
            <div className="hero-metric">
              <strong>5sn</strong>
              <span>Ortalama Hız</span>
            </div>
            <div className="hero-metric-divider"></div>
            <div className="hero-metric">
              <strong>%99</strong>
              <span>Sentiment Doğruluğu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Radar Section (NEW) */}
      <section className="cyber-radar-section">
        <div className="container">
          <div className="radar-grid reveal-anim">
            <div className="radar-text-content">
              <h2>Ağınızı Tarıyoruz. <br/><span className="text-glow-green">Güvende Kalın.</span></h2>
              <p>Türkiye'nin en kapsamlı e-ticaret veri tabanı üzerinde anlık arama yapıyoruz. Botlar, sahte yorumlar ve oltalama (phishing) taktikleri artık yapay zekamızdan kaçamaz.</p>
              
              <ul className="radar-features">
                <li><span className="check-icon">✓</span> <strong>Dark Web & Şikayet Taraması:</strong> Şikayetvar, Trustpilot, Ekşi Sözlük entegrasyonu.</li>
                <li><span className="check-icon">✓</span> <strong>Doğal Dil İşleme (NLP):</strong> Yorumlardaki ince sitemleri bile algılar.</li>
                <li><span className="check-icon">✓</span> <strong>Öğrenen Algoritma:</strong> Her yeni şikayet, sistemin zekasına katkı sağlar.</li>
              </ul>
            </div>
            
            <div className="radar-visual-container">
              <div className="radar-ui">
                <div className="radar-circle rc-1"></div>
                <div className="radar-circle rc-2"></div>
                <div className="radar-circle rc-3"></div>
                <div className="radar-sweep"></div>
                
                {/* 20 Dynamic Radar Targets */}
                {[
                  { domain: 'amazon.com.tr', name: 'Amazon', left: 25, top: 30 },
                  { domain: 'hepsiburada.com', name: 'Hepsiburada', left: 65, top: 20 },
                  { domain: 'trendyol.com', name: 'Trendyol', left: 80, top: 50 },
                  { domain: 'n11.com', name: 'N11', left: 75, top: 75 },
                  { domain: 'yemeksepeti.com', name: 'Yemeksepeti', left: 45, top: 85 },
                  { domain: 'getir.com', name: 'Getir', left: 20, top: 70 },
                  { domain: 'aliexpress.com', name: 'AliExpress', left: 15, top: 45 },
                  { domain: 'teknosa.com', name: 'Teknosa', left: 40, top: 15 },
                  { domain: 'vatanbilgisayar.com', name: 'Vatan', left: 60, top: 35 },
                  { domain: 'ciceksepeti.com', name: 'Çiçeksepeti', left: 85, top: 35 },
                  { domain: 'migros.com.tr', name: 'Migros', left: 85, top: 65 },
                  { domain: 'dolap.com', name: 'Dolap', left: 60, top: 85 },
                  { domain: 'sahibinden.com', name: 'Sahibinden', left: 30, top: 80 },
                  { domain: 'turkcell.com.tr', name: 'Turkcell', left: 10, top: 60 },
                  { domain: 'letgo.com', name: 'Letgo', left: 10, top: 30 },
                  { domain: 'boyner.com.tr', name: 'Boyner', left: 35, top: 40 },
                  { domain: 'mediamarkt.com.tr', name: 'MediaMarkt', left: 55, top: 55 },
                  { domain: 'defacto.com.tr', name: 'DeFacto', left: 30, top: 55 },
                  { domain: 'lcwaikiki.com', name: 'LCW', left: 50, top: 25 },
                  { domain: 'pttavm.com', name: 'PttAVM', left: 70, top: 55 }
                ].map((site, idx) => {
                  // Calculate angle from center (50, 50) to determine radar sweep hit time
                  const x = site.left - 50
                  const y = site.top - 50
                  let angle = (Math.atan2(y, x) * 180) / Math.PI + 90
                  if (angle < 0) angle += 360
                  
                  // Radar completes 360 degrees in 4 seconds
                  const delay = (angle / 360) * 4
                  
                  return (
                    <div 
                      key={idx} 
                      className="radar-target" 
                      style={{ 
                        left: `${site.left}%`, 
                        top: `${site.top}%`
                      }}
                    >
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`} 
                        alt={site.name} 
                        style={{ animationDelay: `${delay}s` }}
                      />
                      <div className="target-pulse" style={{ animationDelay: `${delay}s` }}></div>
                      <span className="target-label" style={{ animationDelay: `${delay}s` }}>
                        {site.domain}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources / Integrations (NEW) */}
      <section className="integrations-section">
        <div className="container">
          <p className="integrations-title reveal-anim">VERİ BESLEME KAYNAKLARIMIZ</p>
          <div className="integrations-logos reveal-anim">
            <div className="integration-logo">Şikayetvar</div>
            <div className="integration-logo">Ekşi Sözlük</div>
            <div className="integration-logo">Google Reviews</div>
            <div className="integration-logo">Trustpilot</div>
            <div className="integration-logo">Twitter (X) API</div>
          </div>
        </div>
      </section>

      {/* Features - Premium Bento */}
      <section className="features-ultra">
        <div className="container">
          <div className="section-head-ultra reveal-anim">
            <h2>Neden Biz?</h2>
            <p>Standart güvenliğin ötesine geçen özelliklerimizi keşfedin.</p>
          </div>

          <div className="bento-ultra-grid">
            <TiltCard className="bento-ultra-card bento-span-2 reveal-anim">
              <div className="bento-bg-glow" style={{ background: 'rgba(34,197,94,0.1)' }}></div>
              <div className="bento-ultra-icon">🧠</div>
              <h3>Derinlemesine Yapay Zeka Analizi</h3>
              <p>NLP modellerimiz yorumları basitçe sınıflandırmaz, şikayetin bağlamını, markanın çözüm süresini ve memnuniyet oranlarını hesaplayarak kompleks bir risk skoru üretir.</p>
              <div className="bento-abstract">
                <div className="abstract-bar" style={{ height: '80%', background: '#22c55e', animationDelay: '0.1s' }}></div>
                <div className="abstract-bar" style={{ height: '40%', background: '#f59e0b', animationDelay: '0.3s' }}></div>
                <div className="abstract-bar" style={{ height: '60%', background: '#ef4444', animationDelay: '0.5s' }}></div>
                <div className="abstract-bar" style={{ height: '100%', background: '#10b981', animationDelay: '0.7s' }}></div>
              </div>
            </TiltCard>

            <TiltCard className="bento-ultra-card reveal-anim">
              <div className="bento-ultra-icon">⚡</div>
              <h3>Anlık Veri Akışı</h3>
              <p>Farklı şikayet platformlarındaki veriler anında toplanır ve işlenir.</p>
              <div className="bento-abstract-circle"></div>
            </TiltCard>

            <TiltCard className="bento-ultra-card reveal-anim">
              <div className="bento-ultra-icon">🛡️</div>
              <h3>Güvenilirlik Skoru</h3>
              <p>Risk algoritması, siteyi 0'dan 100'e kadar derecelendirir.</p>
              <div className="bento-abstract-score">
                <span>98</span>
              </div>
            </TiltCard>

            <TiltCard className="bento-ultra-card bento-span-2 reveal-anim">
              <div className="bento-bg-glow" style={{ background: 'rgba(59,130,246,0.1)' }}></div>
              <div className="bento-ultra-icon">📊</div>
              <h3>Görselleştirilmiş Detaylı Raporlar</h3>
              <p>Risk dağılımları, olumlu ve olumsuz trendler, çözüm başarı oranları anında karşınıza grafiksel ve analitik olarak sunulur.</p>
              <div className="bento-abstract-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="abstract-dot" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* How it works - Horizontal Flow */}
      <section className="workflow-ultra">
        <div className="container">
          <div className="section-head-ultra reveal-anim">
            <h2>Nasıl Çalışır?</h2>
            <p>Arkaplandaki karmaşık mühendislik, ön planda tek tıklama kadar kolay.</p>
          </div>

          <div className="workflow-cards">
            {[
              { num: '01', icon: '🔗', title: 'URL Analizi', desc: 'Analiz edilecek domain tespit edilir ve ön güvenlik kontrolünden geçer.' },
              { num: '02', icon: '🕷️', title: 'Veri Çıkarımı', desc: 'Güvenilir platformlardan binlerce yorum eş zamanlı olarak toplanır.' },
              { num: '03', icon: '🧠', title: 'Yapay Zeka İşleme', desc: 'NLP algoritmalarımız duygu analizlerini yaparak risk profili çıkarır.' },
              { num: '04', icon: '📈', title: 'Risk Raporu', desc: 'Kullanıcıya özel oluşturulmuş grafiksel rapor anında sunulur.' }
            ].map((step, i) => (
              <div key={i} className="workflow-card-ultra reveal-anim" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="wf-number">{step.num}</div>
                <div className="wf-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < 3 && <div className="wf-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Premium Hacker Vibe */}
      <section className="cta-premium-vibe reveal-anim">
        <div className="container">
          <div className="cta-vibe-box">
            {/* Animated Glowing Border */}
            <div className="cta-glowing-border"></div>
            
            {/* Abstract Data Rain Background */}
            <div className="cta-data-rain">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="data-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${2 + Math.random() * 3}s`, animationDelay: `${Math.random() * 2}s` }}></div>
              ))}
            </div>

            <div className="cta-vibe-content">
              <div className="cta-icon-wrapper">
                <span className="cta-icon-glow"></span>
                <span className="cta-shield">🛡️</span>
              </div>
              
              <h2 className="cta-hologram-text">
                Verilerin Işığında <br/>Güvende Kalın
              </h2>
              <p>Platformumuz bugüne kadar binlerce potansiyel mağduriyeti önledi. <br/>Siz de yapay zekanın gücüyle karanlık suları aydınlatın.</p>
              
              <div className="cta-vibe-actions">
                <Link to="/stats" className="btn-vibe-outline">
                  <span>Canlı İstatistikler</span>
                </Link>
                <Link to="/sites" className="btn-vibe-primary">
                  <span>Analiz Edilen Siteler</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
