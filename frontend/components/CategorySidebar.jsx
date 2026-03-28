'use client';

import { useState } from 'react';
import { FiSearch, FiChevronLeft } from 'react-icons/fi';

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
  const [brandSearch, setBrandSearch] = useState('');
  
  const RATING_OPTIONS = [4, 3, 2, 1];
  const PRICE_OPTIONS = [1000, 2000, 5000, 10000, 20000, 30000, 50000];

  // Derive the active category object for Breadcrumb
  const activeCatObj = categories.find(c => c.slug === currentCategory);

  // Filter brands based on search
  const filteredBrands = Object.entries(brands)
    .sort((a, b) => b[1] - a[1]) // Sort by count desc
    .filter(([brandName]) => brandName.toLowerCase().includes(brandSearch.toLowerCase()));

  return (
    <aside className="sidebar" style={{ padding: 0, overflow: 'hidden' }}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <p style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: '#000' }}>
          Filters
        </p>
        {onClear && (
          <button onClick={onClear} style={{ border: 'none', background: 'none', color: '#2874f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}>
            CLEAR ALL
          </button>
        )}
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* ── Categories Breadcrumb ────────────────────────────────────── */}
        <div className="sidebar-section-accordion">
          <p className="sidebar-section-header" style={{ marginBottom: '8px' }}>CATEGORIES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', paddingLeft: '4px' }}>
            {/* "Home" Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiChevronLeft size={16} color="#878787" />
              <button onClick={() => onCategoryChange('')} className={`fk-breadcrumb-item ${currentCategory ? 'inactive' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>
                Home
              </button>
            </div>
            {/* If a category is selected, show it nested */}
            {currentCategory && (
               <div style={{ paddingLeft: '20px', fontSize: '14px', fontWeight: 600, color: '#212121' }}>
                 {activeCatObj ? activeCatObj.name : currentCategory}
               </div>
            )}
            {/* List all other categories if nothing is selected or as siblings */}
             <div style={{ paddingLeft: currentCategory ? '32px' : '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: currentCategory ? '4px' : '0' }}>
               {!currentCategory && categories.map((cat) => (
                 <button 
                   key={cat.id} 
                   onClick={() => onCategoryChange(cat.slug)}
                   style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '14px', color: '#212121', cursor: 'pointer' }}
                 >
                   {cat.name}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* ── Price Range Filter ───────────────────────────────────────── */}
        <div className="sidebar-section-accordion">
          <p className="sidebar-section-header">PRICE</p>
          <div className="sidebar-section-content">
            <div style={{ padding: '0 8px 16px 8px' }}>
              <input 
                type="range" 
                min="0" max="100000" 
                value={maxPrice || '100000'} 
                onChange={(e) => onPriceChange(minPrice, e.target.value)}
                style={{ width: '100%', accentColor: '#2874f0', cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <select 
                value={minPrice} 
                onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                style={{ width: '40%', padding: '4px', fontSize: '14px', color: '#212121', border: '1px solid #e0e0e0', outline: 'none', borderRadius: '2px', backgroundColor: '#fff' }}
              >
                <option value="">Min</option>
                {PRICE_OPTIONS.map(p => <option key={p} value={p}>₹{p}</option>)}
              </select>
              <span style={{ fontSize: '14px', color: '#878787' }}>to</span>
              <select 
                value={maxPrice} 
                onChange={(e) => onPriceChange(minPrice, e.target.value)}
                style={{ width: '40%', padding: '4px', fontSize: '14px', color: '#212121', border: '1px solid #e0e0e0', outline: 'none', borderRadius: '2px', backgroundColor: '#fff' }}
              >
                <option value="">Max</option>
                {PRICE_OPTIONS.map(p => <option key={p} value={p}>₹{p}+</option>)}
                <option value="100000">₹100000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Flipkart Assured Toggle ────────────────────────────────────── */}
        <div className="sidebar-section-accordion" style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
               src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
               alt="Flipkart Assured" 
               style={{ height: '21px' }} 
            />
          </div>
          <label style={{ display: 'flex', cursor: 'pointer' }}>
             <input type="checkbox" className="fk-checkbox" />
          </label>
        </div>

        {/* ── Brand Filter ─────────────────────────────────────────────── */}
        {Object.keys(brands).length > 0 && (
          <div className="sidebar-section-accordion">
            <p className="sidebar-section-header">BRAND</p>
            <div className="sidebar-section-content">
              {/* Search Brand Input */}
              <div style={{ position: 'relative', marginBottom: '12px', padding: '0 4px', background: '#f5f6f7', display: 'flex', alignItems: 'center', borderRadius: '2px' }}>
                <FiSearch style={{ color: '#878787', paddingLeft: '8px', fontSize: '24px' }} />
                <input 
                  type="text" 
                  className="fk-brand-search"
                  placeholder="Search Brand"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', padding: '10px 8px', outline: 'none', fontSize: '14px' }}
                />
              </div>

              {/* Brands Checkbox List with Custom Scrollbar */}
              <div className="fk-sidebar-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
                {filteredBrands.length > 0 ? filteredBrands.map(([brandName, count]) => (
                  <label key={brandName} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                    <input
                      type="checkbox"
                      className="fk-checkbox"
                      checked={selectedBrands.includes(brandName)}
                      onChange={() => onBrandToggle(brandName)}
                    />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={brandName}>
                      {brandName}
                    </span>
                  </label>
                )) : (
                  <div style={{ fontSize: '13px', color: '#878787', padding: '8px 0' }}>No brands found</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Customer Rating Filter ───────────────────────────────────── */}
        <div className="sidebar-section-accordion">
          <p className="sidebar-section-header">CUSTOMER RATINGS</p>
          <div className="sidebar-section-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
              {RATING_OPTIONS.map((r) => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                  <input
                    type="checkbox"
                    className="fk-checkbox"
                    checked={minRating === String(r)}
                    onChange={() => onRatingChange(minRating === String(r) ? '' : String(r))}
                  />
                  <span>{r}★ & above</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dynamic Specifications ────────────────────────────────────── */}
        {Object.entries(dynamicSpecs).map(([specName, specValues]) => {
          // Ignore explicit 'brand' and 'source' specs to prevent overlap with native filters
          if (specName.toLowerCase() === 'brand' || specName.toLowerCase() === 'source') {
             return null;
          }

          const sortedValues = Object.entries(specValues).sort((a, b) => b[1] - a[1]);
          if (sortedValues.length === 0) return null;
          
          return (
            <div key={specName} className="sidebar-section-accordion">
              <p className="sidebar-section-header">{specName.toUpperCase()}</p>
              <div className="sidebar-section-content fk-sidebar-scrollbar" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
                  {sortedValues.map(([val, count]) => {
                    const isSelected = selectedSpecs[specName]?.includes(val);
                    return (
                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                        <input
                          type="checkbox"
                          className="fk-checkbox"
                          checked={!!isSelected}
                          onChange={() => onSpecToggle(specName, val)}
                        />
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {val}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
