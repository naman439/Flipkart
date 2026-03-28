'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrders } from '@/services/api/orders.api';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/helpers';
import { Spinner } from '@/components/LoadingSkeleton';

const STATUS_COLORS = {
  PENDING: { bg: '#fff3e0', color: '#e65100' },
  CONFIRMED: { bg: '#e3f2fd', color: '#1565c0' },
  SHIPPED: { bg: '#e8eaf6', color: '#283593' },
  DELIVERED: { bg: '#e8f5e9', color: '#2e7d32' },
  CANCELLED: { bg: '#ffebee', color: '#c62828' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchOrders();
  }, [isAuthenticated, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders({ page, limit: 8 });
      setOrders(res.data || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container" style={{ maxWidth: 900, padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📦 My Orders</h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40} /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 8, padding: 60 }}>
          <div className="empty-state-icon">📭</div>
          <h3>No orders yet</h3>
          <p>Once you place an order, it'll show up here.</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {orders.map((order) => {
            const statusStyle = STATUS_COLORS[order.status] || {};
            const firstImage = order.items?.[0]?.product?.images?.[0];
            return (
              <div key={order.id} style={{ background: 'white', borderRadius: 4, marginBottom: 12, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                {/* Order header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Order #{order.id}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ ...statusStyle, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {order.status}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{formatPrice(order.finalAmount)}</span>
                  </div>
                </div>

                {/* Order items preview */}
                <div style={{ padding: '14px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                  {firstImage && (
                    <img src={firstImage} alt="product" style={{ width: 64, height: 64, objectFit: 'contain', border: '1px solid var(--border-color)', padding: 4 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>
                      {order.items?.slice(0, 2).map(i => i.title).join(', ')}
                      {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ''}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {order.paymentMethod}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                      📍 {order.shippingCity}, {order.shippingState}
                    </p>
                  </div>
                  <Link href={`/order-success/${order.id}`} className="btn btn-outline" style={{ flexShrink: 0, fontSize: 13, padding: '8px 16px' }}>
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
