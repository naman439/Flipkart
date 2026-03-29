'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/api/auth.api';
import { Spinner } from '@/components/LoadingSkeleton';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiPackage, FiHeart, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AddressManager from '@/components/AddressManager';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'addresses') setActiveTab('addresses');
    else setActiveTab('profile');
  }, [searchParams]);

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
    <div className="container" style={{ maxWidth: 1000, padding: '40px 16px' }}>
      <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr' }}>
        
        {/* Sidebar Nav */}
        <div style={{ background: '#f5f7fa', borderRight: '1px solid #eee', padding: '24px 0' }}>
          <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #eee', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--fk-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#878787' }}>Hello,</div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              onClick={() => setActiveTab('profile')}
              style={{ padding: '16px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: activeTab === 'profile' ? 'var(--fk-blue)' : '#212121', background: activeTab === 'profile' ? 'white' : 'transparent', fontWeight: activeTab === 'profile' ? 700 : 400 }}
            >
              <FiUser /> Personal Information
            </div>
            <div 
              onClick={() => setActiveTab('addresses')}
              style={{ padding: '16px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: activeTab === 'addresses' ? 'var(--fk-blue)' : '#212121', background: activeTab === 'addresses' ? 'white' : 'transparent', fontWeight: activeTab === 'addresses' ? 700 : 400, borderLeft: activeTab === 'addresses' ? '4px solid var(--fk-blue)' : 'none' }}
            >
              <FiMapPin /> Manage Addresses
            </div>
            <Link href="/orders" style={{ padding: '16px 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, color: '#212121' }}>
              <FiPackage /> My Orders
            </Link>
            <Link href="/wishlist" style={{ padding: '16px 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, color: '#212121' }}>
              <FiHeart /> My Wishlist
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: 40, minHeight: 500 }}>
          {activeTab === 'profile' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Personal Information</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} style={{ border: 'none', background: 'none', color: 'var(--fk-blue)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiEdit2 size={14} /> EDIT
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button onClick={() => setEditing(false)} style={{ border: 'none', background: 'none', color: '#666', fontWeight: 700, cursor: 'pointer' }}>
                      CANCEL
                    </button>
                    <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13 }} disabled={updating}>
                      {updating ? 'SAVING...' : 'SAVE'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ maxWidth: 400 }}>
                  <label style={{ display: 'block', color: '#878787', fontSize: 13, marginBottom: 8 }}>Full Name</label>
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 15 }}
                    />
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{user.name}</div>
                  )}
                </div>

                <div style={{ maxWidth: 400 }}>
                  <label style={{ display: 'block', color: '#878787', fontSize: 13, marginBottom: 8 }}>Email Address</label>
                  <div style={{ fontSize: 16, color: '#666' }}>{user.email} <span style={{ marginLeft: 8, fontSize: 11, background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: 10 }}>VERIFIED</span></div>
                </div>

                <div style={{ maxWidth: 400 }}>
                  <label style={{ display: 'block', color: '#878787', fontSize: 13, marginBottom: 8 }}>Phone Number</label>
                  {editing ? (
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 15 }}
                    />
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{user.phone || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Manage Addresses</h2>
              </div>
              <AddressManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}><Spinner size={40} /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
