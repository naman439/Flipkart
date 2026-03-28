'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/services/api/products.api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { Spinner } from '@/components/LoadingSkeleton';
import { FiStar, FiShoppingCart, FiZap, FiMapPin, FiInfo, FiTag } from 'react-icons/fi';
import ImageCarousel from '@/components/ImageCarousel';
import StarRating from '@/components/StarRating';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        toast.error('Product not found');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spinner size={40} /></div>;
  }

  if (!product) return null;

  const images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || [product.image]);
  const specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : (product.specifications || {});

  const handleBuyNow = async () => {
    const success = await addItem(product.id, 1);
    if (success) router.push('/cart');
  };

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '16px 0' }}>
      <div className="main-container" style={{ background: 'white', display: 'grid', gridTemplateColumns: '43% 57%', minHeight: '100vh', boxShadow: '0 2px 4px 0 rgba(0,0,0,.08)' }}>
        
        {/* ── Left Column (Fixed/Sticky) ───────────────────────────── */}
        <div style={{ padding: '24px 12px 24px 24px', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ position: 'sticky', top: 120 }}>
            <div style={{ border: '1px solid #f0f0f0', marginBottom: 16 }}>
               <ImageCarousel images={images} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => addItem(product.id, 1)}
                style={{ flex: 1, background: '#ff9f00', color: 'white', border: 'none', height: 56, fontSize: 16, fontWeight: 600, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
              >
                <FiShoppingCart size={18} /> ADD TO CART
              </button>
              <button 
                onClick={handleBuyNow}
                style={{ flex: 1, background: '#fb641b', color: 'white', border: 'none', height: 56, fontSize: 16, fontWeight: 600, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
              >
                <FiZap size={18} /> BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column (Scrollable) ────────────────────────────── */}
        <div style={{ padding: '24px' }}>
          <nav style={{ fontSize: 12, color: '#878787', marginBottom: 12, display: 'flex', gap: 8 }}>
            <span>Home</span> <span>&gt;</span> <span>{product.category?.name}</span> <span>&gt;</span> <span style={{ color: '#212121' }}>{product.title}</span>
          </nav>

          <h1 style={{ fontSize: 18, fontWeight: 400, color: '#212121', marginBottom: 8, lineHeight: 1.4 }}>{product.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ background: '#388e3c', color: 'white', fontSize: 12, padding: '2px 6px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
              {product.rating} <FiStar size={10} fill="white" />
            </div>
            <span style={{ color: '#878787', fontSize: 14, fontWeight: 600 }}>{product.reviewCount?.toLocaleString()} Ratings & {Math.floor(product.reviewCount/10).toLocaleString()} Reviews</span>
          </div>

          <div style={{ color: '#388e3c', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Special Price</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 600 }}>₹{product.discountPrice?.toLocaleString()}</span>
            <span style={{ fontSize: 16, color: '#878787', textDecoration: 'line-through' }}>₹{product.price?.toLocaleString()}</span>
            <span style={{ fontSize: 16, color: '#388e3c', fontWeight: 600 }}>{product.discountPct}% off</span>
          </div>

          {/* Available Offers */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Available offers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                  <FiTag color="#388e3c" style={{ marginTop: 3 }} />
                  <span style={{ color: '#212121' }}>
                    <span style={{ fontWeight: 600 }}>Bank Offer</span> 10% instant discount on XYZ Bank Credit Cards, up to ₹1000 on orders of ₹5,000 and above <span style={{ color: '#2874f0', fontWeight: 600 }}>T&C</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PIN Code / Delivery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 24, padding: '20px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ color: '#878787', fontSize: 14, minWidth: 80 }}>Delivery</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '2px solid #2874f0', width: 'fit-content', paddingBottom: 4 }}>
                <FiMapPin color="#2874f0" />
                <input 
                  type="text" 
                  placeholder="Enter Delivery Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 14, width: 150 }}
                />
                <span style={{ color: '#2874f0', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Check</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600 }}>Delivery by 11 PM, Tomorrow | <span style={{ color: '#388e3c' }}>Free</span> <span style={{ textDecoration: 'line-through', color: '#878787' }}>₹40</span></div>
            </div>
          </div>

          {/* Highlights & Description */}
          <div style={{ display: 'flex', gap: 30, marginBottom: 24 }}>
            <div style={{ color: '#878787', fontSize: 14, minWidth: 80 }}>Highlights</div>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#212121', paddingLeft: 18 }}>
              <li>{product.description?.substring(0, 100)}...</li>
              <li>1 Year Manufacturer Warranty</li>
              <li>7 Days Replacement Policy</li>
            </ul>
          </div>

          {/* Specifications */}
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
            <div style={{ padding: '16px 24px', fontSize: 24, fontWeight: 400, borderBottom: '1px solid #f0f0f0' }}>Specifications</div>
            <div style={{ padding: '0 24px 24px' }}>
              {Object.entries(specs).length > 0 ? (() => {
                // Detect flat vs nested shape
                const isFlat = Object.values(specs).every(v => typeof v !== 'object' || v === null);
                if (isFlat) {
                  // Render as a single flat table (like Flipkart's General section)
                  return (
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#212121', padding: '20px 0 8px' }}>General</div>
                      {Object.entries(specs).map(([name, value]) => (
                        <div key={name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 8, padding: '12px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                          <div style={{ color: '#878787' }}>{name}</div>
                          <div style={{ color: '#212121', fontWeight: 500 }}>{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  );
                }
                // Nested: section → {name: value}
                return Object.entries(specs).map(([section, items]) => (
                  <div key={section} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#212121', padding: '20px 0 8px', borderBottom: '2px solid #f0f0f0' }}>{section}</div>
                    {typeof items === 'object' && items !== null ? Object.entries(items).map(([name, value]) => (
                      <div key={name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 8, padding: '12px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                        <div style={{ color: '#878787' }}>{name}</div>
                        <div style={{ color: '#212121', fontWeight: 500 }}>{String(value)}</div>
                      </div>
                    )) : (
                      <div style={{ padding: '12px 0', fontSize: 14, color: '#212121' }}>{String(items)}</div>
                    )}
                  </div>
                ));
              })() : (
                <div style={{ color: '#878787', fontStyle: 'italic', padding: '20px 0' }}>No detailed specifications available for this product.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
