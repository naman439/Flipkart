'use client';

import Link from 'next/link';
import { FiStar, FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  // Safe parsing for images
  let images = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
  } catch (e) {
    images = [];
  }
  const displayImage = images[0] || 'https://dummyimage.com/200x200/f0f0f0/666.png&text=No+Image';
  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <div className="product-card-2025" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#fff', 
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        style={{
          position: 'absolute', top: 12, right: 12, border: 'none', background: 'rgba(255,255,255,0.8)',
          borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 2, cursor: 'pointer'
        }}
      >
        <FiHeart fill={isInWishlist(product.id) ? '#ff4343' : 'none'} stroke={isInWishlist(product.id) ? '#ff4343' : '#999'} size={16} />
      </button>

      <Link href={product.stock === 0 ? '#' : `/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', opacity: product.stock === 0 ? 0.6 : 1, cursor: product.stock === 0 ? 'default' : 'pointer' }}>
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, position: 'relative' }}>
          <img 
            src={displayImage} 
            alt={product.title} 
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: product.stock === 0 ? 'grayscale(1)' : 'none' }} 
          />
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'rgba(255,255,255,0.9)', color: '#d32f2f', fontWeight: 700, padding: '4px 8px',
              borderRadius: 4, fontSize: 12, border: '1px solid #d32f2f', whiteSpace: 'nowrap', zIndex: 1
            }}>
              SOLD OUT
            </div>
          )}
          {product.isFeatured && (
             <div style={{
              position: 'absolute', top: 0, left: 0, background: 'var(--primary-color)', color: 'white',
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderBottomRightRadius: 8, zIndex: 1
            }}>
              FEATURED
            </div>
          )}
        </div>
        
        <div style={{ padding: '0 12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 13, fontWeight: 400, color: '#212121', marginBottom: 8, height: 36, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '18px' }}>
            {product.title}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ background: '#388e3c', color: 'white', fontSize: 11, fontWeight: 700, padding: '1px 5px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              {product.rating} <FiStar size={9} fill="white" />
            </div>
            <span style={{ color: '#878787', fontSize: 11 }}>({(product.reviewCount || 0).toLocaleString()})</span>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" style={{ height: 18, marginLeft: 4 }} />
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>₹{product.discountPrice?.toLocaleString()}</span>
              {product.price > product.discountPrice && (
                <>
                  <span style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>₹{product.price?.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: '#388e3c', fontWeight: 600 }}>{discount}% off</span>
                </>
              )}
            </div>
            <div style={{ fontSize: 12, color: product.stock === 0 ? '#d32f2f' : '#212121', marginTop: 4, fontWeight: product.stock === 0 ? 600 : 400 }}>
              {product.stock === 0 ? 'Temporarily Unavailable' : 'Free delivery'}
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .product-card-2025:hover {
          box-shadow: 0 3px 16px 0 rgba(0,0,0,.11);
        }
      `}</style>
    </div>
  );
}
