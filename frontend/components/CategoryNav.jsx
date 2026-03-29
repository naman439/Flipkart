'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Inline SVG icons matching Flipkart's styling with maximum visual weight (2.5 stroke for HD clarity)
const NAV_ICONS = {
  'for-you': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="0" y="0" width="32" height="32" rx="8" fill="#e1edff"/>
      <path d="M11 11V8a5 5 0 0110 0v3" stroke="#212121" strokeWidth="2.5"/>
      <rect x="6" y="11" width="20" height="15" rx="3" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <path d="M12 16a4 4 0 008 0" stroke="#FFC200" strokeWidth="2.8" strokeLinecap="round"/>
    </svg>
  ),
  'fashion': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <path d="M11 5L6 11H11V25H21V11H26L21 5H18C18 6.66 16.66 8 15 8C13.34 8 12 6.66 12 5H11Z" fill="#fff" stroke="#212121" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M12 5C12 6.66 13.34 8 15 8C16.66 8 18 6.66 18 5" fill="#FFC200" stroke="#212121" strokeWidth="2.5" />
    </svg>
  ),
  'mobiles': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="8" y="3" width="16" height="26" rx="3" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="10" y="5" width="12" height="19" rx="1" fill="#FFC200"/>
      <circle cx="16" cy="26" r="1.5" fill="#212121"/>
    </svg>
  ),
  'beauty': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="13" y="14" width="6" height="8" fill="#FFC200" stroke="#212121" strokeWidth="2.5"/>
      <path d="M14 14V7c0-1.5 1-3 2-3s2 1.5 2 3v7h-4z" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="12" y="22" width="8" height="4" rx="1" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
    </svg>
  ),
  'electronics': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="7" width="20" height="14" rx="2" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="6" y="9" width="16" height="10" fill="#FFC200"/>
      <path d="M11 21v4m6-4v4m-6 0h6" stroke="#212121" strokeWidth="2.5"/>
      <path d="M22 18a6 6 0 016-6v5" stroke="#212121" strokeWidth="2.5" fill="none"/>
      <circle cx="28" cy="17" r="1.5" fill="#212121"/>
    </svg>
  ),
  'home': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <path d="M7 16L16 4l9 12H7z" fill="#FFC200" stroke="#212121" strokeLinejoin="round" strokeWidth="2.5"/>
      <path d="M16 16v12m-5 0h10" stroke="#212121" strokeWidth="2.5"/>
    </svg>
  ),
  'appliances': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="3" y="7" width="26" height="18" rx="2" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="5" y="9" width="16" height="14" rx="1" fill="#FFC200"/>
      <circle cx="25" cy="12" r="1.5" fill="#212121"/>
      <circle cx="25" cy="17" r="1.5" fill="#212121"/>
      <circle cx="25" cy="22" r="1.5" fill="#212121"/>
    </svg>
  ),
  'toys': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <circle cx="10" cy="8" r="4" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <circle cx="22" cy="8" r="4" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <circle cx="16" cy="16" r="7" fill="#FFC200" stroke="#212121" strokeWidth="2.5"/>
      <circle cx="13" cy="14" r="1.5" fill="#212121"/>
      <circle cx="19" cy="14" r="1.5" fill="#212121"/>
      <path d="M16 19c-1.5 0-3-.5-3-1h6c0 .5-1.5 1-3 1z" fill="#212121"/>
      <circle cx="16" cy="24" r="5" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
    </svg>
  ),
  'food': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <path d="M10 8v14a2 2 0 002 2h8a2 2 0 002-2V8H10z" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="11" y="4" width="10" height="4" rx="1" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="10" y="12" width="12" height="7" fill="#FFC200" stroke="#212121" strokeWidth="2.5"/>
    </svg>
  ),
  'sports': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="8" y="8" width="6" height="16" rx="1" fill="#fff" stroke="#212121" strokeWidth="2.5" transform="rotate(-45 8 8)"/>
      <rect x="5" y="24" width="3" height="7" rx="1" fill="#212121" transform="rotate(-45 5 24)"/>
      <circle cx="24" cy="20" r="5" fill="#FFC200" stroke="#212121" strokeWidth="2.5"/>
    </svg>
  ),
  'books': (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect x="7" y="5" width="16" height="22" rx="1" fill="#fff" stroke="#212121" strokeWidth="2.5"/>
      <rect x="7" y="5" width="5" height="22" fill="#FFC200" stroke="#212121" strokeWidth="2.5"/>
      <path d="M15 11h5M15 15h5M15 19h3" stroke="#212121" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
};

const categories = [
  { name: 'For You',       slug: '',                 iconKey: 'for-you' },
  { name: 'Fashion',       slug: 'fashion',          iconKey: 'fashion' },
  { name: 'Mobiles',       slug: 'mobiles',          iconKey: 'mobiles' },
  { name: 'Beauty',        slug: 'beauty',           iconKey: 'beauty' },
  { name: 'Electronics',   slug: 'electronics',      iconKey: 'electronics' },
  { name: 'Home',          slug: 'home-kitchen',     iconKey: 'home' },
  { name: 'Appliances',    slug: 'appliances',       iconKey: 'appliances' },
  { name: 'Toys',          slug: 'toys',             iconKey: 'toys' },
  { name: 'Groceries',     slug: 'groceries',        iconKey: 'food' },
  { name: 'Sports',        slug: 'sports-fitness',   iconKey: 'sports' },
  { name: 'Books',         slug: 'books',            iconKey: 'books' },
];

export default function CategoryNav() {
  const pathname = usePathname();
  if (pathname.includes('/checkout')) return null;

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e0e0e0', marginBottom: 8, padding: '0 8px' }}>
      <div
        className="main-container no-scrollbar"
        style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto', alignItems: 'flex-end', gap: 4 }}
      >
        {categories.map((cat, idx) => {
          const isActive =
            pathname === `/categories/${cat.slug}` || (cat.slug === '' && pathname === '/');
          return (
            <Link
              key={idx}
              href={cat.slug === '' ? '/' : `/categories/${cat.slug}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, textDecoration: 'none', padding: '12px 6px 10px',
                borderBottom: isActive ? '3px solid #2874f0' : '3px solid transparent',
                marginBottom: '-1px', // overlap container border
                color: '#212121', // exact Match to text styling from image
                minWidth: '68px', flexShrink: 0,
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '36px', color: 'inherit' }}>
                {NAV_ICONS[cat.iconKey]}
              </span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
