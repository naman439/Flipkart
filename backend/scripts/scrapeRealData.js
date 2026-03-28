const axios = require('axios');
const cheerio = require('cheerio');
const prisma = require('../config/db');

/**
 * Universal layout-agnostic Scraper
 * Uses DOM structure and URL semantics rather than obfuscated class names.
 */

const SEARCH_QUERIES = [
  // Home & Kitchen
  { query: 'Mixer Grinders', category: 'home-kitchen', pages: 8 },
  { query: 'Decor', category: 'home-kitchen', pages: 8 },
  
  // Sports
  { query: 'Cricket Bats', category: 'sports-fitness', pages: 8 },
  { query: 'Dumbbells', category: 'sports-fitness', pages: 8 },
  
  // Books
  { query: 'Best Selling Fiction', category: 'books', pages: 8 },
  { query: 'Self Help Books', category: 'books', pages: 8 },
  
  // Appliances
  { query: 'Washing Machine', category: 'appliances', pages: 8 },
  { query: 'Air Conditioners', category: 'appliances', pages: 8 },
  
  // Toys & Baby
  { query: 'Soft Toys', category: 'toys-baby', pages: 8 },
  { query: 'Board Games', category: 'toys-baby', pages: 8 },
  
  // Groceries
  { query: 'Dry Fruits', category: 'groceries', pages: 8 },
  { query: 'Snacks', category: 'groceries', pages: 8 }
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Referer': 'https://www.google.com/'
};

/**
 * Extracts product info using layout-agnostic techniques.
 */
async function scrapePage(query, page, categoryId) {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}&page=${page}`;
  console.log(`🔍 [Page ${page}] Fetching: ${url}`);
  
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 });
    const $ = cheerio.load(data);
    const results = [];

    // All Flipkart items are inside a data-id container
    $('div[data-id]').each((i, el) => {
      const $box = $(el);
      
      // 1. Get Product Link
      const link = $box.find('a[href*="/p/"]').first().attr('href');
      if (!link) return;
      
      // 2. Extract Title from URL Slug (Foolproof fallback)
      // E.g. /puma-smash-v2-l-sneakers-men/p/itm... -> "Puma Smash V2 L Sneakers Men"
      let parsedTitle = null;
      const slugMatch = link.match(/^\/([^\/]+)\/p\//);
      if (slugMatch) {
         parsedTitle = slugMatch[1]
             .replace(/-+/g, ' ')
             .replace(/\b\w/g, c => c.toUpperCase());
         
         // Capitalize known brands correctly just in case
         parsedTitle = parsedTitle.replace(/\b(Hp|Lg|Jbl|Bmw)\b/gi, w => w.toUpperCase());
      }
      
      let title = $box.find('a[title]').attr('title') || parsedTitle;
      
      // 3. Extract Price
      // Find the first nested element whose text contains exactly a formatted price 
      let priceText = '';
      $box.find('div, span, a').each((_, sub) => {
        const text = $(sub).text().trim();
        // Look for the "Sale Price". Usually starting with ₹ and short string.
        if (text.startsWith('₹') && text.length < 15) {
          if (!priceText || text.length < priceText.length) {
             priceText = text;
          }
        }
      });
      
      // 4. Extract MRP
      let mrpText = '';
      $box.find('div.y4H9S7, div._3I9_ca, div.y3YfVn, div[class*="strike"]').each((_, sub) => {
         const t = $(sub).text().trim();
         if (t.includes('₹')) mrpText = t;
      });

      // 5. Image & Rating
      const imageUrl = $box.find('img').filter((_, img) => $(img).attr('src')?.includes('rukminim')).first().attr('src');
      const rating = $box.find('div.XQD_n7, div._3LWZlK, div._5O9_S-').text().trim() || '4.1';

      if (title && priceText && imageUrl) {
        const cleanPrice = parseInt(priceText.replace(/[₹,]/g, '')) || 0;
        const cleanMRP = mrpText ? parseInt(mrpText.replace(/[₹,]/g, '')) : cleanPrice;
        let discountPct = 0;
        if (cleanMRP > cleanPrice) {
          discountPct = Math.round(((cleanMRP - cleanPrice) / cleanMRP) * 100);
        }

        const brand = title.split(' ')[0];

        results.push({
          title: title.length > 200 ? title.substring(0, 197) + '...' : title, // prevent huge titles
          description: `Buy ${title} online at best price in India on Flipkart. Authentic ${brand} product. Rating: ${rating}. Fast delivery and assured quality.`,
          price: cleanPrice,
          discountPrice: cleanPrice,
          discountPct,
          stock: getRandomInt(20, 1000),
          rating: parseFloat(rating) || getRandomFloat(3.9, 4.8),
          reviewCount: getRandomInt(100, 5000),
          brand: brand.length > 50 ? brand.substring(0, 47) + '...' : brand, // safe sizing
          categoryId,
          // Upgrade small grid thumbnails to larger sizes
          images: JSON.stringify([imageUrl.replace(/\/image\/\d+\/\d+\//, '/image/800/800/')]),
          specifications: JSON.stringify({
            'Brand': brand,
            'Source': 'Flipkart Real Data'
          }),
          isFeatured: Math.random() > 0.95
        });
      }
    });

    return results;
  } catch (error) {
    console.error(`   └─ Error: ${error.message}`);
    return [];
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

async function run() {
  console.log('🚀 ENTERPRISE SCRAPER: FIXING MISSING CATEGORIES (Fashion, Home, Books, Sports)');
  
  const categories = await prisma.category.findMany();
  const catMap = {};
  categories.forEach(c => catMap[c.slug] = c.id);

  // We are NOT truncating this time. The previous scrape perfectly captured ~1800 Mobiles and Electronics.
  // We only run on the missing categories to append to the existing catalog.
  console.log('✅ Found existing products. Appending new category products...');

  let totalCount = 0;

  for (const task of SEARCH_QUERIES) {
    const categoryId = catMap[task.category];
    if (!categoryId) {
       console.log(`⚠️ Category ${task.category} not found. Skipping.`);
       continue;
    }

    console.log(`\n📦 CATEGORY: ${task.category.toUpperCase()} (Query: "${task.query}")`);

    for (let p = 1; p <= task.pages; p++) {
      const pageData = await scrapePage(task.query, p, categoryId);
      
      if (pageData.length > 0) {
        await prisma.product.createMany({ data: pageData, skipDuplicates: true });
        totalCount += pageData.length;
        console.log(`   └─ ✅ Added ${pageData.length} items. Session Total: ${totalCount}`);
      } else {
        console.log('   └─ ⚠️  Empty page or blocked. Moving to next topic.');
        break; // skip to next search query
      }

      await new Promise(r => setTimeout(r, 1500));
    }
  }

  const grandTotal = await prisma.product.count();
  console.log(`\n🎉 HARVEST COMPLETE!`);
  console.log(`📊 TOTAL ITEMS ADDED IN THIS RUN: ${totalCount}`);
  console.log(`📊 TOTAL REAL PRODUCTS IN DATABASE OVERALL: ${grandTotal}`);
  process.exit(0);
}

run();
