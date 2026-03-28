const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const cheerio = require('cheerio');

const categories = [
  { name: 'Mobiles', slug: 'mobiles', query: 'smartphones' },
  { name: 'Electronics', slug: 'electronics', query: 'electronics' },
  { name: 'Fashion', slug: 'fashion', query: 'clothing' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', query: 'home decor' },
  { name: 'Appliances', slug: 'appliances', query: 'home appliances' },
  { name: 'Beauty', slug: 'beauty', query: 'beauty products' },
  { name: 'Toys & Baby', slug: 'toys-baby', query: 'toys' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', query: 'sports' },
  { name: 'Books', slug: 'books', query: 'books' },
  { name: 'Groceries', slug: 'groceries', query: 'grocery' }
];

async function scrapeFlipkart(query) {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      }
    });
    const $ = cheerio.load(data);
    const results = [];

    $('div[data-id], ._1sdM6S, ._4ddY3M').each((i, el) => {
      const card = $(el);
      
      // Try to find title in various classes or title attribute
      let title = card.find('.KzD7ly, .s1Q9rs, ._4rR01T, .RG5Slk, .atJtCj, ._2WkVRV, ._3W_S7H, .W_S7H, .pIpigb, ._1W9f5c').first().text().trim();
      if (!title) {
        title = card.find('a[title]').first().attr('title');
      }
      
      if (!title || title.length < 5) return;

      // Brand extraction - usually first word or from a specific class
      const brand = card.find('.bLCLBY, .p0C73x, ._2WkVRV, ._2B_pmu').first().text().trim() || title.split(' ')[0];

      // Robust price extraction: look for all strings with ₹
      const priceFinder = card.find('.hZ3P6w, ._30jeq3, .Nx9Wqj, .QiMO5r, ._25b6yR, .fb4uj3, ._16Jk6d');
      let prices = [];
      priceFinder.each((j, pEl) => {
        const text = $(pEl).text();
        const parts = text.split('₹');
        for (const part of parts) {
          const clean = part.replace(/[^\d]/g, '');
          if (clean && clean.length > 1 && clean.length < 8) {
            prices.push(parseInt(clean));
          }
        }
      });

      // Fallback: search all text for ₹
      if (prices.length === 0) {
        card.find('*').each((j, pEl) => {
          const t = $(pEl).text();
          if (t.includes('₹')) {
            const parts = t.split('₹');
            for (const part of parts) {
               const clean = part.replace(/[^\d]/g, '');
               if (clean && clean.length > 1 && clean.length < 8) {
                 prices.push(parseInt(clean));
               }
            }
          }
        });
      }

      if (prices.length === 0) return;

      prices = [...new Set(prices)].sort((a, b) => b - a); // [MRP, Discounted]
      const mrp = prices[0];
      const currentPrice = prices.length > 1 ? prices[prices.length - 1] : prices[0];
      const discountPct = mrp > currentPrice ? Math.round(((mrp - currentPrice) / mrp) * 100) : 0;

      const images = [];
      card.find('img').each((j, img) => {
        const src = $(img).attr('src');
        if (src && src.includes('rukminim')) {
          images.push(src.replace(/\/image\/\d+\/\d+\//, '/image/800/800/'));
        }
      });

      const isOutOfStock = card.text().toLowerCase().includes('sold out') || 
                          card.text().toLowerCase().includes('coming soon') || 
                          card.text().toLowerCase().includes('out of stock');
      
      results.push({
        title,
        brand,
        price: mrp,
        discountPrice: currentPrice,
        discountPct,
        stock: isOutOfStock ? 0 : Math.floor(Math.random() * 100) + 10,
        rating: parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 5000) + 100,
        images: JSON.stringify([...new Set(images)].slice(0, 5)),
        description: `Authentic product fetched directly from Flipkart. ${title} is curated for quality and value.`,
        specifications: JSON.stringify({ "Authenticity": "Verified", "Condition": "New" })
      });
    });

    return results;
  } catch (error) {
    console.error(`Error scraping ${query}:`, error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting Universal Real-World Data Sync...');

  // Reset core tables
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️ Cleared existing data.');

  for (const cat of categories) {
    console.log(`📡 Fetching real data for Category: ${cat.name}...`);
    
    // Check if category exists or create it
    let record = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!record) {
      record = await prisma.category.create({
        data: { name: cat.name, slug: cat.slug, imageUrl: '' }
      });
    }

    // Empowerment: For Mobiles, fetch multiple brand queries
    const queries = cat.slug === 'mobiles' 
      ? ['iphone 15', 'samsung galaxy s24', 'google pixel 8', 'oneplus 12', 'poco x6', 'realme 12 pro']
      : [cat.query];

    for (const q of queries) {
      console.log(`🔍 Scraping logic for: ${q}...`);
      const products = await scrapeFlipkart(q);
      console.log(`✅ Found ${products.length} products for query: ${q}`);

      if (products.length > 0) {
        const data = products.map(p => ({ ...p, categoryId: record.id }));
        // Use create instead of createMany if needed or handle duplicates
        for (const pd of data) {
           try {
             await prisma.product.create({ data: pd });
           } catch (e) {
             // Skip duplicates or log
           }
        }
        console.log(`🚀 Seeded products for ${q}.`);
      }
      // Small delay between scrapes
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log('✨ Real-world data sync complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
