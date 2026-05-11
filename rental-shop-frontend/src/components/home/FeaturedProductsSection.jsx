import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import ProductCard from '../product/ProductCard'
import { getProducts } from '../../api/productApi'
import '../../styles/productCard.css'

const FeaturedProductsSection = () => {
  const [products, setProducts] = useState([])
  const { t } = useLanguage()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        if (data && data.products) {
          const mappedProducts = data.products.map((p, index) => {
            // Xử lý URL ảnh giống CategoriesSection
            let imageUrl = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop&q=80';
            if (p.image) {
                if (p.image.startsWith('http')) {
                    imageUrl = p.image;
                } else if (p.image.startsWith('/')) {
                    imageUrl = `http://localhost:3000${p.image}`;
                } else {
                    imageUrl = `http://localhost:3000/uploads/${p.image}`;
                }
            }

            // Tạo badge giả định cho sinh động (tuỳ chọn)
            let badge = null;
            if (index === 0) badge = 'Hot';
            else if (index === 1) badge = t('new');
            else if (index === 5) badge = t('trending');

            // Định dạng giá (ví dụ 299000 -> 299K)
            const priceFormatted = p.price_per_day >= 1000 
                ? `${Math.floor(p.price_per_day / 1000)}K` 
                : `${p.price_per_day}đ`;

            return {
              id: p.id,
              name: t(p.name),
              category: p.Category ? t(p.Category.name) : t('products'),
              price: priceFormatted,
              image: imageUrl,
              badge: badge,
              stock: p.stock
            }
          })
          setProducts(mappedProducts)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="products section" id="products">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('featured')}</span>
          <h2 className="section-title">{t('popularProducts')}</h2>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="products-view-all">
          <Link to="/products" className="products-view-all-link">
            {t('viewAllProducts')} <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSection
