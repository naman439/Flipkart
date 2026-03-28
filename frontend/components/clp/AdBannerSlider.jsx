'use client';
import React from 'react';

export default function AdBannerSlider({ categorySlug }) {
  // Use professional, high-fidelity promotional banners
  const banners = {
    'mobiles': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/d541b4bcf4359ab4.jpg',
    'electronics': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/9e6e4f32e65d8a8c.jpg',
    'appliances': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/072d6ffb608dae76.jpg',
    'fashion': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/bd65de30b0b8db5e.jpg',
    'home-kitchen': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/738df9ee492e85bc.jpg',
    'beauty': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/62b667104b901a88.jpg',
    'toys-baby': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/e8f49896accdec4c.jpg',
    'groceries': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/e8f49896accdec4c.jpg',
    'default': 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/9e6e4f32e65d8a8c.jpg'
  };

  const [fallbackStage, setFallbackStage] = React.useState(0);
  const bannerImg = banners[categorySlug] || banners['default'];

  const handleBannerError = (e) => {
    if (fallbackStage === 0) {
      // Stage 1: Try replacing domain if it failed on rukminim2
      if (e.target.src.includes('rukminim2')) {
        e.target.src = e.target.src.replace('rukminim2', 'rukminim1');
      } else {
        setFallbackStage(1);
      }
    } else {
      setFallbackStage(2);
    }
  };

  if (fallbackStage === 2) {
    return (
      <div style={{ 
        margin: '12px 16px', height: 120, borderRadius: 4, 
        background: 'linear-gradient(45deg, #2874f0, #047bd5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px', textAlign: 'center'
      }}>
        <div style={{ color: 'white' }}>
          <div style={{ fontWeight: 800, fontSize: 24, textTransform: 'uppercase', letterSpacing: 2 }}>
            {categorySlug?.replace('-', ' ') || 'Exclusive'} Deals
          </div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Best Prices Guaranteed during this Sale!</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '12px 16px', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', background: '#f0f0f0', minHeight: 60 }}>
      <img 
        src={bannerImg} 
        alt="Category Offer Banner" 
        style={{ width: '100%', display: 'block', minHeight: 60 }} 
        onError={handleBannerError}
      />
    </div>
  );
}
