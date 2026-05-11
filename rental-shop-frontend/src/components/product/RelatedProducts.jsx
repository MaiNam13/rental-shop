import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { getProducts } from '../../api/productApi';
import { useLanguage } from '../../context/LanguageContext';

const RelatedProducts = ({ currentProductId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const params = {
          limit: 4,
          category: categoryId
        };
        const data = await getProducts(params);
        if (data && data.products) {
          // Lọc bỏ sản phẩm hiện tại
          const filtered = data.products.filter(p => (p._id || p.id) !== currentProductId);
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    if (categoryId) {
      fetchRelated();
    }
  }, [currentProductId, categoryId]);

  if (products.length === 0) return null;

  return (
    <div className="similar-items-section">
      <h2 className="similar-items-title">{t('similarProducts')}</h2>
      <ProductGrid products={products} />
    </div>
  );
};

export default RelatedProducts;
