'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

export default function PriceBreakdown({ summary, showFooter = false, onContinue = null }) {
  const { subtotal, discount, total, itemCount } = summary;
  const [showFees, setShowFees] = useState(false);

  // Simulated fixed fees for 1:1 parity with screenshots
  const packagingFee = 0;
  const platformFee = 7;
  const totalFees = packagingFee + platformFee;

  return (
    <div style={{ position: 'sticky', top: 120 }}>
      <div style={{ background: 'white', borderRadius: 2, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#878787', textTransform: 'uppercase' }}>Price Details</h3>
        </div>
        
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
            <span>Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>₹{(subtotal + discount)?.toLocaleString()}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
            <span>Discounts</span>
            <span style={{ color: '#388e3c' }}>− ₹{discount?.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
             <div 
               style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, cursor: 'pointer' }}
               onClick={() => setShowFees(!showFees)}
             >
               <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                 Fees {showFees ? <FiChevronUp /> : <FiChevronDown />}
               </span>
               <span style={{ color: showFees ? '#212121' : '#388e3c' }}>
                 {showFees ? `₹${totalFees}` : '₹7'}
               </span>
             </div>
             {showFees && (
               <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#878787' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span>Platform Fee</span>
                   <span>₹7</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span>Secured Packaging Fee</span>
                   <span>₹0</span>
                 </div>
               </div>
             )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
            <span>Delivery Charges</span>
            <span style={{ color: '#388e3c' }}>FREE</span>
          </div>
          
          <div style={{ borderTop: '1px dashed #e0e0e0', margin: '8px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
            <span>Total Amount</span>
            <span>₹{(total + platformFee)?.toLocaleString()}</span>
          </div>
          
          <div style={{ borderTop: '1px dashed #e0e0e0', margin: '8px 0' }} />
          
          <div style={{ color: '#388e3c', fontWeight: 600, fontSize: 16, padding: '4px 0' }}>
            You will save ₹{discount?.toLocaleString()} on this order
          </div>
        </div>

        <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12, color: '#878787', fontSize: 14 }}>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" style={{ height: 32 }} />
          <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile/Summary Steps */}
      {showFooter && (
        <div style={{ marginTop: 16, background: 'white', padding: '12px 24px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
           <div>
              <div style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>₹{(subtotal + discount)?.toLocaleString()}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>₹{(total + platformFee)?.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--fk-blue)', fontWeight: 600 }}>View price details</div>
           </div>
           {onContinue && (
             <button 
               onClick={onContinue}
               style={{ background: '#fb641b', color: 'white', border: 'none', padding: '14px 44px', fontWeight: 600, fontSize: 15, borderRadius: 2, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
             >
               CONTINUE
             </button>
           )}
        </div>
      )}
    </div>
  );
}
