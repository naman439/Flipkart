'use client';

import { useState } from 'react';
import Link from 'next/link';

const banners = [
  {
    id: 1,
    content: (
      <div style={{ background: 'linear-gradient(to right, #f4ecd8, #e0d5b5)', height: '100%', padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-1px' }}>boAt</span>
            <span style={{ fontSize: 10, fontWeight: 700, borderLeft: '1px solid #333', paddingLeft: 6, lineHeight: 1.1 }}>INDIA'S #1<br/>AUDIO BRAND</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>boAt home audio</h2>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>From ₹599</h2>
          <p style={{ fontSize: 11, color: '#444' }}>Bold sound for bold celebrations</p>
        </div>
        <img src="https://rukminim1.flixcart.com/image/800/800/xif0q/speaker/mobile-tablet-speaker/m/6/v/stone-350-boat-original-imagy4yxgzxj5cya.jpeg" style={{ position: 'absolute', right: -20, top: '5%', height: '110%', objectFit: 'contain', mixBlendMode: 'multiply' }} alt="boAt" onError={(e) => e.target.style.opacity = 0} />
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 13, fontWeight: 700, zIndex: 10 }}>
          AD
        </div>
      </div>
    ),
    href: '/products?search=boat'
  },
  {
    id: 2,
    content: (
      <div style={{ background: 'linear-gradient(to bottom right, #f4fcff, #d7eeff, #9fe6f2)', height: '100%', padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ background: 'black', color: 'white', padding: '0 4px', borderRadius: 2, fontStyle: 'italic', fontWeight: 800, fontSize: 14 }}>M</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>moto book 60 PRO | intel</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>moto book 60 Pro</h2>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>From ₹63,990*</h2>
          <p style={{ fontSize: 11, color: '#444' }}>Brilliance in every frame</p>
        </div>
        <img src="https://rukminim1.flixcart.com/image/800/800/xif0q/computer/v/d/b/15-fc0028au-thin-and-light-laptop-hp-original-imagp8nzgfbbgg8q.jpeg" style={{ position: 'absolute', right: -10, top: '20%', height: '70%', objectFit: 'contain', mixBlendMode: 'multiply' }} alt="Laptop" onError={(e) => e.target.style.opacity = 0} />
        <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,255,255,0.7)', padding: '2px 4px', fontSize: 10, fontWeight: 700, borderRadius: 2, color: '#666' }}>AD</span>
        
        {/* Mock pagination dots on the center banner to exactly match screenshot */}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: i === 0 ? 6 : 4, height: i === 0 ? 6 : 4, borderRadius: '50%', background: i === 0 ? '#333' : '#a0a0a0' }} />
          ))}
        </div>
      </div>
    ),
    href: '/categories/electronics'
  },
  {
    id: 3,
    content: (
      <div style={{ background: 'linear-gradient(to bottom, #f4f6fa, #e8edf5)', height: '100%', padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '70%' }}>
          <div style={{ marginBottom: 8 }}>
             <span style={{ fontSize: 11, fontWeight: 800, color: '#d32f2f' }}>HEALTH & WELLNESS DAYS</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>Big discounts</h2>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Up to 85% Off</h2>
          <p style={{ fontSize: 11, color: '#444' }}>Protein, energy drinks & more</p>
        </div>
        <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,255,255,0.7)', padding: '2px 4px', fontSize: 10, fontWeight: 700, borderRadius: 2, color: '#666' }}>AD</span>
      </div>
    ),
    href: '/products?search=protein'
  }
];

export default function Banner() {
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, height: 180 }}>
        {banners.map((b) => (
          <Link href={b.href} key={b.id} style={{ textDecoration: 'none', color: 'inherit', borderRadius: 8, overflow: 'hidden', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {b.content}
          </Link>
        ))}
      </div>
    </div>
  );
}
