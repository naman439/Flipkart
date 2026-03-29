'use client';
import React from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Real product photography via Unsplash — always loads, no hotlink blocks
// ---------------------------------------------------------------------------
const subCategoryData = {
  'mobiles': [
    { name: 'Latest Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop' },
    { name: 'POCO Series',    img: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=300&q=80&fit=crop' },
    { name: 'Realme',         img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300&q=80&fit=crop' },
    { name: 'Samsung',        img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80&fit=crop' },
  ],
  'electronics': [
    { name: 'Laptops',      img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80&fit=crop' },
    { name: 'Smartwatches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&fit=crop' },
    { name: 'Headphones',   img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80&fit=crop' },
    { name: 'Tablets',      img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80&fit=crop' },
    { name: 'Cameras',      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80&fit=crop' },
  ],
  'appliances': [
    { name: 'Air Conditioners', img: 'https://images.unsplash.com/photo-1617878227870-3d9d5c9d81a1?w=200&q=80&fit=crop' },
    { name: 'Washing Machines', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&q=80&fit=crop' },
    { name: 'Televisions',      img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200&q=80&fit=crop' },
    { name: 'Refrigerators',    img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&q=80&fit=crop' },
  ],
  'fashion': [
    { name: 'Mens Wear',   img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80&fit=crop' },
    { name: 'Footwear',    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80&fit=crop' },
    { name: 'Watches',     img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&fit=crop' },
    { name: 'Womens Wear', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80&fit=crop' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=80&fit=crop' },
  ],
  'home-kitchen': [
    { name: 'Home Decor',  img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80&fit=crop' },
    { name: 'Kitchenware', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80&fit=crop' },
    { name: 'Furnishings', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80&fit=crop' },
  ],
  'beauty': [
    { name: 'Skincare',    img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&q=80&fit=crop' },
    { name: 'Makeup',      img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80&fit=crop' },
    { name: 'Fragrances',  img: 'https://images.unsplash.com/photo-1588776814546-1ffbb3fef21b?w=200&q=80&fit=crop' },
  ],
  'toys': [
    { name: 'Learning Toys', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80&fit=crop' },
    { name: 'Baby Care',     img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&q=80&fit=crop' },
  ],
  'groceries': [
    { name: 'Staples', img: 'https://images.unsplash.com/photo-1543168256-418811576931?w=200&q=80&fit=crop' },
    { name: 'Snacks',  img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&q=80&fit=crop' },
  ],
  'books': [
    { name: 'Academic',    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&q=80&fit=crop' },
    { name: 'Bestsellers', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80&fit=crop' },
  ],
  'sports-fitness': [
    { name: 'Badminton', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&q=80&fit=crop' },
    { name: 'Cricket',   img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&q=80&fit=crop' },
    { name: 'Fitness',   img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80&fit=crop' },
  ],
  'furniture': [
    { name: 'Sofas',      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80&fit=crop' },
    { name: 'Beds',       img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&q=80&fit=crop' },
    { name: 'Home Decor', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80&fit=crop' },
  ],
  'auto': [
    { name: 'Car Care',    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80&fit=crop' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&q=80&fit=crop' },
  ],
  '2-wheelers': [
    { name: 'Helmets',     img: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=200&q=80&fit=crop' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1558981033-0f0309284409?w=200&q=80&fit=crop' },
  ],
};

// ---------------------------------------------------------------------------
// SubIcon component — image with a simple Flipkart-blue initial fallback
// ---------------------------------------------------------------------------
function SubIcon({ sub }) {
  const [failed, setFailed] = React.useState(false);

  const containerStyle = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#f0f5ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(40,116,240,0.12)',
    border: '2px solid #e8eef9',
    flexShrink: 0,
  };

  if (failed) {
    // Branded initial pill — last resort, never a plain letter
    return (
      <div style={{ ...containerStyle, background: 'linear-gradient(135deg,#2874f0,#047bd5)' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 26, letterSpacing: -1 }}>
          {sub.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={sub.img}
        alt={sub.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function CategorySubNav({ categorySlug }) {
  const currentSubs =
    subCategoryData[categorySlug] ||
    subCategoryData['fashion'];

  return (
    <div
      style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        gap: '28px',
        overflowX: 'auto',
        borderBottom: '1px solid #f0f0f0',
      }}
      className="no-scrollbar"
    >
      {currentSubs.map((sub, idx) => (
        <Link
          href={`/products?category=${categorySlug}&q=${sub.name}`}
          key={idx}
          style={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            minWidth: 80,
          }}
        >
          <SubIcon sub={sub} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#212121',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {sub.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
