'use client';

import { useState, useEffect } from 'react';
import { getHomeLayout } from '@/services/api/products.api';
import CategoryRow from '@/components/home/CategoryRow';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';

/**
 * Redesigned HomePage
 * Focuses on category-centric product carousels
 */
export default function HomePage() {
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const response = await getHomeLayout();
        if (response.success) {
          setLayout(response.data || []);
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err) {
        console.error('Home Page Error:', err);
        setError('Our servers are taking a moment to wake up. Please try again or refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#666', gap: 20 }}>
        <p style={{ fontSize: 18 }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 24px', background: 'var(--fk-blue)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
        >
          Retry Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', paddingBottom: 40, paddingTop: 16 }}>
      <div className="main-container">
        
        {/* ── Dynamic Category Rows ─────────────────────────────── */}
        {loading ? (
          // Show skeletons for the first 3 rows while loading
          [1, 2, 3].map(i => (
            <CategoryRow key={i} title="Loading..." loading={true} />
          ))
        ) : (
          layout.map(section => (
            section.products && section.products.length > 0 && (
              <CategoryRow 
                key={section.slug} 
                title={section.categoryName} 
                slug={section.slug}
                products={section.products}
                loading={false}
              />
            )
          ))
        )}

      </div>

      <style jsx global>{`
        .main-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 16px;
        }
        @media (max-width: 768px) {
          .main-container {
            padding: 0 8px;
          }
        }
      `}</style>
    </div>
  );
}
