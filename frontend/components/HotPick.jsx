'use client';
import Link from 'next/link';

export default function HotPick() {
  return (
    <section style={{ background: 'white', padding: '16px 20px', marginBottom: 16, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#212121' }}>Today's Hot Pick</h2>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', background: '#f5f5f5', padding: '2px 6px', borderRadius: 2 }}>Ad</span>
      </div>
      <Link href="/products?category=appliances" style={{ width: '100%', height: 320, background: '#fdfbf2', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #f0f0f0', borderRadius: 4, textDecoration: 'none' }}>
         {/* Using a tall phone/refrigerator image to match the screenshot proportion */}
         <img src="https://rukminim2.flixcart.com/image/416/416/xif0q/air-conditioner-new/v/f/t/-original-imahatnt7y2zkxfa.jpeg" alt="Hot Pick" style={{ maxHeight: '90%', maxWidth: '100%', objectFit: 'contain' }} />
      </Link>
    </section>
  );
}
