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
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      router.push(searchParams.get('redirect') || '/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
        <div className="auth-form">
          <form onSubmit={handleSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="form-group-alt">
              <label>Enter Email/Mobile number</label>
              <input 
                type="text" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                autoComplete="off"
              />
            </div>
            <div className="form-group-alt">
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

            <button type="submit" className="btn btn-orange" disabled={loading}>
              {loading ? <Spinner size={20} color="white" /> : 'Login'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 'auto', fontSize: 14 }}>
              <Link href="/auth/signup" style={{ color: '#2874f0', textDecoration: 'none', fontWeight: 500 }}>
                New to Flipkart? Create an account
              </Link>
            </p>
          </form>
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
