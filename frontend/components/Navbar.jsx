'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiChevronDown, FiMapPin } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  const itemCount = cart?.summary?.itemCount || 0;

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000 }}>

      {/* ── ROW 1: Logo pills + address ── */}
      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, borderBottom: '1px solid #f0f0f0' }}>

        {/* Left: logo + service pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Flipkart logo pill */}
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#ffc200', borderRadius: 6, padding: '8px 12px',
            textDecoration: 'none'
          }}>
            <svg width="24" height="24" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 2C15 2 20 2 20 7C20 10 17 11 15 11" stroke="#2874f0" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              <line x1="15" y1="2" x2="15" y2="28" stroke="#2874f0" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="9" y1="16" x2="21" y2="16" stroke="#2874f0" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontFamily: 'Roboto, Arial, sans-serif',
              fontWeight: 700, fontStyle: 'italic', fontSize: 16,
              color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: 1
            }}>Flipkart</span>
          </Link>

          {/* Minutes */}
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#212121' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 6h3l2 4v7h-2v2h-3v-2H9v2H6v-2H5v-7l2-4h5" fill="#fceaea"/>
              <path d="M12 6h3l2 4v7h-2m-3 0H9m-3 0H5v-7l2-4h5v7z" stroke="#d32f2f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="18" r="2.5" fill="#d32f2f"/>
              <circle cx="16" cy="18" r="2.5" fill="#d32f2f"/>
              <path d="M12 2v4M16 4l-1 2" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Minutes</span>
          </button>

          {/* Travel */}
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#212121' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 16L12 9V3.5C12 2.67 11.33 2 10.5 2C9.67 2 9 2.67 9 3.5V9L-1 16v2l10-3v4l-3 2v2l4-1 4 1v-2l-3-2v-4l10 3v-2z" fill="#d32f2f" transform="translate(1, 0) scale(0.9)"/>
            </svg>
            <span>Travel</span>
          </button>

          {/* Grocery */}
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#212121' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 9l-1 11h16l-1-11H5z" fill="#e8f0fe" stroke="#1976d2" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 9V6c0-2.2 1.8-4 4-4s4 1.8 4 4v3" stroke="#1976d2" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="14" r="2.5" fill="#ffc107"/>
              <rect x="14" y="13" width="4" height="4" fill="#d32f2f" rx="1"/>
              <path d="M5 9h14" stroke="#1976d2" strokeWidth="1.5"/>
            </svg>
            <span>Grocery</span>
          </button>
        </div>

        {/* Right: address */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#212121', cursor: 'pointer' }}>
          <FiMapPin size={16} color="#212121" />
          <span style={{ fontWeight: 700 }}>HOME</span>
          <span style={{ color: '#212121', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            3, Guru Teg Bahadur Nagar, Khar...
          </span>
          <FiChevronDown size={14} color="#212121" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8, background: '#f5f5f5', padding: '4px 8px', borderRadius: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFC200"/>
              <path d="M12 6L16 12L12 18L8 12L12 6Z" fill="#fff"/>
            </svg>
            <span style={{ fontWeight: 700 }}>0</span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Search + User/More/Cart ── */}
      <div className="main-container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#717478', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <FiSearch size={24} />
          </div>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => e.target.parentElement.style.boxShadow = '0 0 0 1px #2874f0'}
            onBlur={(e) => e.target.parentElement.style.boxShadow = 'none'}
            style={{
              width: '100%', height: 44,
              background: '#fff', border: '1px solid #b3d4ff', borderRadius: 8,
              padding: '0 16px 0 52px', fontSize: 15, outline: 'none', color: '#111',
              boxShadow: 'none', transition: 'box-shadow 0.2s'
            }}
          />
        </form>

        {/* User */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative', fontSize: 16, fontWeight: 400, color: '#212121', whiteSpace: 'nowrap' }}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
          onClick={() => !isAuthenticated && router.push('/auth/login')}
        >
          <FiUser size={24} color="#212121" />
          <span>{isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Login'}</span>
          <FiChevronDown size={16} color="#717478" />

          {showUserMenu && isAuthenticated && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,.15)', borderRadius: 4, minWidth: 200, zIndex: 1100, border: '1px solid #f0f0f0' }}>
              <Link href="/profile" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#212121', fontSize: 14 }}>My Profile</Link>
              <Link href="/orders"  style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#212121', fontSize: 14 }}>My Orders</Link>
              <Link href="/wishlist" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#212121', fontSize: 14 }}>Wishlist</Link>
              <div onClick={logout} style={{ padding: '12px 16px', color: '#d32f2f', cursor: 'pointer', borderTop: '1px solid #f0f0f0', fontSize: 14 }}>Logout</div>
            </div>
          )}
        </div>

        {/* More */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 16, fontWeight: 400, color: '#212121' }}>
          <span>More</span>
          <FiChevronDown size={16} color="#717478" />
        </div>

        {/* Cart */}
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#212121', fontSize: 16, fontWeight: 400 }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            <FiShoppingCart size={24} />
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#ff6161', color: 'white', fontSize: 11, fontWeight: 600, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' }}>{itemCount}</span>
            )}
          </div>
          <span>Cart</span>
        </Link>
      </div>
    </nav>
  );
}
