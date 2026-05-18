import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🛡️ GuvenliAlışveriş</h3>
            <p>Güvenli alışveriş için site güvenilirliğini analiz ediyor, risk skorları ve şikayet verileriyle bilinçli kararlar almanıza yardımcı oluyoruz.</p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Sayfalar</h4>
            <ul>
              <li><Link to="/">Ana Sayfa</Link></li>
              <li><Link to="/sites">Analiz Edilmiş Siteler</Link></li>
              <li><Link to="/about">Hakkında</Link></li>
              <li><Link to="/stats">İstatistikler</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Kaynaklar</h4>
            <ul>
              <li><a href="https://www.sikayetvar.com" target="_blank" rel="noopener noreferrer">Şikayetvar</a></li>
              <li><a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer">Trustpilot</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Yasal</h4>
            <ul>
              <li><a href="#">Gizlilik Politikası</a></li>
              <li><a href="#">Kullanım Şartları</a></li>
              <li><a href="#">Çerez Politikası</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GuvenliAlışveriş. Tüm hakları saklıdır.</p>
          <div className="footer-bottom-links">
            <a href="#">Gizlilik</a>
            <a href="#">Şartlar</a>
            <a href="#">İletişim</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
