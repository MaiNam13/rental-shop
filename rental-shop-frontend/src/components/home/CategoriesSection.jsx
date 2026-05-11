import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import categoryApi from '../../api/categoryApi'
import '../../styles/categories.css'

const CategoriesSection = () => {
    const [categories, setCategories] = useState([])
    const { t } = useLanguage()

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

    return (
        <section className="categories section" id="categories">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">{t('collection')}</span>
                    <h2 className="section-title">{t('exploreCategories')}</h2>
                </div>

                <div className="categories-grid">
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
            </div>
        </section>
    )
}

export default CategoriesSection
