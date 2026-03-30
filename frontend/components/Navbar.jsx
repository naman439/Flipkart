'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiChevronDown, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getAddresses } from '@/services/api/address.api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated) {
        setLoadingAddress(true);
        try {
          const res = await getAddresses();
          if (res.success) setAddresses(res.data);
        } catch (err) {
          console.error('Failed to fetch addresses', err);
        } finally {
          setLoadingAddress(false);
        }
      } else {
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, [isAuthenticated]);

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  const handleBack = () => {
    if (pathname.startsWith('/order-success')) {
      router.push('/');
    } else if (pathname === '/checkout') {
      router.push('/cart');
    } else if (pathname === '/cart') {
      router.push('/');
    } else {
      router.back();
    }
  };

  const itemCount = cart?.summary?.itemCount || 0;

  // ─── HELPER COMPONENTS ──────────────────────────────────────────────────
  const Logo = ({ minimal = false }) => (
    <Link href="/" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: minimal ? 'transparent' : '#ffc200', 
      borderRadius: 6, padding: minimal ? '4px' : '8px 12px',
      textDecoration: 'none'
    }}>
      <svg width="24" height="24" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 2C15 2 20 2 20 7C20 10 17 11 15 11" stroke="#2874f0" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <line x1="15" y1="2" x2="15" y2="28" stroke="#2874f0" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="9" y1="16" x2="21" y2="16" stroke="#2874f0" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
      {(!minimal) && (
        <span className="navbar-brand-txt" style={{
          fontFamily: 'Roboto, Arial, sans-serif',
          fontWeight: 700, fontStyle: 'italic', fontSize: 16,
          color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: 1
        }}>Flipkart</span>
      )}
    </Link>
  );

  const SearchBar = ({ compact = false }) => (
    <div className={compact ? "navbar-product-search" : "navbar-search-group"}>
      <form onSubmit={handleSearch} style={{ width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', left: compact ? 12 : 16, top: '50%', transform: 'translateY(-50%)', color: '#717478', pointerEvents: 'none', display: 'flex', alignItems: 'center', zIndex: 2 }}>
          <FiSearch size={compact ? 18 : 22} />
        </div>
        <input
          type="text"
          placeholder={compact ? "Search..." : "Search for Products, Brands and More"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', height: compact ? 36 : 44,
            background: '#f0f5ff', border: 'none', borderRadius: 8,
            padding: `0 16px 0 ${compact ? 36 : 52}px`, fontSize: compact ? 13 : 14, outline: 'none', color: '#111',
            boxShadow: 'none', transition: 'box-shadow 0.2s'
          }}
        />
      </form>
    </div>
  );

  const CartIcon = () => (
    <Link href="/cart" style={{ position: 'relative', display: 'flex', color: '#212121', gap: 6, textDecoration: 'none', alignItems: 'center' }}>
      <div style={{ position: 'relative', display: 'flex' }}>
        <FiShoppingCart size={24} />
        {itemCount > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, background: '#ff6161', color: 'white', fontSize: 10, fontWeight: 600, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' }}>{itemCount}</span>
        )}
      </div>
      <span className="action-label" style={{ fontWeight: 500 }}>Cart</span>
    </Link>
  );

  // Determine Page Type
  const isProductPage = /^\/products\/[^/]+$/.test(pathname) && pathname !== '/products';
  const isCheckoutFlow = pathname === '/cart' || pathname === '/checkout' || pathname.startsWith('/order-success');
  const isMainPage = !isProductPage && !isCheckoutFlow;

  if (!mounted) return null;

  // ─── 1. CHECKOUT HEADER (Cart, Checkout, Success) ─────────────────────────
  if (isCheckoutFlow) {
    return (
      <nav style={{ background: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="main-container">
          {/* Mobile Branch */}
          <div className="navbar-header-minimal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="navbar-back-btn" onClick={handleBack}><FiArrowLeft size={24} /></div>
                <div className="navbar-minimal-title" style={{ fontSize: 18, fontWeight: 600, marginLeft: 12 }}>
                  {pathname === '/cart' ? 'My Cart' : pathname === '/checkout' ? 'Checkout' : 'Order Confirmed'}
                </div>
             </div>
             <Logo minimal />
          </div>

          {/* Desktop Branch (Visible > 768px via CSS) */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
             <Logo />
             <div className="navbar-step-indicator">
                <span className={pathname === '/cart' ? 'step-active' : ''}>1. MY CART</span>
                <span>──</span>
                <span className={pathname === '/checkout' ? 'step-active' : ''}>2. CHECKOUT</span>
                <span>──</span>
                <span className={pathname.startsWith('/order-success') ? 'step-active' : ''}>3. PAYMENT</span>
             </div>
             <div style={{ width: 150 }} /> {/* Spacer */}
          </div>
        </div>
        <style jsx>{`
          @media (min-width: 769px) { .navbar-header-minimal { display: none !important; } }
          @media (max-width: 768px) { .desktop-only { display: none !important; } }
        `}</style>
      </nav>
    );
  }

  // ─── 2. PRODUCT HEADER (Detail View) ──────────────────────────────────────
  if (isProductPage) {
    return (
      <nav style={{ background: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="main-container">
          {/* Mobile Branch */}
          <div className="navbar-header-product">
            <div className="navbar-back-btn" onClick={handleBack}><FiArrowLeft size={24} /></div>
            <SearchBar compact />
            <CartIcon />
          </div>

          {/* Desktop Branch */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
             <Logo />
             <div style={{ flex: 1, maxWidth: 600, margin: '0 40px' }}>
                <SearchBar />
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <CartIcon />
             </div>
          </div>
        </div>
        <style jsx>{`
          @media (min-width: 769px) { .navbar-header-product { display: none !important; } }
          @media (max-width: 768px) { .desktop-only { display: none !important; } }
        `}</style>
      </nav>
    );
  }

  // ─── 3. FULL HEADER (Home, Listing) ───────────────────────────────────────
  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="main-container navbar-responsive-nav">
        {/* Row 1/Desktop Group 1: Logo & Service Pills */}
        <div className="navbar-brand-group">
          <Logo />
          <div className="navbar-service-pills">
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#212121' }}>
              <span style={{ color: '#d32f2f' }}>🚀</span> <span>Minutes</span>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#212121' }}>
              <span style={{ color: '#2874f0' }}>✈️</span> <span>Travel</span>
            </button>
          </div>
        </div>

        {/* Desktop Group 2: Address */}
        <div 
          onClick={() => isAuthenticated ? router.push('/profile?tab=addresses') : router.push('/auth/login')}
          className="navbar-address-group"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiMapPin size={16} color="#212121" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>{isAuthenticated ? (defaultAddress?.city || 'DELIVERY') : 'Select Address'}</span>
            <FiChevronDown size={14} color="#212121" />
          </div>
        </div>

        {/* Desktop Group 3: Actions */}
        <div className="navbar-actions-group">
          <div
            className="action-item user-action"
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
            onClick={() => !isAuthenticated && router.push('/auth/login')}
          >
            <FiUser size={24} color="#212121" />
            <span className="action-label" style={{ fontWeight: 500 }}>{mounted && isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Login'}</span>
            <FiChevronDown size={14} color="#717478" className="action-label" />
            
            {mounted && showUserMenu && isAuthenticated && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,.15)', borderRadius: 4, minWidth: 200, zIndex: 1100, border: '1px solid #f0f0f0', paddingTop: 8 }}>
                 <div style={{ background: 'white', padding: '4px 0', borderRadius: 4 }}>
                   <Link href="/profile" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#212121', fontSize: 14 }}>My Profile</Link>
                   <Link href="/orders"  style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#212121', fontSize: 14 }}>My Orders</Link>
                   <Link href="/wishlist" style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#212121', fontSize: 14 }}>Wishlist</Link>
                   <div onClick={logout} style={{ padding: '12px 16px', color: '#d32f2f', cursor: 'pointer', borderTop: '1px solid #f0f0f0', fontSize: 14 }}>Logout</div>
                 </div>
              </div>
            )}
          </div>
          <CartIcon />
        </div>

        {/* Search Bar */}
        <SearchBar />
      </div>
    </nav>
  );
}
