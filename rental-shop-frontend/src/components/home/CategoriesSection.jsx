import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import categoryApi from '../../api/categoryApi'
import '../../styles/categories.css'

const CategoriesSection = () => {
    const [categories, setCategories] = useState([])
    const { t } = useLanguage()
    const gridRef = useRef(null)
    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAll()
                const data = response.data || response
                setCategories(data)
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error)
            }
        }

        fetchCategories()
    }, [])

    const checkScroll = () => {
        if (gridRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = gridRef.current
            setShowLeft(scrollLeft > 10)
            setShowRight(scrollLeft + clientWidth < scrollWidth - 10)
        }
    }

    useEffect(() => {
        const gridEl = gridRef.current
        if (gridEl) {
            gridEl.addEventListener('scroll', checkScroll)
            // Initial check
            checkScroll()
        }
        return () => {
            if (gridEl) {
                gridEl.removeEventListener('scroll', checkScroll)
            }
        }
    }, [categories])

    // Trigger checkScroll when resizing as well
    useEffect(() => {
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    const handleScroll = (direction) => {
        if (gridRef.current) {
            const { clientWidth } = gridRef.current
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
            gridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <section className="categories section" id="categories">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">{t('collection')}</span>
                    <h2 className="section-title">{t('exploreCategories')}</h2>
                </div>

                <div className="categories-slider-wrapper">
                    {showLeft && (
                        <button 
                            className="slider-nav-btn left" 
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll Left"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <div className="categories-grid" ref={gridRef}>
                        {categories.map((category) => {
                            let imageUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80';
                            if (category.image) {
                                if (category.image.startsWith('http')) {
                                    imageUrl = category.image;
                                } else if (category.image.startsWith('/')) {
                                    imageUrl = `http://localhost:3000${category.image}`;
                                } else {
                                    imageUrl = `http://localhost:3000/uploads/${category.image}`;
                                }
                            }

                            return (
                                <div key={category.id} className="category-card">
                                    <img
                                        src={imageUrl}
                                        alt={category.name}
                                        className="category-card-image"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80';
                                        }}
                                    />
                                    <div className="category-card-overlay">
                                        <div className="category-card-content">
                                            <span className="category-card-label">{category.label || t('collection')}</span>
                                            <h3 className="category-card-title">{t(category.name)}</h3>
                                            <Link to={`/products?category=${category.id}`} className="category-card-link">
                                                {t('viewMore')} <ArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {showRight && (
                        <button 
                            className="slider-nav-btn right" 
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll Right"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default CategoriesSection
