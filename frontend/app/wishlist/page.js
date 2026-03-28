'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/helpers';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Spinner } from '@/components/LoadingSkeleton';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!isAuthenticated) { 
      router.push('/auth/login'); 
    }
  }, [isAuthenticated, router]);

  const handleMoveToCart = async (productId) => {
    await addItem(productId);
    await removeFromWishlist(productId);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container" style={{ maxWidth: 1100, padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>❤️ My Wishlist ({wishlistItems.length})</h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40} /></div>
      ) : wishlistItems.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 8, padding: 60 }}>
          <div className="empty-state-icon">💔</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you like to your wishlist</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {wishlistItems.map((item) => {
            const p = item.product;
            if (!p) return null; // Safe guard
            
            // Safe parsing for images matching ProductCard logic
            let imgArray = [];
            try {
              imgArray = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
            } catch (e) { imgArray = []; }
            const img = imgArray[0] || 'https://dummyimage.com/200x200/f0f0f0/666.png&text=No+Image';
            
            const discount = Math.round(((p.price - p.discountPrice) / p.price) * 100);

            return (
              <div key={item.id} style={{ background: 'white', borderRadius: 4, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                {/* Remove button */}
                <div style={{ position: 'relative' }}>
                  <Link href={`/products/${p.id}`}>
                    <div style={{ background: '#f9f9f9', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={img} alt={p.title} style={{ maxHeight: 180, objectFit: 'contain', padding: 8 }} loading="lazy" />
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(p.id)}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'white', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'var(--error)' }}
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/products/${p.id}`}>
                    <h3 style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <span className="rating-badge" style={{ fontSize: 11, padding: '2px 6px', background: '#388e3c', color: 'white', borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                      {p.rating} <FaStar size={9} style={{ marginLeft: 2 }} />
                    </span>
                    <span style={{ color: '#878787', fontSize: 11 }}>({(p.reviewCount || 0).toLocaleString()})</span>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" style={{ height: 18, marginLeft: 4 }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{formatPrice(p.discountPrice)}</span>
                    {p.price > p.discountPrice && (
                      <>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{formatPrice(p.price)}</span>
                        <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>{discount}% off</span>
                      </>
                    )}
                  </div>

                  {p.stock === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--error)', fontWeight: 600, marginTop: 'auto' }}>Out of Stock</p>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px 0', marginTop: 'auto' }}
                      onClick={() => handleMoveToCart(p.id)}
                    >
                      <FiShoppingCart style={{ marginRight: 6 }} /> Move to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
