'use client';

import { FiFilter } from 'react-icons/fi';

export default function CategorySidebar({ 
  categories, 
  currentCategory, 
  onCategoryChange, 
  minRating, 
  onRatingChange, 
  brands = [], 
  selectedBrands = [], 
  onBrandToggle,
  dynamicSpecs = {},
  selectedSpecs = {},
  onSpecToggle,
  minPrice, 
  maxPrice, 
  onPriceChange, 
  onClear 
}) {
  const RATING_OPTIONS = [4, 3, 2, 1];
  const PRICE_OPTIONS = [1000, 2000, 5000, 10000, 20000, 30000, 50000];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p className="sidebar-title" style={{ margin: 0 }}>
          <FiFilter style={{ display: 'inline', marginRight: 6 }} />
          Filters
        </p>
        {onClear && (
          <button onClick={onClear} style={{ border: 'none', background: 'none', color: 'var(--fk-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="sidebar-section">
        <p className="sidebar-section-title">Price Range</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select 
            value={minPrice} 
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            style={{ width: '100%', padding: '4px', fontSize: 13, border: '1px solid #ddd' }}
          >
            <option value="">Min</option>
            {PRICE_OPTIONS.map(p => <option key={p} value={p}>₹{p}</option>)}
          </select>
          <span style={{ fontSize: 12, color: '#888' }}>to</span>
          <select 
            value={maxPrice} 
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            style={{ width: '100%', padding: '4px', fontSize: 13, border: '1px solid #ddd' }}
          >
            <option value="">Max</option>
            {PRICE_OPTIONS.map(p => <option key={p} value={p}>₹{p}+</option>)}
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <p className="sidebar-section-title">Category</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }} className="no-scrollbar">
          {categories.map((cat) => (
            <label key={cat.id} className="sidebar-option">
              <input
                type="checkbox"
                checked={currentCategory === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
              />
              <span style={{ fontSize: 13 }}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="sidebar-section">
          <p className="sidebar-section-title">Brand</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 250, overflowY: 'auto' }} className="no-scrollbar">
            {brands.map((b) => (
              <label key={b} className="sidebar-option">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => onBrandToggle(b)}
                />
                <span style={{ fontSize: 13 }}>{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Specifications */}
      {Object.entries(dynamicSpecs).map(([specName, specValues]) => {
        if (!specValues || specValues.length === 0) return null;
        return (
          <div key={specName} className="sidebar-section">
            <p className="sidebar-section-title">{specName}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }} className="no-scrollbar">
              {specValues.map((val) => {
                const isSelected = selectedSpecs[specName]?.includes(val);
                return (
                  <label key={val} className="sidebar-option">
                    <input
                      type="checkbox"
                      checked={!!isSelected}
                      onChange={() => onSpecToggle(specName, val)}
                    />
                    <span style={{ fontSize: 13 }}>{val}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Customer Rating */}
      <div className="sidebar-section">
        <p className="sidebar-section-title">Customer Rating</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="sidebar-option">
              <input
                type="radio"
                name="rating"
                checked={minRating === String(r)}
                onChange={() => onRatingChange(String(r))}
              />
              <span style={{ fontSize: 13 }}>{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
