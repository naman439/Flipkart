'use client';
import React from 'react';
import Link from 'next/link';

export default function ThemedProductRow({ title, products, bgColor, bgImage }) {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ 
      margin: '16px', 
      borderRadius: 8, 
      backgroundColor: bgColor || '#f0f0f0',
      backgroundImage: bgImage ? `url(${bgImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px 16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#212121', margin: 0 }}>{title}</h2>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--fk-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }}>
          &gt;
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }} className="no-scrollbar">
        {products.map(product => {
          let images = [];
          try {
            images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
          } catch(e) {
            images = [];
          }
          const imgUrl = images[0] || 'https://dummyimage.com/140x140/f0f0f0/666666.png&text=No+Image';

          return (
            <Link href={`/products/${product.id}`} key={product.id} style={{ 
              textDecoration: 'none', 
              background: 'white', 
              borderRadius: 6, 
              padding: 12, 
              minWidth: 160, 
              maxWidth: 160,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <img src={imgUrl} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://dummyimage.com/140x140/f0f0f0/666.png&text=Error'; }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: '#212121', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.title}
              </h3>
              <div style={{ fontSize: 14, color: '#388e3c', fontWeight: 600 }}>
                {product.category?.slug === 'fashion' ? 'Min. 50% Off' : `From ₹${product.discountPrice?.toLocaleString()}`}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
