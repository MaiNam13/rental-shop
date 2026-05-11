const SearchBar = ({ keyword, onSearch }) => {
  return (
    <div className="search-bar" style={{ marginBottom: '24px' }}>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm theo tên..."
        value={keyword}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          fontSize: '1rem',
          outline: 'none',
        }}
      />
    </div>
  );
};

export default SearchBar;
