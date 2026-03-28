'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/services/api/orders.api';
import { Spinner } from '@/components/LoadingSkeleton';
import PriceBreakdown from '@/components/PriceBreakdown';
import StarRating from '@/components/StarRating';
import toast from 'react-hot-toast';
import { FiCheck, FiPlus, FiArrowLeft, FiSearch, FiMapPin, FiShield, FiChevronRight, FiChevronDown, FiInfo, FiTag } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCartItems, loading: cartLoading } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [activeStep, setActiveStep] = useState(2); // 2: Address, 3: Summary, 4: Payment
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [addressType, setAddressType] = useState('HOME');
  const [form, setForm] = useState({ name: 'Naman Arya', address: '#2, 9A, Guru Teg Bahadur Nagar, gali no. 6', city: 'Kharar', state: 'Punjab', pincode: '140301', phone: '8409866823' });
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD', 'COD', 'UPI', etc.
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
    // Fix: Move empty cart redirect to useEffect with guard
    if (!isRedirecting && !cartLoading && (!cart.items || cart.items.length === 0)) {
       router.push('/cart');
    }
  }, [isAuthenticated, authLoading, router, cart.items, cartLoading, isRedirecting]);

  if (cartLoading || authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spinner size={40} /></div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return null;
  }

  const handleNext = (step) => {
    setActiveStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      const res = await placeOrder({
        shippingName: form.name,
        shippingPhone: form.phone,
        shippingAddress: form.address,
        shippingCity: form.city,
        shippingState: form.state,
        shippingZip: form.pincode,
        items: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        totalAmount: cart.summary.total + 7,
        paymentMethod: paymentMethod
      });
      setIsRedirecting(true); // Prevent redirect to cart
      await clearCartItems();
      toast.success('Order placed successfully!');
      router.push(`/order-success/${res.data.orderId}`); 
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  // ── Step 1 & 2: ADDRESS SECTION ───────────────────────────────────────────
  const RenderAddressStep = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {/* Collapsed Login */}
       <div style={{ padding: '16px 24px', background: 'white', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)', opacity: 0.7 }}>
          <span style={{ background: '#f0f0f0', color: 'var(--fk-blue)', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, borderRadius: 2 }}>
             <FiCheck size={14} />
          </span>
          <span style={{ fontWeight: 600, color: '#878787' }}>LOGIN</span>
          <span style={{ marginLeft: 8, color: '#212121', fontSize: 14 }}>{user?.email}</span>
       </div>

       {/* Active Address Selection */}
       <div style={{ background: 'white', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ background: 'var(--fk-blue)', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
             <span style={{ background: 'white', color: 'var(--fk-blue)', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, borderRadius: 2 }}>2</span>
             <span style={{ fontWeight: 600 }}>DELIVERY ADDRESS</span>
          </div>
          
          <div style={{ padding: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <FiPlus color="var(--fk-blue)" />
                <span style={{ color: 'var(--fk-blue)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsMapOpen(true)}>ADD A NEW ADDRESS</span>
             </div>
             
             {/* Current Address Mockup */}
             <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: 4, background: '#f9f9f9', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                   <span style={{ fontWeight: 600 }}>{user?.name || 'User'}</span>
                   <span style={{ padding: '2px 6px', background: '#f0f0f0', borderRadius: 2, fontSize: 10, fontWeight: 600, color: '#878787' }}>{addressType}</span>
                   <span style={{ fontWeight: 600 }}>{form.phone}</span>
                </div>
                <p style={{ fontSize: 14, color: '#212121', lineHeight: 1.6 }}>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                <button onClick={() => handleNext(2)} style={{ marginTop: 16, background: '#fb641b', color: 'white', border: 'none', padding: '14px 40px', fontWeight: 600, borderRadius: 2, cursor: 'pointer' }}>DELIVER HERE</button>
             </div>
          </div>
       </div>
    </div>
  );

  // ── Step 3: ORDER SUMMARY (IMAGE 1) ─────────────────────────────────────────
  const RenderOrderSummary = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
       {/* Mini Header / Progress */}
       <div style={{ background: 'white', padding: '12px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#878787', fontSize: 13 }}>
                <span style={{ border: '1px solid #878787', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span> Address
             </div>
             <div style={{ height: 1, width: 40, background: '#e0e0e0' }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fk-blue)', fontSize: 13, fontWeight: 600 }}>
                <span style={{ border: '1px solid var(--fk-blue)', background: 'var(--fk-blue)', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span> Order Summary
             </div>
             <div style={{ height: 1, width: 40, background: '#e0e0e0' }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#878787', fontSize: 13 }}>
                <span style={{ border: '1px solid #878787', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span> Payment
             </div>
          </div>
       </div>

       {/* Deliver to Card */}
       <div style={{ background: 'white', padding: '16px 24px', boxShadow: 'var(--shadow-sm)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
             <div style={{ color: '#878787', fontSize: 14, marginBottom: 12 }}>Deliver to:</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{user?.name || 'Naman Arya'}</span>
                <span style={{ padding: '2px 6px', background: '#f0f0f0', borderRadius: 2, fontSize: 10, fontWeight: 600, color: '#878787' }}>HOME</span>
             </div>
             <p style={{ fontSize: 13, color: '#212121', lineHeight: 1.5 }}>
                {form.address}, {form.city} {form.pincode}<br/>
                {form.phone}
             </p>
          </div>
          <button style={{ border: '1px solid #e0e0e0', padding: '8px 20px', background: 'white', color: 'var(--fk-blue)', fontWeight: 600, fontSize: 14, borderRadius: 2 }}>Change</button>
       </div>

       {/* Product List */}
       <div style={{ background: 'white', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
          {cart.items.map(item => (
            <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, paddingBottom: 24 }}>
               <div style={{ textAlign: 'center' }}>
                  <img src={item.product?.image} style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 16 }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                     <button style={{ border: '1px solid #e0e0e0', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                     <span style={{ padding: '2px 12px', border: '1px solid #e0e0e0', fontSize: 14 }}>{item.quantity}</span>
                     <button style={{ border: '1px solid #e0e0e0', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
               </div>
               <div>
                  <h3 style={{ fontSize: 16, fontWeight: 400, color: '#212121', marginBottom: 4 }}>{item.product?.title}</h3>
                  <p style={{ fontSize: 12, color: '#878787', marginBottom: 8 }}>{item.product?.category?.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                     <StarRating rating={item.product?.rating} size={12} />
                     <span style={{ color: '#878787', fontSize: 12 }}>(6)</span>
                     <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" style={{ height: 15 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <span style={{ color: '#388e3c', fontSize: 14, fontWeight: 600 }}>↓ 86%</span>
                     <span style={{ fontSize: 14, color: '#878787', textDecoration: 'line-through' }}>₹{item.product?.price}</span>
                     <span style={{ fontSize: 18, fontWeight: 600 }}>₹{item.product?.discountPrice}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#878787', marginTop: 4 }}>Or Pay ₹{item.product?.discountPrice - 14} + <FiTag style={{ display: 'inline', verticalAlign: 'middle' }} /> 14</div>
                  <div style={{ marginTop: 16, fontSize: 14 }}> Delivery by Apr 4, Sat </div>
               </div>
            </div>
          ))}
       </div>

       <p style={{ fontSize: 12, color: '#878787', padding: '0 8px', lineHeight: 1.6 }}>By continuing with the order, you confirm that you are above 18 years of age, and you agree to the Flipkart's <span style={{ color: 'var(--fk-blue)' }}>Terms of Use</span> and <span style={{ color: 'var(--fk-blue)' }}>Privacy Policy</span></p>
    </div>
  );

  // ── Step 4: COMPLETE PAYMENT (IMAGE 3) ────────────────────────────────────────
  const RenderPayment = () => (
    <div style={{ background: 'white', borderRadius: 4, boxShadow: 'var(--shadow-md)', minHeight: 450, display: 'grid', gridTemplateColumns: '300px 1fr' }}>
       {/* Left Sidebar Methods */}
       <div style={{ background: '#f9f9f9', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '20px', fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
             <FiArrowLeft onClick={() => setActiveStep(3)} style={{ cursor: 'pointer' }} /> Complete Payment
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             {[
               { id: 'CARD', name: 'Credit / Debit / ATM Card', subtitle: 'Add and secure cards as per RBI guidelines', badge: 'Get upto 5% cashback • 2 offers available' },
               { id: 'UPI', name: 'UPI', badge: 'Pay by Any UPI App' },
               { id: 'COD', name: 'Cash on Delivery', description: 'Pay at the time of delivery' },
               { id: 'GIFT', name: 'Have a Flipkart Gift Card?', icon: <FiTag /> },
               { id: 'BANK', name: 'Net Banking' },
               { id: 'EMI', name: 'EMI', subtitle: 'Detailed Plans available' }
             ].map(opt => (
               <div 
                 key={opt.id} 
                 onClick={() => setPaymentMethod(opt.id)}
                 style={{ 
                   padding: '16px 20px', 
                   borderBottom: '1px solid #f0f0f0', 
                   background: paymentMethod === opt.id ? 'white' : 'transparent', 
                   borderLeft: paymentMethod === opt.id ? '4px solid var(--fk-blue)' : 'none', 
                   cursor: 'pointer' 
                 }}
               >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: opt.subtitle ? 4 : 0 }}>
                     <span style={{ fontWeight: 600, fontSize: 14 }}>{opt.name}</span>
                  </div>
                  {(opt.subtitle || opt.description) && <div style={{ fontSize: 12, color: '#878787' }}>{opt.subtitle || opt.description}</div>}
                  {opt.badge && <div style={{ fontSize: 11, color: '#388e3c', marginTop: 4 }}>{opt.badge}</div>}
               </div>
             ))}
          </div>
       </div>

       {/* Center Detail Section */}
       <div style={{ padding: '32px' }}>
          {/* Card Flow */}
          {paymentMethod === 'CARD' && (
            <div style={{ maxWidth: 400 }}>
               <div style={{ background: '#f1f3f6', padding: '12px 16px', borderRadius: 4, fontSize: 13, color: '#666', marginBottom: 24 }}>
                  Note: Please ensure your card can be used for online transactions. <span style={{ color: 'var(--fk-blue)', fontWeight: 600 }}>Learn More</span>
               </div>
               <div className="form-group-alt" style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, color: '#878787' }}>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={{ height: 44 }} />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                  <div className="form-group-alt">
                     <label style={{ fontSize: 13, color: '#878787' }}>Valid Thru</label>
                     <input type="text" placeholder="MM / YY" style={{ height: 44 }} />
                  </div>
                  <div className="form-group-alt">
                     <label style={{ fontSize: 13, color: '#878787' }}>CVV</label>
                     <input type="text" placeholder="CVV" style={{ height: 44 }} />
                  </div>
               </div>
               <button onClick={handlePlaceOrder} style={{ width: '100%', background: '#fb641b', color: 'white', border: 'none', height: 48, fontSize: 16, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} disabled={orderLoading}>
                  {orderLoading ? <Spinner size={20} color="white" /> : `Pay ₹${(cart.summary.total + 7).toLocaleString()}`}
               </button>
            </div>
          )}

          {/* Cash on Delivery Flow */}
          {paymentMethod === 'COD' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
               <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment_cod_6e8aef.svg" style={{ height: 80, marginBottom: 24 }} />
               <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Cash on Delivery</h3>
               <p style={{ color: '#878787', fontSize: 14, marginBottom: 32, maxWidth: 320, margin: '0 auto 32px' }}>
                  You can pay with Cash or UPI at the time of delivery. Please keep change ready for a faster process.
               </p>
               <button onClick={handlePlaceOrder} style={{ width: '100%', maxWidth: 300, background: '#fb641b', color: 'white', border: 'none', height: 48, fontSize: 16, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} disabled={orderLoading}>
                  {orderLoading ? <Spinner size={20} color="white" /> : 'CONFIRM ORDER'}
               </button>
            </div>
          )}

          {/* UPI/Others Fallback */}
          {!['CARD', 'COD'].includes(paymentMethod) && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
               <p style={{ color: '#878787', marginBottom: 24 }}>This payment method is successfully integrated for testing.</p>
               <button onClick={handlePlaceOrder} style={{ background: '#fb641b', color: 'white', border: 'none', padding: '12px 60px', borderRadius: 2, fontWeight: 600 }} disabled={orderLoading}>
                  {orderLoading ? <Spinner size={20} color="white" /> : 'PROCEED'}
               </button>
            </div>
          )}
       </div>
    </div>
  );

  // ── Address Map Mockup (IMAGE 2) ───────────────────────────────────────────
  const RenderMapMock = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'white', display: 'flex', flexDirection: 'column' }}>
       <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <FiArrowLeft size={24} onClick={() => setIsMapOpen(false)} style={{ cursor: 'pointer' }} />
          <span style={{ fontSize: 18, fontWeight: 500 }}>Choose address on map</span>
       </div>
       <div style={{ flex: 1, position: 'relative', background: '#e5e3df' }}>
          {/* Map Image Mock */}
          <div style={{ width: '100%', height: '100%', background: `url('https://maps.googleapis.com/maps/api/staticmap?center=30.6433,76.6575&zoom=16&size=1200x800&key=mock')`, backgroundSize: 'cover' }} />
          
          {/* Search Bar */}
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 640 }}>
             <div style={{ background: 'white', padding: '14px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <FiSearch size={20} color="#878787" />
                <input type="text" value="Banyal House, Guru Teg Bahadur Nagar, Kharar, Punjab, India" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14 }} readOnly />
             </div>
          </div>

          {/* Animated Pin */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', textAlign: 'center' }}>
             <div style={{ background: 'black', color: 'white', padding: '4px 12px', borderRadius: 4, fontSize: 12, marginBottom: 8, position: 'relative' }}>
                We will deliver here
                <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid black' }} />
             </div>
             <FiMapPin size={48} color="black" />
          </div>

          <button style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e0e0e0', padding: '12px 24px', borderRadius: 24, fontSize: 14, fontWeight: 600, color: 'var(--fk-blue)', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
             <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/my-location-blue_667232.svg" style={{ height: 18 }} />
             Use my current location
          </button>
       </div>
       <div style={{ padding: '24px', background: 'white', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#878787', fontSize: 12, marginBottom: 8 }}>Your location</div>
          <div style={{ fontSize: 14, color: '#212121', marginBottom: 20, fontWeight: 500 }}>{form.address}, {form.city}, {form.state} {form.pincode}</div>
          <div className="form-group-alt">
             <label style={{ fontSize: 13 }}>Flat / House No. / Floor / Building*</label>
             <input type="text" placeholder="Flat / House No. / Floor / Building*" style={{ borderBottom: '1px solid #e0e0e0' }} />
          </div>
          <button onClick={() => setIsMapOpen(false)} style={{ width: '100%', background: '#fb641b', color: 'white', border: 'none', padding: '16px', fontWeight: 700, borderRadius: 2, marginTop: 24 }}>CONFIRM LOCATION</button>
       </div>
    </div>
  );

  return (activeStep === 4) ? (
    /* Payment Step has its own layout Header */
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
       {/* Payment Header */}
       <div style={{ background: 'var(--fk-blue)', height: 72, color: 'white', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <div className="main-container" style={{ display: 'flex', alignItems: 'center' }}>
             <span style={{ fontSize: 24, fontWeight: 800, fontStyle: 'italic' }}>Flipkart</span>
          </div>
       </div>
       <div className="main-container" style={{ padding: '32px 0', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          {RenderPayment()}
          <aside>
             <div style={{ background: 'white', padding: '24px', borderRadius: 4, boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#878787', textTransform: 'uppercase', marginBottom: 20 }}>Price Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>MRP (incl. of all taxes)</span>
                      <span>₹{(cart.summary.subtotal + cart.summary.discount).toLocaleString()}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>Fees <FiChevronDown /></span>
                      <span>₹7</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ paddingLeft: 12, color: '#878787' }}>Platform Fee</span>
                      <span>₹7</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Discounts <FiChevronDown /></span>
                      <span style={{ color: '#388e3c' }}>− ₹{cart.summary.discount.toLocaleString()}</span>
                   </div>
                   <div style={{ borderTop: '1px dashed #e0e0e0', margin: '8px 0' }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
                      <span>Total Amount</span>
                      <span>₹{(cart.summary.total + 7).toLocaleString()}</span>
                   </div>
                </div>
                <div style={{ marginTop: 24, background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 4, padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ color: '#388e3c', fontWeight: 700, fontSize: 13 }}>5% Cashback</div>
                   <div style={{ fontSize: 11, color: '#666' }}>Claim now with payment offers</div>
                   <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" style={{ height: 12, marginLeft: 'auto' }} />
                </div>
             </div>
             <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#878787', fontSize: 12 }}>
                <FiShield size={20} /> Safe & Secure Payments
             </div>
          </aside>
       </div>
       {/* Minimal Payment Footer */}
       <footer style={{ marginTop: 'auto', padding: '40px 0', borderTop: '1px solid #e0e0e0', fontSize: 12, color: '#878787' }}>
          <div className="main-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', gap: 16 }}>
                <span>Policies: Returns Policy | Terms of use | Security | Privacy</span>
             </div>
             <span>© 2007-2026 Flipkart.com</span>
             <span>Need help? Visit the Help Center or Contact Us</span>
          </div>
       </footer>
    </div>
  ) : (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '16px 0' }}>
      {isMapOpen && RenderMapMock()}
      <div className="main-container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        
        {activeStep === 2 ? RenderAddressStep() : RenderOrderSummary()}

        <PriceBreakdown 
          summary={cart.summary} 
          showFooter={activeStep === 3}
          onContinue={() => handleNext(activeStep)}
        />
      </div>
    </div>
  );
}

// Final clean-up of CheckoutPage
