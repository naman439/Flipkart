'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/services/api/orders.api';
import { getAddresses, createAddress } from '@/services/api/address.api';
import { Spinner } from '@/components/LoadingSkeleton';
import PriceBreakdown from '@/components/PriceBreakdown';
import StarRating from '@/components/StarRating';
import toast from 'react-hot-toast';
import {
  FiCheck, FiPlus, FiArrowLeft, FiShield, FiChevronDown,
  FiMapPin, FiTag, FiEdit2, FiChevronRight
} from 'react-icons/fi';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const emptyForm = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', postalCode: '', isDefault: false
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCartItems, loading: cartLoading } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Step: 2=Address, 3=OrderSummary, 4=Payment
  const [activeStep, setActiveStep] = useState(2);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [addrLoading, setAddrLoading] = useState(true);
  const [savingAddr, setSavingAddr] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderLoading, setOrderLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth/login?redirect=/checkout');
    if (!cartLoading && !isRedirecting && (!cart.items || cart.items.length === 0)) router.push('/cart');
  }, [isAuthenticated, authLoading, cart.items, cartLoading, isRedirecting]);

  // Fetch saved addresses
  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    setAddrLoading(true);
    try {
      const res = await getAddresses();
      const list = res.data || [];
      setAddresses(list);
      // Auto-select default address
      const def = list.find(a => a.isDefault) || list[0];
      if (def) setSelectedAddressId(def.id);
      if (list.length === 0) setShowAddForm(true);
    } catch (e) {
      toast.error('Could not load addresses');
    } finally {
      setAddrLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadAddresses(); }, [loadAddresses]);

  // Pincode Auto-fill Logic
  useEffect(() => {
    if (form.postalCode.length === 6 && !savingAddr) {
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
  }, [form.postalCode, savingAddr]);

  // Validate address form
  const validateForm = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-]{10,15}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.addressLine1.trim()) errs.addressLine1 = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state) errs.state = 'State is required';
    if (!form.postalCode.trim()) errs.postalCode = 'Postal code is required';
    else if (!/^\d{6}$/.test(form.postalCode)) errs.postalCode = '6-digit postal code required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSavingAddr(true);
    try {
      const res = await createAddress(form);
      toast.success('Address saved!');
      setShowAddForm(false);
      setForm(emptyForm);
      await loadAddresses();
      setSelectedAddressId(res.data.id);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddr(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { toast.error('Please select a delivery address'); return; }
    setOrderLoading(true);
    try {
      const res = await placeOrder({ addressId: selectedAddressId, paymentMethod });
      setIsRedirecting(true);
      await clearCartItems();
      toast.success('Order placed successfully! 🎉');
      router.push(`/order-success/${res.data.orderId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  if (cartLoading || authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spinner size={40} /></div>;
  }
  if (!cart.items || cart.items.length === 0) return null;

  // ─── STEP 2: ADDRESS SECTION ───────────────────────────────────────────────
  const RenderAddressStep = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Completed Login Row */}
      <div style={{ padding: '16px 24px', background: 'white', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)', opacity: 0.7 }}>
        <span style={{ background: '#f0f0f0', color: 'var(--fk-blue)', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, borderRadius: 2 }}>
          <FiCheck size={14} />
        </span>
        <span style={{ fontWeight: 600, color: '#878787' }}>LOGIN</span>
        <span style={{ marginLeft: 8, color: '#212121', fontSize: 14 }}>{user?.email}</span>
      </div>

      {/* Active Address Step */}
      <div style={{ background: 'white', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ background: 'var(--fk-blue)', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ background: 'white', color: 'var(--fk-blue)', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, borderRadius: 2 }}>2</span>
          <span style={{ fontWeight: 600 }}>DELIVERY ADDRESS</span>
        </div>

        <div style={{ padding: '16px 24px' }}>
          {addrLoading ? (
            <div style={{ padding: 40, textAlign: 'center' }}><Spinner size={32} /></div>
          ) : (
            <>
              {/* Saved Addresses */}
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => { setSelectedAddressId(addr.id); setShowAddForm(false); }}
                  style={{
                    padding: '16px', marginBottom: 12, borderRadius: 4, cursor: 'pointer',
                    border: selectedAddressId === addr.id ? '2px solid var(--fk-blue)' : '1px solid #e0e0e0',
                    background: selectedAddressId === addr.id ? '#f0f5ff' : 'white',
                    display: 'flex', gap: 12
                  }}
                >
                  <input
                    type="radio" readOnly
                    checked={selectedAddressId === addr.id}
                    style={{ marginTop: 3, accentColor: 'var(--fk-blue)', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 14 }}>{addr.fullName}</strong>
                      <span style={{ padding: '1px 6px', background: '#f0f0f0', borderRadius: 2, fontSize: 10, fontWeight: 700, color: '#878787' }}>
                        {addr.isDefault ? 'DEFAULT' : 'HOME'}
                      </span>
                      <span style={{ fontSize: 13, color: '#212121' }}>{addr.phone}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, margin: 0 }}>
                      {addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    {selectedAddressId === addr.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveStep(3); window.scrollTo(0, 0); }}
                        style={{ marginTop: 14, background: '#fb641b', color: 'white', border: 'none', padding: '12px 36px', fontWeight: 700, borderRadius: 2, cursor: 'pointer', fontSize: 14 }}
                      >
                        DELIVER HERE
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Address */}
              {!showAddForm ? (
                <div
                  onClick={() => setShowAddForm(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px', cursor: 'pointer', color: 'var(--fk-blue)', fontWeight: 600, border: '1px dashed #c8d8f5', borderRadius: 4, marginTop: 8 }}
                >
                  <FiPlus /> ADD A NEW ADDRESS
                </div>
              ) : (
                <form onSubmit={handleSaveAddress} style={{ marginTop: 16, padding: '20px', border: '1px solid #e0e0e0', borderRadius: 4 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#212121' }}>New Delivery Address</h4>
                  <div className="page-layout-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle(formErrors.fullName)} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Full Name" />
                      {formErrors.fullName && <span style={errStyle}>{formErrors.fullName}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input style={inputStyle(formErrors.phone)} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number" maxLength={15} />
                      {formErrors.phone && <span style={errStyle}>{formErrors.phone}</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Address Line 1 *</label>
                    <input style={inputStyle(formErrors.addressLine1)} value={form.addressLine1} onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))} placeholder="House No., Building, Street" />
                    {formErrors.addressLine1 && <span style={errStyle}>{formErrors.addressLine1}</span>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Address Line 2 (Optional)</label>
                    <input style={inputStyle()} value={form.addressLine2} onChange={e => setForm(f => ({ ...f, addressLine2: e.target.value }))} placeholder="Area, Colony, Sector" />
                  </div>
                  <div className="page-layout-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 20 }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input style={inputStyle(formErrors.city)} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                      {formErrors.city && <span style={errStyle}>{formErrors.city}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <select style={{ ...inputStyle(formErrors.state), background: 'white' }} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {formErrors.state && <span style={errStyle}>{formErrors.state}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>Pincode * {fetchingPincode && <span style={{ color: 'var(--fk-blue)', fontSize: 10 }}> (Fetching...)</span>}</label>
                      <input style={inputStyle(formErrors.postalCode)} value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value.replace(/\D/, '') }))} placeholder="6-digit PIN" maxLength={6} />
                      {formErrors.postalCode && <span style={errStyle}>{formErrors.postalCode}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} style={{ accentColor: 'var(--fk-blue)' }} />
                    <label htmlFor="isDefault" style={{ fontSize: 13, color: '#444', cursor: 'pointer' }}>Set as default address</label>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="submit" disabled={savingAddr} style={{ background: '#fb641b', color: 'white', border: 'none', padding: '12px 32px', fontWeight: 700, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {savingAddr ? <Spinner size={16} color="white" /> : null} SAVE & DELIVER HERE
                    </button>
                    <button type="button" onClick={() => { setShowAddForm(false); setForm(emptyForm); setFormErrors({}); }} style={{ background: 'white', color: '#878787', border: '1px solid #e0e0e0', padding: '12px 20px', borderRadius: 2, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ─── STEP 3: ORDER SUMMARY ──────────────────────────────────────────────────
  const RenderOrderSummary = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Deliver To */}
      {selectedAddress && (
        <div style={{ background: 'white', padding: '16px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, color: '#878787', marginBottom: 6 }}>Deliver to:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <strong style={{ fontSize: 14 }}>{selectedAddress.fullName}</strong>
              <span style={{ padding: '1px 6px', background: '#f0f0f0', borderRadius: 2, fontSize: 10, fontWeight: 700, color: '#878787' }}>HOME</span>
              <span style={{ fontSize: 13 }}>{selectedAddress.phone}</span>
            </div>
            <p style={{ fontSize: 13, color: '#444', margin: 0, lineHeight: 1.5 }}>
              {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.postalCode}
            </p>
          </div>
          <button onClick={() => setActiveStep(2)} style={{ border: '1px solid #e0e0e0', padding: '6px 16px', background: 'white', color: 'var(--fk-blue)', fontWeight: 600, fontSize: 13, borderRadius: 2, cursor: 'pointer' }}>
            Change
          </button>
        </div>
      )}

      {/* Items */}
      <div style={{ background: 'white', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        {cart.items.map(item => {
          const img = item.product?.images?.[0] || item.product?.thumbnail;
          return (
            <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ textAlign: 'center' }}>
                {img && <img src={`http://localhost:3050${img}`} onError={e => { e.target.style.display = 'none'; }} style={{ width: 80, height: 80, objectFit: 'contain' }} />}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 }}>
                  <span style={{ padding: '2px 10px', border: '1px solid #e0e0e0', fontSize: 14 }}>Qty: {item.quantity}</span>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 400, color: '#212121', marginBottom: 4, lineHeight: 1.4 }}>{item.product?.title}</h3>
                <p style={{ fontSize: 12, color: '#878787', marginBottom: 8 }}>{item.product?.category?.name}</p>
                {item.product?.rating && <div style={{ marginBottom: 10 }}><StarRating rating={item.product.rating} size={12} /></div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.product?.discountPct > 0 && <span style={{ color: '#388e3c', fontWeight: 600, fontSize: 13 }}>↓ {item.product.discountPct}%</span>}
                  {item.product?.price && <span style={{ fontSize: 13, color: '#878787', textDecoration: 'line-through' }}>₹{Number(item.product.price).toLocaleString()}</span>}
                  <span style={{ fontSize: 18, fontWeight: 600 }}>₹{Number(item.product?.discountPrice || item.product?.price).toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: '#388e3c', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🚚 Free Delivery by <strong>Sat, Apr 5</strong>
                </div>
              </div>
            </div>
          );
        })}
        <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.6 }}>
          By continuing, you confirm that you agree to Flipkart's{' '}
          <span style={{ color: 'var(--fk-blue)' }}>Terms of Use</span> and{' '}
          <span style={{ color: 'var(--fk-blue)' }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );

  // ─── STEP 4: PAYMENT ───────────────────────────────────────────────────────
  const RenderPayment = () => (
    <div className="page-layout-grid" style={{ background: 'white', borderRadius: 4, boxShadow: 'var(--shadow-md)', minHeight: 450, gridTemplateColumns: '300px 1fr', gap: 0 }}>
      {/* Payment Method List */}
      <div style={{ background: '#f9f9f9', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '20px', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f0f0f0' }}>
          <FiArrowLeft onClick={() => setActiveStep(3)} style={{ cursor: 'pointer' }} /> Payment
        </div>
        {[
          { id: 'COD', name: 'Cash on Delivery', badge: 'Most Popular' },
          { id: 'UPI', name: 'UPI', badge: 'Instant • No charges' },
          { id: 'CARD', name: 'Credit / Debit Card', badge: '5% cashback available' },
          { id: 'NETBANKING', name: 'Net Banking' },
          { id: 'EMI', name: 'EMI', subtitle: 'No-cost EMI available' },
        ].map(opt => (
          <div
            key={opt.id}
            onClick={() => setPaymentMethod(opt.id)}
            style={{
              padding: '14px 20px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
              background: paymentMethod === opt.id ? 'white' : 'transparent',
              borderLeft: paymentMethod === opt.id ? '4px solid var(--fk-blue)' : 'none',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.name}</div>
            {opt.badge && <div style={{ fontSize: 11, color: '#388e3c', marginTop: 2 }}>{opt.badge}</div>}
            {opt.subtitle && <div style={{ fontSize: 11, color: '#878787', marginTop: 2 }}>{opt.subtitle}</div>}
          </div>
        ))}
      </div>

      {/* Payment Detail */}
      <div style={{ padding: '32px' }}>
        {paymentMethod === 'COD' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Cash on Delivery</h3>
            <p style={{ color: '#878787', fontSize: 14, maxWidth: 300, margin: '0 auto 28px' }}>
              Pay with cash or UPI at delivery. Please keep change ready.
            </p>
            <button onClick={handlePlaceOrder} disabled={orderLoading}
              style={{ background: '#fb641b', color: 'white', border: 'none', padding: '14px 48px', fontWeight: 700, borderRadius: 2, cursor: 'pointer', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {orderLoading ? <Spinner size={18} color="white" /> : null}
              CONFIRM ORDER — ₹{(cart.summary.total + 7).toLocaleString()}
            </button>
          </div>
        )}

        {paymentMethod === 'CARD' && (
          <div style={{ maxWidth: 380 }}>
            <p style={{ fontSize: 13, color: '#666', background: '#fafafa', padding: '10px 14px', borderRadius: 4, marginBottom: 20 }}>
              ℹ️ This is a demo. No real card is processed.
            </p>
            {[['Card Number', 'XXXX XXXX XXXX XXXX', 'text', 1], ['Valid Thru (MM/YY)', 'MM / YY', 'text', 0.5], ['CVV', '•••', 'password', 0.5]].map(([label, ph, type, span]) => (
              <div key={label} style={{ marginBottom: 16, gridColumn: `span ${span === 1 ? 2 : 1}` }}>
                <label style={labelStyle}>{label}</label>
                <input type={type} placeholder={ph} style={inputStyle()} />
              </div>
            ))}
            <button onClick={handlePlaceOrder} disabled={orderLoading} style={{ width: '100%', background: '#fb641b', color: 'white', border: 'none', height: 48, fontWeight: 700, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {orderLoading ? <Spinner size={18} color="white" /> : null} PAY ₹{(cart.summary.total + 7).toLocaleString()}
            </button>
          </div>
        )}

        {['UPI', 'NETBANKING', 'EMI'].includes(paymentMethod) && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#878787', marginBottom: 24, fontSize: 14 }}>Demo: {paymentMethod} payment flow for testing.</p>
            <button onClick={handlePlaceOrder} disabled={orderLoading}
              style={{ background: '#fb641b', color: 'white', border: 'none', padding: '12px 48px', borderRadius: 2, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {orderLoading ? <Spinner size={18} color="white" /> : null} PROCEED — ₹{(cart.summary.total + 7).toLocaleString()}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  if (activeStep === 4) {
    return (
      <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
        <div style={{ background: 'var(--fk-blue)', height: 64, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <span style={{ color: 'white', fontSize: 22, fontWeight: 800, fontStyle: 'italic' }}>Flipkart</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 6 }}>| Secure Payment</span>
        </div>
        <div className="main-container" style={{ padding: '24px 0', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          {RenderPayment()}
          <PriceBreakdown summary={cart.summary} showFooter={false} />
        </div>
        <footer style={{ padding: '30px 0', borderTop: '1px solid #e0e0e0', fontSize: 12, color: '#878787', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <FiShield size={14} /> Safe &amp; Secure Payments. Easy Returns. 100% Authentic products.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '16px 0' }}>
      {/* Progress Bar */}
      <div style={{ background: 'var(--fk-blue)', height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', marginBottom: 16 }}>
        <div className="main-container mobile-scroll-x" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ color: 'white', fontSize: 22, fontWeight: 800, fontStyle: 'italic', marginRight: 32 }}>Flipkart</span>
          {[['2', 'Address', 2], ['3', 'Order Summary', 3], ['4', 'Payment', 4]].map(([num, label, step]) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: activeStep >= step ? 'white' : 'rgba(255,255,255,0.5)',
                fontWeight: activeStep === step ? 700 : 400, fontSize: 13, padding: '4px 0'
              }}>
                {activeStep > step ? <FiCheck size={14} /> : <span style={{ border: '1px solid currentColor', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{num}</span>}
                {label}
              </div>
              {step < 4 && <FiChevronRight color="rgba(255,255,255,0.4)" style={{ margin: '0 8px' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="main-container page-layout-grid checkout-grid">
        {activeStep === 2 ? RenderAddressStep() : RenderOrderSummary()}
        <PriceBreakdown
          summary={cart.summary}
          showFooter={activeStep === 3}
          onContinue={() => { setActiveStep(activeStep + 1); window.scrollTo(0, 0); }}
        />
      </div>
    </div>
  );
}

// ─── Util Styles ─────────────────────────────────────────────────────────────
const labelStyle = { display: 'block', fontSize: 12, color: '#878787', marginBottom: 4 };
const inputStyle = (err) => ({
  width: '100%', border: `1px solid ${err ? '#d32f2f' : '#e0e0e0'}`, borderRadius: 4,
  padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box'
});
const errStyle = { fontSize: 11, color: '#d32f2f', marginTop: 3, display: 'block' };
