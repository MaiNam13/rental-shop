import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../../styles/hero.css'

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-label">{t('heroLabel')}</span>
          <h1 className="hero-title">
            {t('heroTitle').split(' ').map((word, i, arr) => 
                word === 'Cao' || word === 'Cấp' || word === 'Premium' ? <span key={i}>{word} </span> : word + ' '
            )}
          </h1>
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-primary" onClick={() => navigate('/products')}>
              {t('rentNow')}
            </button>
            <button className="hero-btn hero-btn-secondary" onClick={() => navigate('/products')}>
              {t('exploreProducts')}
            </button>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&q=80"
            alt="Fashion model wearing premium outfit"
            className="hero-image"
          />
          <div className="hero-image-overlay">
            <div>
              <span className="hero-overlay-text">{t('from')}</span>
              <span className="hero-overlay-value">199K/{t('perDay')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span className="hero-scroll-text">{t('scrollDown')}</span>
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  )
}

export default HeroSection
