import React, { useState, useEffect } from 'react'
import './AnalysisProgress.css'

const STEPS = [
  {
    id: 1,
    icon: '🔍',
    label: 'Site Taranıyor',
    detail: 'Alan adı ve bağlantı bilgileri kontrol ediliyor...',
    duration: 1200,
  },
  {
    id: 2,
    icon: '📋',
    label: 'Şikayetler Toplanıyor',
    detail: 'Şikayetvar ve diğer kaynaklardan veriler çekiliyor...',
    duration: 2200,
  },
  {
    id: 3,
    icon: '🧠',
    label: 'Duygu Analizi',
    detail: 'Kullanıcı yorumları yapay zeka ile analiz ediliyor...',
    duration: 1800,
  },
  {
    id: 4,
    icon: '⚡',
    label: 'Risk Skoru Hesaplanıyor',
    detail: 'Toplanan veriler ağırlıklandırılarak skor belirleniyor...',
    duration: 1200,
  },
  {
    id: 5,
    icon: '📊',
    label: 'Rapor Hazırlanıyor',
    detail: 'Güvenlik raporu oluşturuluyor...',
    duration: 800,
  },
]

const AnalysisProgress = ({ url, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      setProgress(0)
      setStepProgress(0)
      return
    }

    let stepIndex = 0
    let totalElapsed = 0
    const totalDuration = STEPS.reduce((s, x) => s + x.duration, 0)

    const runStep = (idx) => {
      if (idx >= STEPS.length) return
      setCurrentStep(idx)
      setStepProgress(0)

      const dur = STEPS[idx].duration
      const startTime = Date.now()

      const tick = setInterval(() => {
        const elapsed = Date.now() - startTime
        const sp = Math.min((elapsed / dur) * 100, 100)
        setStepProgress(sp)

        const globalElapsed = totalElapsed + elapsed
        const gp = Math.min((globalElapsed / totalDuration) * 100, 95) // max 95 – wait for real finish
        setProgress(gp)

        if (elapsed >= dur) {
          clearInterval(tick)
          totalElapsed += dur
          stepIndex++
          runStep(stepIndex)
        }
      }, 30)
    }

    runStep(0)
  }, [isVisible])

  if (!isVisible) return null

  const displayUrl = url
    ? url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    : ''

  return (
    <div className="ap-overlay fade-in">
      {/* Scanning lines bg */}
      <div className="ap-scan-line"></div>

      {/* Header */}
      <div className="ap-header">
        <div className="ap-shield">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div className="ap-shield-ping"></div>
        </div>
        <div className="ap-header-text">
          <h3>Güvenlik Analizi Yapılıyor</h3>
          <p className="ap-domain">{displayUrl}</p>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="ap-main-bar-wrap">
        <div className="ap-main-bar-track">
          <div
            className="ap-main-bar-fill"
            style={{ width: `${progress}%` }}
          >
            <div className="ap-bar-shimmer"></div>
          </div>
        </div>
        <span className="ap-percent">{Math.round(progress)}%</span>
      </div>

      {/* Steps */}
      <div className="ap-steps">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep
          const isActive = idx === currentStep
          const isPending = idx > currentStep

          return (
            <div
              key={step.id}
              className={`ap-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}
            >
              {/* connector line */}
              {idx < STEPS.length - 1 && (
                <div className={`ap-connector ${isDone ? 'done' : ''}`}></div>
              )}

              <div className="ap-step-icon-wrap">
                {isDone ? (
                  <span className="ap-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                ) : isActive ? (
                  <span className="ap-step-emoji spinning-slow">{step.icon}</span>
                ) : (
                  <span className="ap-step-emoji muted">{step.icon}</span>
                )}
              </div>

              <div className="ap-step-body">
                <div className="ap-step-label">{step.label}</div>
                {isActive && (
                  <div className="ap-step-detail fade-in">{step.detail}</div>
                )}
                {isActive && (
                  <div className="ap-step-mini-bar">
                    <div
                      className="ap-step-mini-fill"
                      style={{ width: `${stepProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Particles */}
      <div className="ap-particles" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="ap-particle" style={{ '--i': i }}></div>
        ))}
      </div>
    </div>
  )
}

export default AnalysisProgress
