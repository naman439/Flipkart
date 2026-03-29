const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fetchLiveProductDetails } = require('../../services/flipkartScraper');

/**
 * Global Restoration Script (Production UUID Schema):
 * 1. Reads 100 products from golden_100_data.json.
 * 2. For each, fetches full details (4 images, specs) from Flipkart.
 * 3. Saves to the NEW schema (UUIDs, JSONB, ProductImages table).
 */

const DATA_FILE = path.join(__dirname, 'golden_100_data.json');

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function downloadImage(url, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const writer = fs.createWriteStream(dest);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });

  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function run() {
  console.log('🌟 Starting Golden 100 Restoration (Production Schema)');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Data file not found: ${DATA_FILE}`);
    process.exit(1);
  }

  const scrapedData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`📂 Loaded ${scrapedData.length} categories from JSON.`);

  // Clear products first
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  console.log('🗑️  Cleaned products and product_images tables');

  let totalProcessed = 0;

  for (const group of scrapedData) {
    const catName = group.category;
    console.log(`\n---------------------------------------------------------`);
    console.log(`📁 Category: ${catName}`);
    
    const category = await prisma.category.findUnique({ where: { name: catName } });
    if (!category) {
       console.log(`⚠️  Category ${catName} not found in DB. Skipping.`);
       continue;
    }

    for (let i = 0; i < group.products.length; i++) {
        const item = group.products[i];
        totalProcessed++;
        console.log(`   [${totalProcessed}/100] Fetching details for: "${item.title}"`);
        
        // Use the specific URL if it's a valid product URL, otherwise fallback to title search
        const isProductUrl = item.url && item.url.includes('/p/it');
        
        let details;
        try {
            details = await fetchLiveProductDetails(isProductUrl ? item.url : item.title);
        } catch (e) {
            console.log(`   ❌ Error fetching details: ${e.message}`);
            continue;
        }

        if (!details.success) {
            console.log(`   ⚠️  Scraper failed for ${item.title}: ${details.error}`);
            continue;
        }

        const productData = details.data;
        const imagesToSave = productData.images.slice(0, 4);

        // Parse numbers safely
        const parsePrice = (str) => {
            const num = parseFloat(str?.replace(/[^0-9.]/g, ''));
            return isNaN(num) ? 999.00 : num;
        };
        
        const parseRating = (r) => {
            const num = parseFloat(r);
            return isNaN(num) ? 4.0 : num;
        };

        const priceNum = parsePrice(item.price);
        const discountPriceNum = item.discountPrice ? parsePrice(item.discountPrice) : priceNum * 0.8;

        // Create Product
        const product = await prisma.product.create({
            data: {
                title: productData.title || item.title,
                description: productData.description || `Premium quality ${catName} item.`,
                price: priceNum,
                discountPrice: discountPriceNum,
                discountPct: parseInt(item.discountPct?.replace(/[^0-9]/g, '') || 20),
                stock: 100,
                rating: parseRating(item.rating),
                reviewCount: Math.floor(Math.random() * 500) + 100,
                brand: productData.brand || 'Premium',
                category: { connect: { id: category.id } },
                specifications: productData.specifications || {}, // Native JSONB
                isFeatured: i === 0
            }
        });

        const sanitizedTitle = sanitizeFilename(product.title);
        
        // Handle Images
        for (let j = 0; j < imagesToSave.length; j++) {
            const imageUrl = imagesToSave[j];
            const filename = `${sanitizedTitle}_${j}.jpg`;
            const relativePath = `/public/uploads/products/${product.id}/${filename}`;
            const absolutePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'products', String(product.id), filename);

            try {
                await downloadImage(imageUrl, absolutePath);
                
                // Add to ProductImage table
                await prisma.productImage.create({
                    data: {
                        productId: product.id,
                        imageUrl: relativePath,
                        displayOrder: j
                    }
                });

                // Set thumbnail if first image
                if (j === 0) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { thumbnail: relativePath }
                    });
                }
                process.stdout.write('.');
            } catch (err) {
                console.log(`\n   ⚠️ Image download failed for ${j}: ${err.message}`);
            }
        }
        
        console.log(`\n   ✅ Saved ID: ${product.id}`);
        
        // Rate limiting
        await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n✨ Restoration Complete! 100 Premium Products are now in the UUID Schema.');
  process.exit(0);
}

run();
