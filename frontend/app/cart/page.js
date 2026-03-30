'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartSkeleton } from '@/components/LoadingSkeleton';
import { useRouter } from 'next/navigation';
import CartItem from '@/components/CartItem';
import PriceBreakdown from '@/components/PriceBreakdown';
import { FiMapPin } from 'react-icons/fi';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateItem, removeItem, loading } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <CartSkeleton />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '60px 40px', borderRadius: 4, boxShadow: 'var(--shadow-sm)' }}>
          <img 
            src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" 
            alt="Empty Cart" 
            style={{ width: 220, marginBottom: 24, margin: '0 auto' }} 
          />
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Your cart is empty!</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>Add items to it now.</p>
          <Link href="/" className="btn btn-primary" style={{ padding: '12px 64px', fontWeight: 600 }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Sub Header for Cart */}
      <div style={{ background: 'white', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
        <div className="main-container mobile-scroll-x" style={{ display: 'flex', gap: 40, padding: '12px 0' }}>
          <div style={{ fontWeight: 600, color: 'var(--fk-blue)', borderBottom: '3px solid var(--fk-blue)', paddingBottom: 8 }}>Flipkart (1)</div>
          <div style={{ fontWeight: 500, color: '#878787' }}>Grocery</div>
        </div>
      </div>

      <div className="main-container">
        <div className="page-layout-grid">
          
          {/* Left Column: Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Delivery bar removed as requested */}
            <div style={{ background: 'white', borderRadius: 2, boxShadow: 'var(--shadow-sm)', padding: '0 24px' }}>
              {cart.items.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdate={updateItem} 
                  onRemove={removeItem} 
                />
              ))}
              
              {/* Sticky Action Bar */}
              <div style={{ 
                padding: '16px 24px', 
                background: 'white', 
                display: 'flex', 
                justifyContent: 'flex-end', 
                borderTop: '1px solid #f0f0f0',
                position: 'sticky',
                bottom: 0,
                margin: '0 -24px',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
              }}>
                <button 
                  onClick={() => router.push('/checkout')}
                  style={{ 
                    background: '#fb641b', 
                    color: 'white', 
                    padding: '14px 60px', 
                    fontSize: 16, 
                    fontWeight: 600, 
                    borderRadius: 2,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Price Details */}
          <PriceBreakdown summary={cart.summary} />
        </div>
      </div>
    </div>
  );
}
