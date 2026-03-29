'use client';

import React, { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * ImageGrid - Displays an interactive product image gallery.
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs.
 */
export default function ImageGrid({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[selectedIndex];

  // Utility to handle local vs remote image URLs
  const getImageUrl = (img) => {
    if (!img) return '';
    return img.startsWith('/') && process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${img}` 
      : img;
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Featured Large Image */}
      <div 
        onClick={() => setIsLightboxOpen(true)}
        style={{ 
          position: 'relative',
          border: '1px solid #f0f0f0', 
          borderRadius: 4, 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          aspectRatio: '1 / 1.1',
          cursor: 'zoom-in',
          padding: 8
        }}
      >
        <img 
          src={getImageUrl(currentImage)} 
          alt={`Product view ${selectedIndex + 1}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain'
          }} 
        />
        
        {/* Navigation Arrows for the Main Image (Optional but helpful) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}
            >
              <FiChevronLeft />
            </button>
            <button 
              onClick={handleNext}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedIndex(idx)}
              style={{ 
                minWidth: 64,
                width: 64,
                height: 64,
                border: selectedIndex === idx ? '2px solid #2874f0' : '1px solid #f0f0f0', 
                borderRadius: 4, 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                cursor: 'pointer',
                opacity: selectedIndex === idx ? 1 : 0.7,
                transition: 'all 0.2s'
              }}
            >
              <img 
                src={getImageUrl(img)} 
                alt={`Thumbnail ${idx + 1}`} 
                style={{ width: '85%', height: '85%', objectFit: 'contain' }} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Modal Overlay */}
      {isLightboxOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.9)', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 40
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            onClick={() => setIsLightboxOpen(false)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <FiX size={32} />
          </button>

          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <img 
              src={getImageUrl(currentImage)} 
              alt="Full Size View" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} 
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  style={{ position: 'absolute', left: -50, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  <FiChevronLeft size={48} />
                </button>
                <button 
                  onClick={handleNext}
                  style={{ position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  <FiChevronRight size={48} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
