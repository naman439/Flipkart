'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import { getCategories, getProducts } from '@/services/api/products.api';
import Banner from '@/components/Banner';
import { FiChevronRight } from 'react-icons/fi';

const categoryIcons = {
  'mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80',
  'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=120&q=80',
  'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=120&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=120&q=80',
  'appliances': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&q=80',
  'toys': 'https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&w=120&q=80',
  'beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&q=80',
  'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=120&q=80',
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, elecRes, featRes] = await Promise.all([
          getCategories().catch(() => ({ data: [] })),
          getProducts({ category: 'electronics', limit: 6 }).catch(() => ({ data: [] })),
          getProducts({ isFeatured: 'true', limit: 12 }).catch(() => ({ data: [] })),
        ]);

        setCategories(catRes.data || []);
        setElectronics(elecRes.data || []);
        setFeatured(featRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', paddingBottom: 40, paddingTop: 16 }}>
      <div className="main-container">
        {/* ── Main Banner ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <Banner />
        </div>

        {/* ── Best of Electronics ───────────────────────────────────── */}
        <section style={{ background: 'white', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Best of Electronics</h2>
            <Link href="/products?category=electronics" style={{ background: 'var(--fk-blue)', color: 'white', padding: '6px 16px', borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              VIEW ALL
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: 15, overflowX: 'auto' }} className="no-scrollbar">
            {loading ? <ProductGridSkeleton count={6} /> : (
              electronics.map(p => (
                <div key={p.id} style={{ minWidth: 190, width: 190 }}>
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Featured Brands / Deals ───────────────────────────────── */}
        <section style={{ background: 'white', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Featured Deals</h2>
            <Link href="/products" style={{ background: 'var(--fk-blue)', color: 'white', padding: '6px 16px', borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              VIEW ALL
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: 15, overflowX: 'auto' }} className="no-scrollbar">
            {loading ? <ProductGridSkeleton count={6} /> : (
              featured.map(p => (
                <div key={p.id} style={{ minWidth: 190, width: 190 }}>
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
