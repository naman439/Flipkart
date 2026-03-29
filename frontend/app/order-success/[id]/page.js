'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/services/api/orders.api';
import { formatPrice } from '@/utils/helpers';
import { Spinner } from '@/components/LoadingSkeleton';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function OrderSuccessPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderById(id)
      .then(d => setOrder(d.data))
      .catch(err => setError(err?.response?.data?.message || 'Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Order not found</h2>
        <p style={{ color: '#878787', marginBottom: 24 }}>{error || 'This order does not exist or you don\'t have access.'}</p>
        <Link href="/orders" style={{ color: 'var(--fk-blue)', fontWeight: 600 }}>View All Orders →</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px' }}>

        {/* Success Banner */}
        <div style={{ background: 'white', borderRadius: 4, padding: '32px 24px', marginBottom: 16, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>
            ✅
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 8 }}>Order Confirmed!</h1>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 4 }}>Your order has been placed successfully.</p>
          <p style={{ color: '#878787', fontSize: 13 }}>
            Order ID: <strong style={{ color: 'var(--fk-blue)', fontSize: 14 }}>#{order.id.slice(0, 8).toUpperCase()}</strong>
          </p>
        </div>

        {/* Order Tracking */}
        <div style={{ background: 'white', borderRadius: 4, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Order Status</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Progress Line */}
            <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: '#e0e0e0', zIndex: 0 }}>
              <div style={{ height: '100%', background: '#388e3c', width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`, transition: 'width 0.5s ease' }} />
            </div>
            {STATUS_STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              return (
                <div key={step} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px',
                    background: done ? '#388e3c' : '#e0e0e0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? 'white' : '#878787', fontWeight: 700, fontSize: 14,
                    border: `2px solid ${done ? '#388e3c' : '#e0e0e0'}`,
                    transition: 'all 0.3s ease'
                  }}>
                    {done ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontSize: 12, color: done ? '#388e3c' : '#878787', fontWeight: done ? 600 : 400 }}>
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#555' }}>
            {order.status === 'PLACED' && '🕐 Your order is being processed. Expected delivery in 3–5 business days.'}
            {order.status === 'CONFIRMED' && '✅ Confirmed! Your order will be dispatched soon.'}
            {order.status === 'SHIPPED' && '🚚 Your order is on the way!'}
            {order.status === 'DELIVERED' && '🎉 Your order has been delivered!'}
            {order.status === 'CANCELLED' && '❌ This order was cancelled.'}
          </p>
        </div>

        {/* Delivery Address */}
        <div style={{ background: 'white', borderRadius: 4, padding: '20px 24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📍 Delivery Address</h3>
          <p style={{ fontSize: 14, color: '#212121', fontWeight: 600, marginBottom: 2 }}>{order.shippingName}</p>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
            {order.shippingAddress}, {order.shippingCity}, {order.shippingState} — {order.shippingZip}<br />
            📞 {order.shippingPhone}
          </p>
        </div>

        {/* Order Items */}
        <div style={{ background: 'white', borderRadius: 4, padding: '20px 24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Order Items</h3>
          {(order.items || []).map((item, idx) => {
            const img = item.product?.images?.[0] || item.product?.thumbnail;
            return (
              <div key={idx} style={{ display: 'flex', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: idx < order.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                {img && (
                  <img src={`http://localhost:3050${img}`}
                    onError={e => { e.target.style.display = 'none'; }}
                    style={{ width: 60, height: 60, objectFit: 'contain', flexShrink: 0, borderRadius: 4, border: '1px solid #f0f0f0' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    {item.title || item.product?.title || 'Product'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#878787' }}>Qty: {item.quantity}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      ₹{(Number(item.priceAtPurchase) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Summary */}
        <div style={{ background: 'white', borderRadius: 4, padding: '20px 24px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Price Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Discount</span>
                <span style={{ color: '#388e3c' }}>– ₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Platform Fee</span>
              <span>₹7</span>
            </div>
            <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
              <span>Total Paid</span>
              <span>₹{(Number(order.finalAmount) + 7).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ fontSize: 12, color: '#878787' }}>Payment: {order.paymentMethod}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/" style={{
            flex: 1, background: 'white', border: '1px solid var(--fk-blue)', color: 'var(--fk-blue)',
            padding: '14px', textAlign: 'center', borderRadius: 2, fontWeight: 700, textDecoration: 'none',
            fontSize: 14, minWidth: 160
          }}>
            CONTINUE SHOPPING
          </Link>
          <Link href="/orders" style={{
            flex: 1, background: 'var(--fk-blue)', color: 'white',
            padding: '14px', textAlign: 'center', borderRadius: 2, fontWeight: 700, textDecoration: 'none',
            fontSize: 14, minWidth: 160
          }}>
            VIEW MY ORDERS
          </Link>
        </div>
      </div>
    </div>
  );
}
