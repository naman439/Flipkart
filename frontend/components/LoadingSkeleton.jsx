/**
 * Loading Skeleton Component
 * Displays shimmer animation while content is loading
 */

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-text medium" />
      <div className="skeleton skeleton-text short" style={{ marginTop: 8 }} />
      <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: 8 }} />
    </div>
  );
}

// Product grid skeleton (12 cards)
export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Cart item skeleton
export function CartItemSkeleton() {
  return (
    <div className="cart-item" style={{ borderBottom: '1px solid #f0f0f0', padding: '24px 0' }}>
      <div className="skeleton" style={{ width: 112, height: 112, borderRadius: 4, flexShrink: 0 }} />
      <div style={{ flex: 1, marginLeft: 24 }}>
        <div className="skeleton skeleton-text medium" style={{ height: 20 }} />
        <div className="skeleton skeleton-text short" style={{ marginTop: 12, height: 16 }} />
        <div className="skeleton skeleton-text" style={{ width: '20%', marginTop: 20, height: 24 }} />
      </div>
    </div>
  );
}

// Full Cart skeleton
export function CartSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
       <div style={{ background: 'white', padding: '0 24px', borderRadius: 2 }}>
          {Array.from({ length: 3 }).map((_, i) => <CartItemSkeleton key={i} />)}
       </div>
       <div className="skeleton" style={{ height: 300, borderRadius: 2 }} />
    </div>
  );
}

// Inline spinner
export function Spinner({ size = 24, color = '#2874f0' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid #f3f3f3`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    />
  );
}
