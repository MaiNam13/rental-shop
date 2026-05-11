import { Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../../styles/footer.css'

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Footer = () => {
    const { t } = useLanguage()
    
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">LUXE RENT</div>
                        <p className="footer-description">
                            {t('footerDesc')}
                        </p>
                        <div className="footer-social">
                            <a href="#" className="footer-social-link" aria-label="Instagram">
                                <InstagramIcon />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Facebook">
                                <FacebookIcon />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Youtube">
                                <YoutubeIcon />
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>{t('categories')}</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">{t('Vest')}</a></li>
                            <li><a href="#" className="footer-link">{t('Sneaker')}</a></li>
                            <li><a href="#" className="footer-link">{t('Váy')}</a></li>
                            <li><a href="#" className="footer-link">{t('Streetwear')}</a></li>
                            <li><a href="#" className="footer-link">{t('Phụ kiện')}</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>{t('support')}</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">{t('howToRent')}</a></li>
                            <li><a href="#" className="footer-link">{t('returnPolicy')}</a></li>
                            <li><a href="#" className="footer-link">{t('sizeGuide')}</a></li>
                            <li><a href="#" className="footer-link">{t('faq')}</a></li>
                            <li><a href="#" className="footer-link">{t('contact')}</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>{t('contact')}</h4>
                        <div className="footer-contact-item">
                            <MapPin />
                            <span>{t('footerAddress')}</span>
                        </div>
                        <div className="footer-contact-item">
                            <Phone />
                            <span>0909 123 456</span>
                        </div>
                        <div className="footer-contact-item">
                            <Mail />
                            <span>hello@luxerent.vn</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        {t('copyright')}
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#" className="footer-bottom-link">{t('terms')}</a>
                        <a href="#" className="footer-bottom-link">{t('privacy')}</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
