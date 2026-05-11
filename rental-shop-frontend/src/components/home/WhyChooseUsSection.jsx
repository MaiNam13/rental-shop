import { Award, Truck, RotateCcw, Wallet } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../../styles/why-choose.css'

const WhyChooseUsSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      id: 1,
      icon: Award,
      title: t('premiumQuality'),
      description: t('premiumQualityDesc')
    },
    {
      id: 2,
      icon: Truck,
      title: t('fastDelivery'),
      description: t('fastDeliveryDesc')
    },
    {
      id: 3,
      icon: RotateCcw,
      title: t('easyReturns'),
      description: t('easyReturnsDesc')
    },
    {
      id: 4,
      icon: Wallet,
      title: t('reasonablePrice'),
      description: t('reasonablePriceDesc')
    }
  ];

  return (
    <section className="why-choose section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('whyChooseUs')}</span>
          <h2 className="section-title">{t('perfectService')}</h2>
        </div>

        <div className="why-choose-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="why-choose-card">
                <div className="why-choose-icon">
                  <Icon />
                </div>
                <h3 className="why-choose-title">{feature.title}</h3>
                <p className="why-choose-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection
