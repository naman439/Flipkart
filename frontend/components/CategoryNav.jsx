'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CategoryNav() {
  const pathname = usePathname();

  const categories = [
    { name: 'For You', slug: '', icon: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=128&q=80' },
    { name: 'Fashion', slug: 'fashion', icon: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=128&q=80' },
    { name: 'Mobiles', slug: 'mobiles', icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=128&q=80' },
    { name: 'Beauty', slug: 'beauty', icon: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=128&q=80' },
    { name: 'Electronics', slug: 'electronics', icon: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=128&q=80' },
    { name: 'Home', slug: 'home-kitchen', icon: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=128&q=80' },
    { name: 'Appliances', slug: 'appliances', icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=128&q=80' },
    { name: 'Toys, Baby...', slug: 'toys-baby', icon: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&w=128&q=80' },
    { name: 'Food & Health', slug: 'groceries', icon: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=128&q=80' },
    { name: 'Auto Access...', slug: 'auto-accessories', icon: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=128&q=80' },
    { name: '2 Wheelers', slug: '2-wheelers', icon: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=128&q=80' },
    { name: 'Sports & Fit...', slug: 'sports-fitness', icon: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=128&q=80' },
    { name: 'Books & More', slug: 'books', icon: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=128&q=80' },
    { name: 'Furniture', slug: 'furniture', icon: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=128&q=80' }
  ];

  if (pathname.includes('/checkout')) return null;

  return (
    <div style={{ background: 'white', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', marginBottom: 8, marginTop: 4 }}>
      <div className="main-container no-scrollbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 10px', overflowX: 'auto', gap: 16 }}>
        {categories.map((cat, idx) => {
          const isActive = pathname === `/categories/${cat.slug}` || (cat.slug === '' && pathname === '/');
          
          return (
            <Link 
              key={idx} 
              href={cat.slug === '' ? '/' : `/categories/${cat.slug}`} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', minWidth: 70 }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', padding: 2, background: isActive ? 'var(--fk-blue)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={cat.icon} 
                  alt={cat.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', transition: 'transform 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }} 
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--fk-blue)' : '#333', whiteSpace: 'nowrap' }}>
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
