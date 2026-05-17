import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import axiosClient from "../api/axiosClient";
import { Loader2, Search, Users, ShoppingBag, Star, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/CategoriesPage.css";

// Import image from assets
import heroImg from "../assets/fashion_hero.png";

export default function CategoriesPage() {
    const { t } = useLanguage();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(t('allCategoriesTab'));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get("/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
        window.scrollTo(0, 0);
    }, []);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '200px 0', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto', color: '#ccc' }} />
                </div>
                <Footer />
            </>
        );
    }

    const tabs = [
        { id: 'all', label: t('allCategoriesTab') },
        { id: 'popular', label: t('popularTab') },
        { id: 'latest', label: t('latestTab') },
        { id: 'luxury', label: t('luxuryCollectionTab') }
    ];

    return (
        <div className="categories-page">
            <Navbar />

            {/* Hero Section */}
            <header className="categories-hero">
                <img src={heroImg} alt="Fashion Categories" className="hero-image" />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>{t('exploreCategoriesTitle')}</h1>
                    <p>{t('exploreCategoriesSubtitle')}</p>
                    <Link to="/products" className="browse-btn">{t('viewCollection')}</Link>
                </div>
            </header>

            {/* Filter & Search Bar */}
            <div className="filter-container">
                <div className="search-box-wrapper">
                    <Search className="search-icon-pos" size={20} />
                    <input
                        type="text"
                        placeholder={t('searchCategoryPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`filter-tab ${activeTab === tab.label ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.label)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Browse Categories Grid */}
            <div className="browse-title-row">
                <h2>{t('rentalCategories')}</h2>
                <p>{t('showingCategories', { count: filteredCategories.length })}</p>
            </div>

            <div className="categories-main-grid">
                {filteredCategories.map((category, index) => (
                    <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="category-luxury-card"
                    >
                        <img
                            src={category.image ? (category.image.startsWith('http') ? category.image : `http://localhost:3000${category.image.startsWith('/') ? '' : '/uploads/'}${category.image}`) : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                            alt={category.name}
                        />
                        <div className="card-overlay">
                            <h3>{t(category.name)}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.9' }}>
                                <span>{t('exploreCategoryLink')}</span>
                                <ShoppingBag size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon-wrapper"><Users size={24} /></div>
                    <h4>10K+</h4>
                    <p>{t('happyCustomers')}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper"><ShoppingBag size={24} /></div>
                    <h4>50K+</h4>
                    <p>{t('successfulRentals')}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper"><Star size={24} /></div>
                    <h4>4.9</h4>
                    <p>{t('averageRating')}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper"><Award size={24} /></div>
                    <h4>500+</h4>
                    <p>{t('luxuryProductsCount')}</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
