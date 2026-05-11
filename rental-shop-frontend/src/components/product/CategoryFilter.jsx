const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <button
        onClick={() => onSelectCategory("")}
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          border: `1px solid ${selectedCategory === "" ? 'var(--color-accent)' : 'var(--border)'}`,
          backgroundColor: selectedCategory === "" ? 'var(--color-accent)' : 'transparent',
          color: selectedCategory === "" ? 'var(--color-surface)' : 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontWeight: 500,
          fontSize: '0.875rem'
        }}
      >
        Tất cả
      </button>
      
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${selectedCategory === category.id ? 'var(--color-accent)' : 'var(--border)'}`,
            backgroundColor: selectedCategory === category.id ? 'var(--color-accent)' : 'transparent',
            color: selectedCategory === category.id ? 'var(--color-surface)' : 'var(--color-text-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 500,
            fontSize: '0.875rem'
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
