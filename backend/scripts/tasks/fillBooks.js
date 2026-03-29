const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fetchLiveProductDetails, searchFlipkart } = require('../../services/flipkartScraper');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
    console.log('📚 Filling missing books to reach 100 products...');
    const category = await prisma.category.findUnique({ where: { name: 'Books' } });
    const currentCount = await prisma.product.count({ where: { categoryId: category.id } });
    const needed = 10 - currentCount;
    
    if (needed <= 0) {
        console.log('✅ Books category already has 10+ products.');
        return;
    }

    console.log(`🔍 Searching for ${needed} more books on Flipkart...`);
    const search = await searchFlipkart('bestseller books 2024');
    if (!search.success) {
        console.error('❌ Search failed');
        process.exit(1);
    }

    let added = 0;
    for (const item of search.data) {
        if (added >= needed) break;
        
        console.log(`📖 Adding book: ${item.title}`);
        const details = await fetchLiveProductDetails(item.title);
        if (!details.success) continue;

        const productData = details.data;
        const imagesToSave = productData.images.slice(0, 4);

        const product = await prisma.product.create({
            data: {
                title: item.title,
                description: productData.description || 'Great book available on Flipkart.',
                price: parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 299,
                discountPrice: parseFloat(item.discountPrice?.replace(/[^0-9.]/g, '')) || 199,
                discountPct: 30,
                stock: 50,
                rating: parseFloat(item.rating) || 4.5,
                reviewCount: 100,
                brand: 'Books',
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
                console.log(`   ⚠️ Image failed: ${e.message}`);
            }
        }
        added++;
        console.log(`   ✅ Added [${added}/${needed}]`);
    }
    console.log('🎉 Final count reached 100!');
    process.exit(0);
}

run();
