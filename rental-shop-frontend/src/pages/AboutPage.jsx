import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useLanguage } from "../context/LanguageContext";
import { Target, Eye, Heart, Award, Truck, RotateCcw, Wallet, Search, ShoppingBag, Calendar, Package } from "lucide-react";
import "../styles/AboutPage.css";

// Import image from assets
import aboutHeroImg from "../assets/about_hero.png";

export default function AboutPage() {
    const { t } = useLanguage();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-page">
            <Navbar />
            
            {/* Hero Section */}
            <header className="about-hero">
                <img src={aboutHeroImg} alt="About Luxe Rental" className="hero-image" />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>{t('aboutUs')}</h1>
                    <p>{t('aboutHeroTitle')}</p>
                </div>
            </header>

            {/* Story Section */}
            <section className="about-story">
                <h2>{t('ourStory')}</h2>
                <div className="story-content">
                    <p>{t('storyP1')}</p>
                    <p>{t('storyP2')}</p>
                    <p>{t('storyP3')}</p>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon-wrapper">
                            <Target size={28} />
                        </div>
                        <h3>{t('mission')}</h3>
                        <p>{t('missionDesc')}</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon-wrapper">
                            <Eye size={28} />
                        </div>
                        <h3>{t('vision')}</h3>
                        <p>{t('visionDesc')}</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon-wrapper">
                            <Heart size={28} />
                        </div>
                        <h3>{t('coreValues')}</h3>
                        <p>{t('coreValuesDesc')}</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us">
                <div className="section-header">
                    <span className="section-label">{t('whyChooseUs')}</span>
                    <h2 className="section-title">{t('perfectService')}</h2>
                </div>
                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon-circle">
                            <Award size={24} />
                        </div>
                        <h3>{t('premiumQuality')}</h3>
                        <p>{t('premiumQualityDesc')}</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-circle">
                            <Truck size={24} />
                        </div>
                        <h3>{t('fastDelivery')}</h3>
                        <p>{t('fastDeliveryDesc')}</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-circle">
                            <RotateCcw size={24} />
                        </div>
                        <h3>{t('easyReturns')}</h3>
                        <p>{t('easyReturnsDesc')}</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-circle">
                            <Wallet size={24} />
                        </div>
                        <h3>{t('reasonablePrice')}</h3>
                        <p>{t('reasonablePriceDesc')}</p>
                    </div>
                </div>
            </section>

            {/* Rental Process Section */}
            <section className="rental-process">
                <div className="section-header">
                    <h2 className="section-title">{t('rentalProcess')}</h2>
                </div>
                <div className="process-grid">
                    <div className="process-step">
                        <div className="step-icon-black">
                            <Search size={24} />
                        </div>
                        <span className="step-number">{t('step1')}</span>
                        <h3>{t('step1Title')}</h3>
                        <p>{t('step1Desc')}</p>
                    </div>
                    <div className="process-step">
                        <div className="step-icon-black">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="step-number">{t('step2')}</span>
                        <h3>{t('step2Title')}</h3>
                        <p>{t('step2Desc')}</p>
                    </div>
                    <div className="process-step">
                        <div className="step-icon-black">
                            <Calendar size={24} />
                        </div>
                        <span className="step-number">{t('step3')}</span>
                        <h3>{t('step3Title')}</h3>
                        <p>{t('step3Desc')}</p>
                    </div>
                    <div className="process-step">
                        <div className="step-icon-black">
                            <Package size={24} />
                        </div>
                        <span className="step-number">{t('step4')}</span>
                        <h3>{t('step4Title')}</h3>
                        <p>{t('step4Desc')}</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
