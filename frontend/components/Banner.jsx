'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const bannerSlides = [
  {
    bg: '#2874f0',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Epic. Just like that. Exclusive launch offers.',
    cta: 'Explore Now',
    href: '/products?category=mobiles',
    accent: '#fb641b',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    bg: '#172337',
    title: 'Top Deals on Electronics',
    subtitle: 'From Smart Televisions to Gaming Laptops.',
    cta: 'Shop Now',
    href: '/products?category=electronics',
    accent: '#2874f0',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
  },
  {
    bg: '#fb641b',
    title: 'Fashion Extravaganza',
    subtitle: 'Get 50-80% Off on Top Brands.',
    cta: 'See offers',
    href: '/products?category=fashion',
    accent: '#ffffff',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = bannerSlides[index];

  return (
    <div
      style={{
        background: slide.bg,
        minHeight: 280,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.5s ease',
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background Image Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundImage: `url(${slide.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.5s ease',
        zIndex: 0
      }} />

      {/* Content Layer (Overlaid if needed, or just the image) */}
      <div style={{ padding: '0 5%', zIndex: 1, color: 'white', maxWidth: '50%' }}>
        {/* We hide the text for now as the Flipkart banner images usually contain text */}
        {/* <h1 style={{ fontSize: 36, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{slide.title}</h1> */}
      </div>

      {/* Navigation dots */}
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 16 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === index ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Left/Right controls */}
      <button
        onClick={() => setIndex((i) => (i - 1 + bannerSlides.length) % bannerSlides.length)}
        style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderTopRightRadius: 4, borderBottomRightRadius: 4, width: 40, height: 80, cursor: 'pointer', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % bannerSlides.length)}
        style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, width: 40, height: 80, cursor: 'pointer', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)' }}
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
}
