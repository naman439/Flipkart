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
  const { register, sendOTP, verifyOTP } = useAuth();
  
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const REGEX = {
    NAME: /^[A-Za-z ]{2,50}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/,
    PHONE: /^[6-9]\d{9}$/
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value) error = 'Full Name is required';
      else if (!REGEX.NAME.test(value)) error = 'Alphabets only, 2-50 characters';
    } else if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!REGEX.EMAIL.test(value)) error = 'Please enter a valid email address';
    } else if (name === 'password') {
      if (!value) error = 'Password required';
      else if (!REGEX.PASSWORD.test(value)) error = '8-20 chars, must include upper, lower, number, & special char';
    } else if (name === 'phone' && value) {
      if (!REGEX.PHONE.test(value)) error = 'Invalid Indian mobile number';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setErrors(p => ({ ...p, [name]: error }));
  };

  const isFormInvalid = () => {
    return (
      !form.name || !form.email || !form.password ||
      errors.name || errors.email || errors.password || errors.phone ||
      !REGEX.EMAIL.test(form.email) || !REGEX.PASSWORD.test(form.password) || !REGEX.NAME.test(form.name)
    );
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (isFormInvalid()) return;

    setLoading(true);
    try {
      const payload = { 
        ...form, 
        email: form.email.trim().toLowerCase() 
      };
      await register(payload.name, payload.email, payload.password, payload.phone);
      setSignedUp(true);
      toast.success('Registration successful!', { duration: 5000 });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (signedUp) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ display: 'block', padding: '0' }}>
          <div style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ background: '#f0f5ff', borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Success" style={{ width: 50 }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#212121', marginBottom: 12 }}>Account Created!</h2>
            <h3 style={{ fontSize: 18, color: '#2874f0', marginBottom: 16 }}>Verify your Email</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: 15, maxWidth: 350, margin: '0 auto 30px' }}>
              We've sent a verification link to<br/>
              <strong style={{ color: '#212121' }}>{form.email}</strong>.<br/>
              Please check your inbox to activate your account.
            </p>
            <Link 
              href="/auth/login" 
              className="btn btn-orange" 
              style={{ 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 'auto', 
                minWidth: 200,
                padding: '12px 30px',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              GO TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="auth-form" style={{ padding: '30px 40px' }}>
          <form onSubmit={handleEmailSignup} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="form-group-alt" style={{ marginBottom: errors.name ? 10 : 20 }}>
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                autoComplete="off"
                style={{ borderColor: errors.name ? '#e91e63' : '#e0e0e0' }}
              />
              {errors.name && <span style={{ color: '#e91e63', fontSize: 11, marginTop: 4 }}>{errors.name}</span>}
            </div>

            <div className="form-group-alt" style={{ marginBottom: errors.email ? 10 : 20 }}>
              <label>Email ID</label>
              <input 
                type="text" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                autoComplete="off"
                style={{ borderColor: errors.email ? '#e91e63' : '#e0e0e0' }}
              />
              {errors.email && <span style={{ color: '#e91e63', fontSize: 11, marginTop: 4 }}>{errors.email}</span>}
            </div>

            <div className="form-group-alt" style={{ marginBottom: errors.password ? 10 : 20 }}>
              <label>Set Password</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                style={{ borderColor: errors.password ? '#e91e63' : '#e0e0e0' }}
              />
              {errors.password && <span style={{ color: '#e91e63', fontSize: 11, marginTop: 4 }}>{errors.password}</span>}
            </div>

            <div className="form-group-alt" style={{ marginBottom: errors.phone ? 10 : 20 }}>
              <label>Mobile Number (Optional)</label>
              <input 
                type="text" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                maxLength={10}
                autoComplete="off"
                style={{ borderColor: errors.phone ? '#e91e63' : '#e0e0e0' }}
              />
              {errors.phone && <span style={{ color: '#e91e63', fontSize: 11, marginTop: 4 }}>{errors.phone}</span>}
            </div>
            
            <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.5, marginBottom: 20 }}>
              By signing up, you agree to Flipkart's <span style={{ color: '#2874f0' }}>Terms of Use</span> and <span style={{ color: '#2874f0' }}>Privacy Policy</span>.
            </p>

            <button type="submit" className="btn btn-orange" disabled={loading || isFormInvalid()}>
              {loading ? <Spinner size={20} color="white" /> : 'CONTINUE'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'auto', fontSize: 14 }}>
            <Link href="/auth/login" style={{ color: '#2874f0', textDecoration: 'none', fontWeight: 500 }}>
              Existing User? Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
