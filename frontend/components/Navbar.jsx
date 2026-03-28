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
    <nav style={{ background: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000, paddingBottom: 10 }}>
      {/* ── Top Row (Logo, Travel, Location) ────────────────────────── */}
      <div className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ background: '#ffee00', padding: '10px 18px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
             <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="" style={{ height: 22 }} />
             <span style={{ fontWeight: 800, color: '#2874f0', fontSize: 18, fontStyle: 'italic' }}>Flipkart</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', color: '#666', fontSize: 14 }}>
             <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/travel-icon-6beddb.svg" alt="" style={{ height: 20 }} />
             <span>Travel</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#212121', cursor: 'pointer' }}>
           <FiMapPin size={16} color="#878787" />
           <span style={{ color: '#878787' }}>Location not set - </span>
           <span style={{ color: 'var(--fk-blue)', fontWeight: 600 }}>Select delivery location &gt;</span>
        </div>
      </div>

      {/* ── Bottom Row (Search & Actions) ───────────────────────────── */}
      <div className="main-container" style={{ display: 'flex', alignItems: 'center', height: 48, gap: 32 }}>
        <form onSubmit={handleSearch} style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, color: '#2874f0', pointerEvents: 'none', display: 'flex', alignItems: 'center', top: '50%', transform: 'translateY(-50%)' }}>
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              background: '#f0f5ff',
              border: 'none',
              borderRadius: 24,
              padding: '0 52px',
              fontSize: 16,
              outline: 'none',
              color: '#333'
            }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
            onClick={() => !isAuthenticated && router.push('/auth/login')}
          >
            <FiUser size={24} color="#333" />
            <span style={{ fontSize: 16, fontWeight: 500 }}>{isAuthenticated ? user?.name?.split(' ')[0] : 'Login'}</span>
            <FiChevronDown size={14} />
            
            {showUserMenu && isAuthenticated && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 8, padding: '8px 0', minWidth: 180, zIndex: 1100 }}>
                <Link href="/profile" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333' }} className="hover-blue">My Profile</Link>
                <Link href="/orders" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333' }} className="hover-blue">Orders</Link>
                <div onClick={logout} style={{ padding: '12px 16px', color: '#d32f2f', cursor: 'pointer', borderTop: '1px solid #eee' }}>Logout</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>More</span>
            <FiChevronDown size={14} />
          </div>

          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#333', position: 'relative' }}>
            <FiShoppingCart size={24} />
            <span style={{ fontSize: 16, fontWeight: 500 }}>Cart</span>
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -10, left: 16, background: '#ff6161', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hover-blue:hover { background: #f0f5ff; color: var(--fk-blue); }
      `}</style>
    </nav>
  );
}
