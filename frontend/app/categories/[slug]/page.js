'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProducts } from '@/services/api/products.api';
import CategorySubNav from '@/components/clp/CategorySubNav';
import AdBannerSlider from '@/components/clp/AdBannerSlider';
import ThemedProductRow from '@/components/clp/ThemedProductRow';
import ProductCard from '@/components/ProductCard';
import { Spinner } from '@/components/LoadingSkeleton';

export default function CategoryLandingPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Capitalize for display
  const displayTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        // Fetch a large batch of products for this specific category (max 60 for CLP staging)
        const res = await getProducts({ category: slug, page: 1, limit: 60 });
        setProducts(res.data || []);
      } catch (err) {
        console.error("CLP fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={40} /></div>;
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', minHeight: '60vh' }}>
        <h2>No products found for {displayTitle}</h2>
      </div>
    );
  }

  // Segment products for CLP presentation
  // Top Deals: High discount
  const topDeals = [...products].sort((a, b) => b.discountPct - a.discountPct).slice(0, 8);
  // Trending Tech / Fashion / Hits: Highest ratings
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  // Remaining items
  const popularGrid = [...products].slice(16, 40);

  // Dynamic titles/colors based on slug
  let row1Title = "Summer specials on sale";
  let row1Bg = "#fb641b"; // Flipkart orange-ish/pink style
  let row2Title = "Trending Right Now";
  let row2Bg = "#2874f0"; // Flipkart blue

  if (slug === 'mobiles') {
    row1Title = "Trending in Mobiles";
    row1Bg = "#e3f2fd";
    row2Title = "Best Sellers";
    row2Bg = "#f5f7fa";
  } else if (slug === 'electronics') {
    row1Title = "Trending tech";
    row1Bg = "#e3f2fd";  // Light blue
    row2Title = "Exclusive Student Deals";
    row2Bg = "#fce4ec";  // Light pink
  } else if (slug === 'fashion') {
    row1Title = "Hottest Trends For Summer";
    row1Bg = "#f1f8e9";  // Light green
    row2Title = "Shop for loved ones";
    row2Bg = "#fff3e0";  // Light orange
  } else if (slug === 'furniture') {
    row1Title = "Deal of the day";
    row1Bg = "#e8f5e9";
    row2Title = "New launches";
    row2Bg = "#bbdefb";
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', paddingBottom: 40 }}>
      <div className="main-container" style={{ background: 'white', paddingBottom: 20 }}>
        
        {/* 1. Subcategory Circular Nav */}
        <CategorySubNav categorySlug={slug} />

        {/* 2. CLP specific Bank/Sponsor Banners */}
        <AdBannerSlider categorySlug={slug} />

        {/* 3. Themed Rows Segmented by Discount/Rating */}
        <ThemedProductRow title={row1Title} products={topDeals} bgColor={row1Bg} />
        
        <div style={{ margin: '12px 16px' }}>
          <AdBannerSlider categorySlug="default" /> {/* Mid-page sponsor inject */}
        </div>

        <ThemedProductRow title={row2Title} products={topRated} bgColor={row2Bg} />

        <div style={{ margin: '24px 16px 0 16px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#212121', marginBottom: 16 }}>More in {displayTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {popularGrid.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
