'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';

/**
 * CategoryRow Component
 * Renders a horizontal scrolling row of products for a category
 */
export default function CategoryRow({ title, slug, products, loading }) {
  return (
    <section 
      style={{ 
        background: 'white', 
        marginBottom: 16, 
        boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
        borderRadius: 2
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '15px 20px', 
          borderBottom: '1px solid #f0f0f0' 
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#212121' }}>{title}</h2>
          <span style={{ fontSize: 12, color: '#878787', marginTop: 2 }}>Suggested For You</span>
        </div>
        <Link 
          href={`/products?category=${slug}`} 
          style={{ 
            background: 'var(--fk-blue)', 
            color: 'white', 
            padding: '10px 24px', 
            borderRadius: 2, 
            fontSize: 13, 
            fontWeight: 600, 
            textDecoration: 'none',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)'
          }}
        >
          VIEW ALL
        </Link>
      </div>
      
      <div 
        style={{ 
          display: 'flex', 
          gap: 12, 
          padding: '15px 10px', 
          overflowX: 'auto',
          scrollBehavior: 'smooth'
        }} 
        className="no-scrollbar"
      >
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          products.map(p => (
            <div 
              key={p.id} 
              style={{ 
                minWidth: 210, 
                width: 210, 
                padding: '0 5px',
                transition: 'transform 0.2s'
              }}
              className="hover-lift"
            >
              <ProductCard product={p} />
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
