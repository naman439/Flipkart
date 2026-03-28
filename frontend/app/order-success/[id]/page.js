'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrderById } from '@/services/api/orders.api';
import { formatPrice } from '@/utils/helpers';
import { Spinner } from '@/components/LoadingSkeleton';

export default function OrderSuccessPage({ params }) {
  const { id } = React.use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((d) => setOrder(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spinner size={40} />
      </div>
    );
  }

  const statusColor = {
    PENDING: 'var(--warning)',
    CONFIRMED: 'var(--fk-blue)',
    SHIPPED: 'var(--fk-blue)',
    DELIVERED: 'var(--success)',
    CANCELLED: 'var(--error)',
  };

  return (
    <div className="order-success">
      {/* Success Card */}
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Thank you! Your order has been confirmed.
        </p>

        {/* Order ID */}
        <div style={{ background: 'var(--fk-blue-light)', borderRadius: 8, padding: '16px 24px', marginBottom: 24, display: 'inline-block' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Order ID</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--fk-blue)' }}>#{id}</p>
        </div>

        {order && (
          <>
            {/* Status & Delivery */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Status</p>
                <span style={{ fontWeight: 700, color: statusColor[order.status] }}>{order.status}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Payment</p>
                <span style={{ fontWeight: 700 }}>{order.paymentMethod}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Amount Paid</p>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatPrice(order.finalAmount)}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: '16px 20px', textAlign: 'left', marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📦 Delivery Address</h3>
              <p style={{ fontWeight: 600 }}>{order.shippingName}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {order.shippingAddress}, {order.shippingCity},<br />
                {order.shippingState} – {order.shippingZip}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📞 {order.shippingPhone}</p>
            </div>

            {/* Items */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden', textAlign: 'left', marginBottom: 24 }}>
              <div style={{ padding: '12px 16px', background: '#f9f9f9', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: 14 }}>
                Order Items ({order.items?.length})
              </div>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt={item.title} style={{ width: 48, height: 48, objectFit: 'contain', border: '1px solid var(--border-color)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                <span>Total</span>
                <span style={{ color: 'var(--success)' }}>{formatPrice(order.finalAmount)}</span>
              </div>
            </div>
          </>
        )}

        {/* Estimated delivery */}
        <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '12px 20px', marginBottom: 24, color: 'var(--success)', fontWeight: 600 }}>
          🚚 Estimated Delivery: 3–5 Business Days
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/orders" className="btn btn-primary">View All Orders</Link>
          <Link href="/products" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
