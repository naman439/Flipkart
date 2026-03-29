const fs = require('fs');
const path = require('path');
const axios = require('axios');
const prisma = require('../config/db');
const { fetchLiveProductDetails } = require('../services/flipkartScraper');

/**
 * Maintenance script to download and name images based on product names.
 * Ensures at least 50 products per category have at least 4 images.
 * Usage: node scripts/downloadImages.js [--force-rescrape]
 */

const args = process.argv.slice(2);
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;
const forceRescrape = args.includes('--force-rescrape');

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function downloadImage(url, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const writer = fs.createWriteStream(dest);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function run() {
  console.log('🚀 Starting Full Catalog SEO-Friendly Enrichment & Localization');
  console.log('📦 Process: All Products in Database');

  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' }
  });

  console.log(`📂 Found ${products.length} total products to process.`);

  let totalProductsProcessed = 0;
  let totalImagesDownloaded = 0;

  for (let i = 0; i < products.length; i++) {
    if (limit && totalProductsProcessed >= limit) break;
    const product = products[i];
        let images = [];
        try {
          images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
        } catch (e) { images = []; }

        let specs = {};
        try {
          specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : (product.specifications || {});
        } catch (e) { specs = {}; }

        // Logic check: Do we need more images or better data?
        const needsEnrichment = images.length < 4 || Object.keys(specs).length < 5 || forceRescrape;

        if (needsEnrichment) {
            console.log(`   🔍 [${i+1}/${products.length}] Enriching: "${product.title}" (ID: ${product.id})`);
            const scout = await fetchLiveProductDetails(product.brand ? `${product.brand} ${product.title}` : product.title);
            if (scout.success) {
                images = scout.data.images.length > 0 ? scout.data.images : images;
                specs = scout.data.specifications;
                // Update description too if it was dummy
                if (product.description.includes("Buy") && scout.data.description) {
                    product.description = scout.data.description;
                }
            } else {
                console.log(`   ⚠️ Scrape failed for ${product.id}: ${scout.error}`);
            }
        } else {
            console.log(`   📸 [${i+1}/${products.length}] Localizing: "${product.title}" (ID: ${product.id})`);
        }

        const sanitizedTitle = sanitizeFilename(product.title);
        const localPaths = [];

        // Download and Rename
        for (let j = 0; j < images.length; j++) {
            const imageUrl = images[j];
            if (!imageUrl.startsWith('http')) continue; // already local? skipped in this clean run

            const ext = '.jpg'; // Flipkart images are usually jpg/webp
            const filename = `${sanitizedTitle}_${j}${ext}`;
            const relativePath = `/public/uploads/products/${product.id}/${filename}`;
            const absolutePath = path.join(__dirname, '..', 'public', 'uploads', 'products', String(product.id), filename);

            try {
                await downloadImage(imageUrl, absolutePath);
                localPaths.push(relativePath);
                totalImagesDownloaded++;
                process.stdout.write('.');
            } catch (err) {
                console.log(`\n   ⚠️ Download failed for img ${j}: ${err.message}`);
            }
        }

        // Update DB
        if (localPaths.length > 0) {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    images: JSON.stringify(localPaths),
                    specifications: JSON.stringify(specs),
                    description: product.description
                }
            });
            totalProductsProcessed++;
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 1000));
    }

  console.log('\n\n✨ All Done!');
  console.log(`📊 Total Products Localized: ${totalProductsProcessed}`);
  console.log(`📊 Total Images Downloaded: ${totalImagesDownloaded}`);
  process.exit(0);
}

run();
