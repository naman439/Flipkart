'use client';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const items = [
  { name: 'Mosquito Killers', href: '/products?search=mosquito', img: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mosquito-killer-repllent-mat/1/r/v/8-9-mosquito-killer-rechargeable-racket-bat-with-led-uv-light-original-imaghfz4zhzx2h6x.jpeg' },
  { name: 'True Wireless', href: '/products?search=wireless', img: 'https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/p/r/z/envy-shopy1x-original-imaghx8zyygygzuz.jpeg' },
  { name: 'Mobiles', href: '/products?category=mobiles', img: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg' },
  { name: 'Water Bottles & Flasks', href: '/products?search=bottle', img: 'https://rukminim2.flixcart.com/image/416/416/xif0q/water-bottle/w/4/5/750-stainless-steel-fridge-water-bottle-silver-pack-of-3-original-imah4ggtuhhh8g4q.jpeg' },
  { name: "Men's Vests", href: '/products?search=vest', img: 'https://rukminim2.flixcart.com/image/416/416/xif0q/vest/2/y/x/s-8905206254707-jockey-original-imaghkfz2f8gqgxz.jpeg' },
  { name: 'Laptops', href: '/products?category=electronics', img: 'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/v/d/b/15-fc0028au-thin-and-light-laptop-hp-original-imagp8nzgfbbgg8q.jpeg' },
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
