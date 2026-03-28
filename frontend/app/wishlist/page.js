'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getWishlist, removeFromWishlist } from '@/services/api/wishlist.api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/helpers';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Spinner } from '@/components/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    loadWishlist();
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      setWishlist(res.data || []);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((i) => i.productId !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleMoveToCart = async (productId) => {
    await addItem(productId);
    await handleRemove(productId);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container" style={{ maxWidth: 1100, padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>❤️ My Wishlist ({wishlist.length})</h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40} /></div>
      ) : wishlist.length === 0 ? (
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
          {wishlist.map((item) => {
            const p = item.product;
            const img = p.images?.[0] || 'https://dummyimage.com/200x200/f0f0f0/666.png&text=No+Image';
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
                    onClick={() => handleRemove(p.id)}
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
                    <span className="rating-badge" style={{ fontSize: 11, padding: '2px 6px' }}>
                      {p.rating} <FaStar size={9} />
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{formatPrice(p.discountPrice)}</span>
                    {p.price > p.discountPrice && (
                      <>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{formatPrice(p.price)}</span>
                        <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>{p.discountPct}% off</span>
                      </>
                    )}
                  </div>

                  {p.stock === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--error)', fontWeight: 600 }}>Out of Stock</p>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px 0', marginTop: 'auto' }}
                      onClick={() => handleMoveToCart(p.id)}
                    >
                      <FiShoppingCart /> Move to Cart
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
