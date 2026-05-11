import ProductCard from './ProductCard';
import '../../styles/productCard.css';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        // Map data if needed from API format to what ProductCard expects
        // Assuming API returns: { _id, name, price, category_id, image }
        // ProductCard expects: { id, name, price, category, image, badge }
        // We'll just pass the mapped product directly
        
        let imageUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80';
        if (product.image) {
            if (product.image.startsWith('http')) {
                imageUrl = product.image;
            } else if (product.image.startsWith('/')) {
                imageUrl = `http://localhost:3000${product.image}`;
            } else {
                imageUrl = `http://localhost:3000/uploads/${product.image}`;
            }
        }

        const mappedProduct = {
          id: product._id || product.id,
          name: product.name,
          price: product.price_per_day ? `${product.price_per_day}K` : `${product.price}K`,
          category: product.category_id?.name || product.category || 'THỜI TRANG',
          image: imageUrl,
          badge: product.badge || null
        };

        return <ProductCard key={mappedProduct.id} product={mappedProduct} />;
      })}
    </div>
  );
};

export default ProductGrid;
