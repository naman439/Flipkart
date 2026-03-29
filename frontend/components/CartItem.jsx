'use client';

import Link from 'next/link';
import { FiMinus, FiPlus } from 'react-icons/fi';

export default function CartItem({ item, onUpdate, onRemove }) {
  let images = [];
  try {
    images = typeof item.product?.images === 'string' ? JSON.parse(item.product.images) : (item.product?.images || []);
  } catch(e) {}
  const displayImage = images[0] || 'https://dummyimage.com/100x100/f0f0f0/666.png&text=No+Image';

  const discount = Math.round(((item.product?.price - item.product?.discountPrice) / item.product?.price) * 100);

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', padding: '24px 0' }}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        {/* Left: Image & Quantity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 112, height: 112, flexShrink: 0 }}>
            <img 
              src={displayImage.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3050'}${displayImage}` : displayImage} 
              alt={item.product?.title} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              style={{ width: 28, height: 28, border: '1px solid #e0e0e0', background: 'white', borderRadius: '50%', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
            >
              <FiMinus size={14} />
            </button>
            <div style={{ width: 44, height: 28, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
              {item.quantity}
            </div>
            <button 
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              style={{ width: 28, height: 28, border: '1px solid #e0e0e0', background: 'white', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
            >
              <FiPlus size={14} />
            </button>
          </div>
        </div>
        
        {/* Right: Info */}
        <div style={{ flex: 1 }}>
          <Link href={`/products/${item.product?.id}`} style={{ textDecoration: 'none', color: '#212121' }}>
            <h3 style={{ fontSize: 16, fontWeight: 400, marginBottom: 6, lineHeight: 1.4 }}>{item.product?.title}</h3>
          </Link>
          <div style={{ fontSize: 12, color: '#878787', marginBottom: 10 }}>Seller: RetailNet</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#878787', textDecoration: 'line-through' }}>₹{item.product?.price?.toLocaleString()}</span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>₹{item.product?.discountPrice?.toLocaleString()}</span>
            <span style={{ fontSize: 14, color: '#388e3c', fontWeight: 600 }}>{discount}% Off</span>
            <span style={{ fontSize: 14, color: '#388e3c', fontWeight: 600 }}>2 offers applied</span>
          </div>

          <div style={{ fontSize: 14, color: '#212121' }}>
            Delivery by Sat, Mar 30 | <span style={{ color: '#388e3c' }}>Free</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: 32, paddingLeft: 0 }}>
        <button style={{ border: 'none', background: 'none', color: '#212121', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          SAVE FOR LATER
        </button>
        <button 
          onClick={() => onRemove(item.id)}
          style={{ border: 'none', background: 'none', color: '#212121', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
        >
          REMOVE
        </button>
      </div>
    </div>
  );
}
