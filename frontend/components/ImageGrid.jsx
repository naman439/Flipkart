import React from 'react';

export default function ImageGrid({ images = [] }) {
  if (!images.length) return null;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: 12, 
      width: '100%'
    }}>
      {images.map((img, idx) => (
        <div 
          key={idx} 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4, 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            aspectRatio: '1 / 1.1' // Slightly taller than square, matching Flipkart
          }}
        >
          <img 
            src={img.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${img}` : img} 
            alt={`Product view ${idx + 1}`} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }} 
          />
        </div>
      ))}
    </div>
  );
}
