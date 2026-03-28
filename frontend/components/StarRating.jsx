'use client';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, size = 12, color = '#388e3c' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color }}>
      {[...Array(fullStars)].map((_, i) => <FaStar key={`f-${i}`} size={size} />)}
      {hasHalf && <FaStarHalfAlt size={size} />}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`e-${i}`} size={size} />)}
    </div>
  );
}
