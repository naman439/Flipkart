const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fetchLiveProductDetails } = require('../../services/flipkartScraper');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const finalTwo = [
  "The Psychology of Money",
  "Atomic Habits"
];

async function downloadImage(url, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const writer = fs.createWriteStream(dest);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function run() {
    console.log('📖 Adding final 2 books to reach exactly 100...');
    const category = await prisma.category.findUnique({ where: { name: 'Books' } });
    
    let added = 0;
    for (const title of finalTwo) {
        console.log(`🔍 Searching and fetching details for: ${title}`);
        const details = await fetchLiveProductDetails(title);
        if (!details.success) {
            console.log(`   ❌ Failed: ${details.error}`);
            continue;
        }

        const productData = details.data;
        const imagesToSave = productData.images.slice(0, 4);

        const product = await prisma.product.create({
            data: {
                title: productData.title || title,
                description: productData.description || 'Premium quality bestseller from Flipkart.',
                price: 299,
                discountPrice: 249,
                discountPct: 15,
                stock: 100,
                rating: 4.8,
                reviewCount: 1000,
                brand: 'Bestseller',
                categoryId: category.id,
                specifications: productData.specifications || {},
                isFeatured: false
            }
        });

        const sanitizedTitle = sanitizeFilename(product.title);
        for (let j = 0; j < imagesToSave.length; j++) {
            const filename = `${sanitizedTitle}_${j}.jpg`;
            const relativePath = `/public/uploads/products/${product.id}/${filename}`;
            const absolutePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'products', String(product.id), filename);

            try {
                await downloadImage(imagesToSave[j], absolutePath);
                await prisma.productImage.create({
                    data: { productId: product.id, imageUrl: relativePath, displayOrder: j }
                });
                if (j === 0) {
                    await prisma.product.update({ where: { id: product.id }, data: { thumbnail: relativePath } });
                }
            } catch (e) {
                console.log(`      ⚠️ Image failed: ${e.message}`);
            }
        }
        added++;
        console.log(`   ✅ Successfully added: ${product.title}`);
    }
    
    const finalCount = await prisma.product.count();
    console.log(`\n🎉 Final Total Count: ${finalCount}`);
    process.exit(0);
}

run();
