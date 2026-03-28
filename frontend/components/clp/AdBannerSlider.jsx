import React from 'react';

export default function AdBannerSlider({ categorySlug }) {
  // Mock banners to replicate the HDFC/AXIS visuals from the screenshots
  const banners = {
    'appliances': 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9e6e4f32e65d8a8c.jpg',
    'electronics': 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/d541b4bcf4359ab4.jpg',
    'fashion': 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/bd65de30b0b8db5e.jpg',
    'toys-baby': 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/072d6ffb608dae76.jpg',
    'furniture': 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/621b1b402e1ca15b.jpg',
    'default': 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/9e6e4f32e65d8a8c.jpg' // generic HDFC/Axis bank banner
  };

  const bannerImg = banners[categorySlug] || banners['default'];

  return (
    <div style={{ margin: '12px 16px', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      <img src={bannerImg} alt="Category Offer Banner" style={{ width: '100%', display: 'block' }} />
    </div>
  );
}
