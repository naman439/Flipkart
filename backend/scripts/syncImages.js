const axios = require('axios');
const cheerio = require('cheerio');
const prisma = require('../config/db');

/**
 * Scrapes real product images from Flipkart based on a query.
 * @param {string} query The product title/brand to search for.
 * @returns {Promise<string[]>} Array of image URLs.
 */
async function scrapeFlipkartImages(query) {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    const $ = cheerio.load(data);
    const images = [];

    // Flipkart uses different layouts. We try to catch images from both grid and list views.
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      // Look for rukminim URLs which are Flipkart's CDN
      if (src && src.includes('rukminim')) {
        // Upgrade to higher resolution if possible by replacing dimension segments
        // Standard formats: /image/312/312/... or /image/416/416/...
        const hiRes = src.replace(/\/image\/\d+\/\d+\//, '/image/800/800/');
        images.push(hiRes);
      }
    });

    // Return unique images, capped at 10
    return [...new Set(images)].slice(0, 10);
  } catch (error) {
    console.error(`Scraping failed for "${query}":`, error.message);
    return [];
  }
}

/**
 * Updates all products in the database with real images from Flipkart.
 */
async function syncProductImages() {
  console.log('🚀 Starting Universal Image Sync...');
  
  const products = await prisma.product.findMany({
    select: { id: true, title: true, brand: true }
  });

  console.log(`📦 Found ${products.length} products to process.`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const searchQuery = `${product.brand} ${product.title}`;
    
    console.log(`[${i + 1}/${products.length}] Fetching images for: ${searchQuery}`);
    
    const images = await scrapeFlipkartImages(searchQuery);
    
    if (images.length > 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(images) }
      });
      console.log(`✅ Updated ${images.length} images.`);
    } else {
      console.log(`❌ No images found for ${product.title}`);
    }

    // Add a small delay to avoid being blocked
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('✨ Image sync complete!');
}

if (require.main === module) {
  syncProductImages()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

module.exports = { scrapeFlipkartImages, syncProductImages };
