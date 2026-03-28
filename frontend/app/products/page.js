'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategorySidebar from '@/components/CategorySidebar';
import Pagination from '@/components/Pagination';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton, Spinner } from '@/components/LoadingSkeleton';
import { getProducts, getCategories, getDynamicFilters } from '@/services/api/products.api';
import { useDebounce } from '@/hooks/useDebounce';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'discountPrice:asc', label: 'Price: Low to High' },
  { value: 'discountPrice:desc', label: 'Price: High to Low' },
  { value: 'rating:desc', label: 'Popularity' },
  { value: 'discountPct:desc', label: 'Best Discount' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [minRating, setMinRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [dynamicSpecs, setDynamicSpecs] = useState({});
  const [selectedSpecs, setSelectedSpecs] = useState({});

  const debouncedSearch = useDebounce(search, 500);

  // Load categories once
  useEffect(() => {
    getCategories().then((d) => setCategories(d.data || [])).catch(console.error);
  }, []);

  // Fetch dynamic filters whenever category or search changes
  useEffect(() => {
    getDynamicFilters({ category, search: debouncedSearch }).then((d) => {
      setBrands(d.data?.brands || []);
      setDynamicSpecs(d.data?.specifications || {});
    }).catch(console.error);
  }, [category, debouncedSearch]);

  // Sync URL params → state
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || '';
    
    let matchedCategory = c;
    
    // Auto-detect category if user explicitly searched for one (e.g. 'mobile' -> 'mobiles')
    if (s && !c && categories.length > 0) {
      const lowerSearch = s.toLowerCase().trim();
      const searchBase = lowerSearch.endsWith('s') ? lowerSearch.slice(0, -1) : lowerSearch;
      
      if (searchBase.length > 2) {
        const match = categories.find(cat => {
          const slug = cat.slug.toLowerCase();
          const name = cat.name.toLowerCase();
          return slug.includes(searchBase) || name.includes(searchBase);
        });
        
        if (match) {
          matchedCategory = match.slug;
        }
      }
    }

    setSearch(s);
    setCategory(matchedCategory);
    setPage(1);
  }, [searchParams, categories]);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sort.split(':');
        const params = {
          search: debouncedSearch,
          category,
          sort: sortField,
          order: sortOrder,
          page,
          limit: 20,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          minRating: minRating || undefined,
          brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
        };

        // Inject dynamic specification filters
        Object.entries(selectedSpecs).forEach(([key, values]) => {
          if (values.length > 0) {
            params[key] = values.join(',');
          }
        });

        const res = await getProducts(params);
        setProducts(res.data || []);
        setPagination(res.pagination || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, category, sort, page, minRating, minPrice, maxPrice, selectedBrands, selectedSpecs]);

  const handleCategoryChange = (slug) => {
    setCategory(slug === category ? '' : slug);
    setSelectedBrands([]);
    setSelectedSpecs({});
    setPage(1);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleClear = () => {
    setCategory('');
    setMinRating('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedSpecs({});
    router.push('/products');
  };

  return (
    <div>
      <div className="products-layout">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <CategorySidebar
          categories={categories}
          currentCategory={category}
          onCategoryChange={handleCategoryChange}
          minRating={minRating}
          onRatingChange={setMinRating}
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          dynamicSpecs={dynamicSpecs}
          selectedSpecs={selectedSpecs}
          onSpecToggle={(specKey, val) => {
            setSelectedSpecs(prev => {
              const current = prev[specKey] || [];
              return {
                ...prev,
                [specKey]: current.includes(val) ? current.filter(v => v !== val) : [...current, val]
              };
            });
            setPage(1);
          }}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); setPage(1); }}
          onClear={(category || minRating || debouncedSearch || minPrice || maxPrice || selectedBrands.length > 0 || Object.values(selectedSpecs).some(arr => arr.length > 0)) ? handleClear : null}
        />

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                {debouncedSearch ? `Results for "${debouncedSearch}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
              </span>
              {!loading && (
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>
                  ({pagination.total || 0} items)
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="sort-label">Sort by:</span>
              <select value={sort} onChange={handleSortChange} style={{ border: '1px solid var(--border-color)', borderRadius: 4, padding: '6px 12px', fontSize: 13 }}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar (in-page) */}
          <div style={{ background: 'white', padding: '12px 16px', marginBottom: 8, boxShadow: 'var(--shadow-sm)', borderRadius: 4 }}>
            <input
              type="text"
              placeholder="Search within results..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 4, fontSize: 14, outline: 'none' }}
            />
          </div>

          {/* Product Grid */}
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="empty-state" style={{ background: 'white' }}>
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="btn btn-primary" onClick={handleClear}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                totalPages={pagination.totalPages}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spinner size={40} />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
