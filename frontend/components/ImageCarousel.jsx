'use client';

import { useState } from 'react';

export default function ImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div style={{ display: 'flex', gap: 16, height: 450 }}>
      {/* Thumbnails */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 64, overflowY: 'auto' }}>
        {images.map((img, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setActive(idx)}
            style={{
              width: 64,
              height: 64,
              border: `2px solid ${active === idx ? 'var(--fk-blue)' : 'var(--border-color)'}`,
              borderRadius: 2,
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white'
            }}
          >
            <img src={img} alt={`Thumb ${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        ))}
      </div>

      {/* Main Display */}
      <div style={{ flex: 1, border: '1px solid #f0f0f0', borderRadius: 2, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', position: 'relative', overflow: 'hidden' }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Product View ${idx + 1}`}
            style={{ 
              position: 'absolute',
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain',
              opacity: active === idx ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: active === idx ? 'auto' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
