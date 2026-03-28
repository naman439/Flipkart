'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/helpers';
import { Spinner } from '@/components/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please enter all required fields');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to Flipkart');
      router.push('/');
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
            <h2>Looks like you're new here!</h2>
            <p>Sign up with your details to get started</p>
          </div>
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
            alt="Signup Banner" 
            style={{ width: '100%', maxWidth: 200, margin: '0 auto' }} 
          />
        </div>

        {/* Right Panel */}
        <div className="auth-form" style={{ padding: '30px 32px' }}>
          <form onSubmit={handleSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="form-group-alt">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                autoComplete="off"
              />
            </div>
            <div className="form-group-alt">
              <label>Email ID</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                autoComplete="off"
              />
            </div>
            <div className="form-group-alt">
              <label>Set Password</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group-alt">
              <label>Mobile Number (Optional)</label>
              <input 
                type="text" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                maxLength={10}
              />
            </div>

            <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.5, marginBottom: 20 }}>
              By signing up, you agree to Flipkart's <span style={{ color: '#2874f0' }}>Terms of Use</span> and <span style={{ color: '#2874f0' }}>Privacy Policy</span>.
            </p>

            <button type="submit" className="btn btn-orange" disabled={loading}>
              {loading ? <Spinner size={20} color="white" /> : 'CONTINUE'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 'auto', fontSize: 14 }}>
              <Link href="/auth/login" style={{ color: '#2874f0', textDecoration: 'none', fontWeight: 500 }}>
                Existing User? Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
