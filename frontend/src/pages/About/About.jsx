import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

const TiltCard = ({ children, className, style }) => {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateY(-10px)`
    cardRef.current.style.boxShadow = `0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(34,197,94,0.2)`
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
      style={style}
    >
      {children}
    </div>
  )
}

const teamMembers = [
  {
    id: 'SYS_ARCHITECT',
    role: 'Sistem Mimarisi & Backend',
    icon: '⚙️',
    desc: 'Büyük veri işleme, asenkron API tasarımı ve yüksek performanslı sunucu altyapısını yöneten kapalı mühendislik birimi.',
    stats: { loads: '10M+', uptime: '99.9%' }
  },
  {
    id: 'AI_CORE_DEV',
    role: 'Veri Bilimi & Yapay Zeka',
    icon: '🧠',
    desc: 'Şikayet verisi analizi, derin öğrenme tabanlı sentiment modelleme ve risk skoru algoritmalarını eğiten otonom zeka takımı.',
    stats: { nodes: '1.2M', acc: '99.4%' }
  },
  {
    id: 'FRONT_UX_ENG',
    role: 'Arayüz & Kullanıcı Deneyimi',
    icon: '🔮',
    desc: 'Karmaşık güvenlik istihbaratını ve büyük veriyi, herkesin kolayca anlayabileceği premium akıcı arayüzlere dönüştüren takım.',
    stats: { fps: '60+', latency: '<10ms' }
  }
]

const About = () => {
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

  return (
    <div className="about-ultra">
      {/* Background Grid */}
      <div className="about-grid-bg"></div>

      {/* Hero Section */}
      <section className="about-hero-ultra">
        <div className="hero-glow-layer">
          <div className="hero-glow hero-glow-1"></div>
        </div>

        <div className="container about-hero-content">
          <div className="reveal-anim" style={{ transitionDelay: '0.1s' }}>
            <div className="premium-badge">
              <span className="badge-ring"></span>
              <span>DP-2026 Siber Güvenlik Projesi</span>
            </div>
          </div>

          <h1 className="reveal-anim" style={{ transitionDelay: '0.2s' }}>
            Güvenliğin Arkasındaki <br />
            <span className="gradient-text-ultra">Görünmez Güç</span>
          </h1>

          <p className="about-subtitle-ultra reveal-anim" style={{ transitionDelay: '0.3s' }}>
            Karanlık ağdaki riskleri analiz eden, milyonlarca yorumu saniyeler içinde işleyen ve interneti daha güvenli hale getiren otonom sistemin vizyonu.
          </p>
        </div>
      </section>

      {/* Philosophy/Mission Section */}
      <section className="philosophy-ultra">
        <div className="container">
          <div className="philosophy-grid">
            <TiltCard className="phil-card reveal-anim">
              <div className="phil-icon-glow">
                <span className="phil-icon">🎯</span>
              </div>
              <h3>Misyonumuz</h3>
              <p>E-ticaret ekosistemini dolandırıcılardan temizlemek için yapay zeka destekli, şeffaf ve anlık çalışan bir doğruluk makinesi inşa etmek.</p>
            </TiltCard>

            <TiltCard className="phil-card reveal-anim" style={{ transitionDelay: '0.2s' }}>
              <div className="phil-icon-glow">
                <span className="phil-icon">👁️</span>
              </div>
              <h3>Vizyonumuz</h3>
              <p>Türkiye'nin ve dünyanın en güvenilir siber istihbarat ağı olarak, her alışveriş öncesi bakılması gereken standart referans noktası olmak.</p>
            </TiltCard>

            <TiltCard className="phil-card reveal-anim" style={{ transitionDelay: '0.4s' }}>
              <div className="phil-icon-glow">
                <span className="phil-icon">💡</span>
              </div>
              <h3>Değerlerimiz</h3>
              <p>Makine gibi tarafsız, algoritma kadar kesin. Sadece verilere dayanan sonuçlar üreterek kullanıcıyı mutlak doğruyla buluşturmak.</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Team / Core Units Section */}
      <section className="core-units-ultra">
        <div className="container">
          <div className="section-head-ultra reveal-anim">
            <h2>Çekirdek Kadro</h2>
            <p>Sistemi ayakta tutan ve her saniye gelişmesini sağlayan gizli birimlerimiz.</p>
          </div>

          <div className="units-grid">
            {teamMembers.map((m, i) => (
              <TiltCard key={i} className="unit-card reveal-anim" style={{ transitionDelay: `${i * 0.2}s` }}>
                <div className="unit-bg-glow"></div>
                <div className="unit-header">
                  <div className="unit-badge">[{m.id}]</div>
                  <div className="unit-icon">{m.icon}</div>
                </div>
                
                <h3 className="unit-role">{m.role}</h3>
                <p className="unit-desc">{m.desc}</p>
                
                <div className="unit-stats">
                  <div className="unit-stat">
                    <span>{Object.values(m.stats)[0]}</span>
                    <label>{Object.keys(m.stats)[0].toUpperCase()}</label>
                  </div>
                  <div className="unit-stat-divider"></div>
                  <div className="unit-stat">
                    <span>{Object.values(m.stats)[1]}</span>
                    <label>{Object.keys(m.stats)[1].toUpperCase()}</label>
                  </div>
                </div>

                {/* Abstract Data Art for each card */}
                {i === 0 && (
                  <div className="unit-abstract-network">
                    <div className="net-node n1"></div><div className="net-line l1"></div>
                    <div className="net-node n2"></div><div className="net-line l2"></div>
                    <div className="net-node n3"></div>
                  </div>
                )}
                {i === 1 && (
                  <div className="unit-abstract-brain">
                    <div className="brain-pulse"></div>
                    <div className="brain-pulse bp-2"></div>
                  </div>
                )}
                {i === 2 && (
                  <div className="unit-abstract-ui">
                    <div className="ui-layer layer-1"></div>
                    <div className="ui-layer layer-2"></div>
                  </div>
                )}
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta-ultra reveal-anim">
        <div className="container">
          <div className="cta-box-ultra">
            <div className="cta-glowing-border"></div>
            <div className="cta-data-rain">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="data-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${2 + Math.random() * 3}s`, animationDelay: `${Math.random() * 2}s` }}></div>
              ))}
            </div>
            <div className="cta-content-ultra">
              <h2>Sistemi Test Edin</h2>
              <p>Mühendisliğimizin gücünü canlı veriler üzerinde deneyimleyin.</p>
              <Link to="/" className="btn-vibe-primary">
                <span>Radarı Çalıştır</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
