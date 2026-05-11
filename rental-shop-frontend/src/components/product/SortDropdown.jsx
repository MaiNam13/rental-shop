const SortDropdown = ({ sortOption, onSortChange }) => {
  return (
    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <label htmlFor="sort-select" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        Sắp xếp theo:
      </label>
      <select
        id="sort-select"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          fontSize: '0.875rem',
          outline: 'none',
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer'
        }}
      >
        <option value="Mới nhất">Mới nhất</option>
        <option value="Giá thấp đến cao">Giá thấp đến cao</option>
        <option value="Giá cao đến thấp">Giá cao đến thấp</option>
      </select>
    </div>
  );
};

export default SortDropdown;
