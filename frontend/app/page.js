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
      try {
        const response = await getHomeLayout();
        if (response.success) {
          setLayout(response.data || []);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Home Page Error:', err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#666' }}>
        <p>{error}</p>
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
