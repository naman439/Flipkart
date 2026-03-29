'use client';

import { useState, useEffect } from 'react';
import { getAddresses, createAddress, deleteAddress, setDefaultAddress } from '@/services/api/address.api';
import { FiPlus, FiMapPin, FiTrash2, FiCheck } from 'react-icons/fi';
import { Spinner } from './LoadingSkeleton';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      if (res.success) setAddresses(res.data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Pincode Auto-fill Logic
  useEffect(() => {
    if (form.postalCode.length === 6 && !submitting) {
      const fetchLocation = async () => {
        setFetchingPincode(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${form.postalCode}`);
          const data = await res.json();
          if (data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setForm(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
            toast.success(`Auto-filled: ${postOffice.District}, ${postOffice.State}`);
          }
        } catch (err) {
          console.error('Pincode fetch error:', err);
        } finally {
          setFetchingPincode(false);
        }
      };
      fetchLocation();
    }
  }, [form.postalCode, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAddress(form);
      toast.success('Address added successfully!');
      setShowForm(false);
      setForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', isDefault: false });
      fetchAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success('Default address updated');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to update default address');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Spinner size={32} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* List */}
      {!showForm && (
        <>
          <button 
            onClick={() => setShowForm(true)}
            style={{ 
              width: '100%', 
              padding: '16px', 
              border: '1px dashed var(--fk-blue)', 
              background: '#f9faff', 
              borderRadius: 4,
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-start', 
              gap: 12, 
              color: 'var(--fk-blue)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <FiPlus size={18} /> ADD A NEW ADDRESS
          </button>

          {addresses.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#878787' }}>
               <FiMapPin size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
               <p>No addresses saved yet. Add one to see shipping estimates!</p>
            </div>
          )}

          {addresses.map((addr) => (
            <div key={addr.id} style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, position: 'relative', background: 'white' }}>
              {addr.isDefault && (
                <span style={{ position: 'absolute', top: 12, right: 12, background: '#f0f0f0', padding: '4px 8px', borderRadius: 2, fontSize: 10, fontWeight: 700, color: '#878787' }}>DEFAULT</span>
              )}
              <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 15 }}>
                 <span style={{ fontWeight: 700 }}>{addr.fullName}</span>
                 <span style={{ fontWeight: 700 }}>{addr.phone}</span>
              </div>
              <div style={{ fontSize: 14, color: '#212121', lineHeight: 1.6, marginBottom: 20 }}>
                {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}
                {addr.city}, {addr.state} - <span style={{ fontWeight: 700 }}>{addr.postalCode}</span>
              </div>
              
              <div style={{ display: 'flex', gap: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} style={{ border: 'none', background: 'none', color: 'var(--fk-blue)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}>SET AS DEFAULT</button>
                )}
                <button onClick={() => handleDelete(addr.id)} style={{ border: 'none', background: 'none', color: '#ff6161', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}>DELETE</button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 32, background: '#f5faff' }}>
          <div style={{ color: 'var(--fk-blue)', fontWeight: 700, marginBottom: 24, fontSize: 16, textTransform: 'uppercase' }}>Add a New Address</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>Full Name</label>
              <input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>Phone Number</label>
              <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>Address Line 1</label>
              <input required value={form.addressLine1} onChange={e => setForm({...form, addressLine1: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>Address Line 2 (Optional)</label>
              <input value={form.addressLine2} onChange={e => setForm({...form, addressLine2: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>Pincode {fetchingPincode && <span style={{ color: 'var(--fk-blue)', fontSize: 10 }}> (Fetching...)</span>}</label>
              <input required maxLength={6} value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>City</label>
              <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#878787' }}>State</label>
              <select required value={form.state} onChange={e => setForm({...form, state: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, outline: 'none', background: 'white' }}>
                 <option value="">Select State</option>
                 {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
             <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} style={{ width: 16, height: 16, cursor: 'pointer' }} />
             <label htmlFor="isDefault" style={{ fontSize: 14, cursor: 'pointer', color: '#212121' }}>Make this my default address</label>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px 48px', minWidth: 160 }} disabled={submitting}>
              {submitting ? 'SAVING...' : 'SAVE'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', color: '#2874f0', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>CANCEL</button>
          </div>
        </form>
      )}
    </div>
  );
}
