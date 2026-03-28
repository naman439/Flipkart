'use client';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const items = [
  { name: 'Latest Mobiles', href: '/categories/mobiles', img: 'https://rukminim1.flixcart.com/image/200/200/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg' },
  { name: 'Smart Watches', href: '/products?search=smartwatch', img: 'https://rukminim1.flixcart.com/image/200/200/xif0q/smartwatch/q/v/z/-original-imagxhd5hgqyg8rz.jpeg' },
  { name: 'Laptops', href: '/categories/electronics', img: 'https://rukminim1.flixcart.com/image/200/200/xif0q/computer/v/d/b/15-fc0028au-thin-and-light-laptop-hp-original-imagp8nzgfbbgg8q.jpeg' },
  { name: 'Headphones', href: '/products?search=headphones', img: 'https://rukminim1.flixcart.com/image/200/200/xif0q/headphone/p/r/z/envy-shopy1x-original-imaghx8zyygygzuz.jpeg' },
  { name: 'Appliances', href: '/categories/appliances', img: 'https://rukminim1.flixcart.com/image/200/200/xif0q/air-conditioner-new/v/f/t/-original-imahatnt7y2zkxfa.jpeg' },
  { name: 'Fashion', href: '/categories/fashion', img: 'https://rukminim1.flixcart.com/image/200/200/xif0q/shirt/r/y/x/s-8905206254707-jockey-original-imaghkfz2f8gqgxz.jpeg' },
];

export default function StillLooking() {
  return (
    <section style={{ background: '#ebf2fb', borderRadius: 8, padding: '20px', position: 'relative', marginBottom: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#212121' }}>Naman, still looking for these?</h2>
      
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }} className="no-scrollbar">
        {items.map((item, idx) => (
          <Link href={item.href} key={idx} style={{ 
            background: 'white', borderRadius: 6, width: 190, minWidth: 190, height: 210,
            display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 12px 12px',
            textDecoration: 'none', color: '#212121', border: '1px solid #e0e0e0'
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <img src={item.img} alt={item.name} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>{item.name}</span>
          </Link>
        ))}
      </div>

      <button style={{ 
        position: 'absolute', right: 10, top: '60%', transform: 'translateY(-50%)',
        background: 'white', border: '1px solid #e0e0e0', width: 44, height: 44, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)', zIndex: 10
      }}>
        <FiChevronRight size={24} color="#212121" />
      </button>
    </section>
  );
}
