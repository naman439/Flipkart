'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/api/auth.api';
import { Spinner } from '@/components/LoadingSkeleton';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiPackage, FiHeart } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size={40} />
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile(form);
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 800, padding: '40px 16px' }}>
      <div style={{ background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'var(--fk-blue)', padding: '40px 32px', color: 'white', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.name}</h1>
            <p style={{ opacity: 0.8, fontSize: 14 }}>Customer since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, padding: 32 }}>
          {/* Main Info */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Personal Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: 13, gap: 6 }}>
                  <FiEdit2 size={14} /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditing(false)} className="btn btn-outline" style={{ padding: '6px 12px', borderColor: '#999', color: '#666' }}>
                    <FiX size={14} />
                  </button>
                  <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: 13, gap: 6 }} disabled={updating}>
                    {updating ? <Spinner size={14} color="white" /> : <><FiSave size={14} /> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                  <FiUser /> Full Name
                </label>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 4 }}
                  />
                ) : (
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{user.name}</p>
                )}
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                  <FiMail /> Email Address
                </label>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#666' }}>{user.email} <span style={{ fontSize: 12, fontWeight: 400, background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: 10, marginLeft: 8 }}>Verified</span></p>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                  <FiPhone /> Phone Number
                </label>
                {editing ? (
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 4 }}
                  />
                ) : (
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Links */}
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: 32 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14 }}>
                <FiPackage color="var(--fk-blue)" /> My Orders
              </Link>
              <Link href="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14 }}>
                <FiHeart color="#e91e63" /> My Wishlist
              </Link>
            </div>

            <div style={{ marginTop: 24, padding: '16px', background: '#f5f7fa', borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Your data is secure with us. We use industry-standard encryption to protect your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
