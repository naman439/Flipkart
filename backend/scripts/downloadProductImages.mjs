import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_ROOT = path.join(PUBLIC_DIR, 'images', 'products');

async function downloadImage(url, filePath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000,
    });
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to download from ${url}: ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log('🚀 Starting Product Image Localization...');
  
  if (!fs.existsSync(IMAGE_ROOT)) {
    fs.mkdirSync(IMAGE_ROOT, { recursive: true });
  }

  const products = await prisma.product.findMany({
    include: { category: true }
  });

  console.log(`📦 Found ${products.length} products. Proceeding to download 4 images each...`);

  let totalDownloaded = 0;

  for (const product of products) {
    const productDir = path.join(IMAGE_ROOT, product.id);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    // Clean up existing database images for this product as requested
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    });

    const newImages = [];
    const keywords = `${product.category.slug},${product.brand || ''},${product.title.split(' ')[0]}`.replace(/[^a-zA-Z,]/g, '');

    for (let i = 1; i <= 4; i++) {
      const filename = `${i}.jpg`;
      const filePath = path.join(productDir, filename);
      const dbPath = `/images/products/${product.id}/${filename}`;
      
      // We use lorempixel/loremflickr or similar with a 'lock' or random seed for variety
      const url = `https://loremflickr.com/640/480/${keywords}?lock=${product.id.slice(0, 4)}-${i}`;

      try {
        console.log(`📥 [${product.title.substring(0, 20)}...] Downloading image ${i}/4`);
        await downloadImage(url, filePath);
        
        newImages.push({
          imageUrl: dbPath,
          displayOrder: i - 1,
          productId: product.id
        });
        totalDownloaded++;
      } catch (e) {
        console.warn(`⚠️ Skipping image ${i} for product ${product.id} due to error.`);
      }
    }

    if (newImages.length > 0) {
      await prisma.productImage.createMany({
        data: newImages
      });
    }
  }

  console.log(`\n✅ Finished! Total images downloaded and localized: ${totalDownloaded}`);
}

main()
  .catch(e => {
    console.error('💥 Fatal error in script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
