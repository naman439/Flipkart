'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/helpers';
import { Spinner } from '@/components/LoadingSkeleton';
import toast from 'react-hot-toast';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, sendOTP, verifyOTP } = useAuth();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    
    if (name === 'email') {
      if (!value) {
        setError('');
      } else if (!value.includes('@')) {
        setError('Please enter a valid email address');
      } else if (!EMAIL_REGEX.test(value)) {
        setError('Invalid email format');
      } else {
        setError('');
      }
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (error || !form.email || !form.password) return;

    setLoading(true);
    try {
      const sanitizedEmail = form.email.trim().toLowerCase();
      await login(sanitizedEmail, form.password);
      toast.success('Welcome back!');
      router.push(searchParams.get('redirect') || '/');
    } catch (err) {
      // Security: backend already returns generic error
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isInvalid = !form.email || !form.password || !!error || !EMAIL_REGEX.test(form.email);

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left Panel */}
        <div className="auth-banner">
          <div>
            <h2>Login</h2>
            <p>Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
            alt="Login Banner" 
            style={{ width: '100%', maxWidth: 200, margin: '0 auto' }} 
          />
        </div>

        {/* Right Panel */}
        <div className="auth-form" style={{ padding: '30px 40px' }}>
          <form onSubmit={handleEmailLogin} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="form-group-alt" style={{ marginBottom: error ? 10 : 25 }}>
              <label>Enter Email ID</label>
              <input 
                type="text" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                autoComplete="off"
                style={{ borderColor: error ? '#e91e63' : '#e0e0e0' }}
              />
              {error && <span style={{ color: '#e91e63', fontSize: 11, marginTop: 4 }}>{error}</span>}
            </div>
            
            <div className="form-group-alt" style={{ marginBottom: 25 }}>
              <label>Enter Password</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
              />
            </div>
            
            <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.5, marginBottom: 20 }}>
              By continuing, you agree to Flipkart's <span style={{ color: '#2874f0' }}>Terms of Use</span> and <span style={{ color: '#2874f0' }}>Privacy Policy</span>.
            </p>

            <button type="submit" className="btn btn-orange" disabled={loading || isInvalid}>
              {loading ? <Spinner size={20} color="white" /> : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'auto', fontSize: 14 }}>
            <Link href="/auth/signup" style={{ color: '#2874f0', textDecoration: 'none', fontWeight: 500 }}>
              New to Flipkart? Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><Spinner size={40} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
