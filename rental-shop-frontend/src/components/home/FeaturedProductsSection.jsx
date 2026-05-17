import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import ProductCard from '../product/ProductCard'
import { getProducts } from '../../api/productApi'
import '../../styles/productCard.css'

const FeaturedProductsSection = () => {
  const [products, setProducts] = useState([])
  const { t } = useLanguage()
  const gridRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

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
            // Chỉ những sản phẩm mới hoặc được nhiều người thuê mới có nhãn thích hợp
            if (index === 0 || index === 4 || index === 8) {
              badge = 'Hot'; // Được nhiều người thuê
            } else if (index === 1 || index === 5 || index === 9) {
              badge = t('new'); // Sản phẩm mới
            }

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
              status: p.status,
              stock: p.stock
            }
          })
          
          // Hiển thị đầy đủ sản phẩm để người dùng có thể lướt xem tiếp
          setProducts(mappedProducts)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
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
      checkScroll()
    }
    return () => {
      if (gridEl) {
        gridEl.removeEventListener('scroll', checkScroll)
      }
    }
  }, [products])

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
    <section className="products section" id="products">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('featured')}</span>
          <h2 className="section-title">{t('popularProducts')}</h2>
        </div>
        
        <div className="products-slider-wrapper">
          {showLeft && (
            <button 
              className="slider-nav-btn left" 
              onClick={() => handleScroll('left')}
              aria-label="Scroll Left"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="products-grid" ref={gridRef}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
