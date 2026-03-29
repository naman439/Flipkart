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
    console.log('⚖️  Ensuring exactly 10 products per category...');
    const categories = await prisma.category.findMany();
    
    for (const cat of categories) {
        let currentCount = await prisma.product.count({ where: { categoryId: cat.id } });
        console.log(`📂 Category: ${cat.name} (Current: ${currentCount})`);
        
        if (currentCount < 10) {
            const needed = 10 - currentCount;
            console.log(`🔍 Searching for ${needed} more for ${cat.name}...`);
            const search = await searchFlipkart(cat.name + " bestsellers");
            
            if (search.success) {
                let added = 0;
                for (const item of search.data) {
                    if (added >= needed) break;
                    
                    // Avoid duplicates if possible (check title)
                    const exists = await prisma.product.findFirst({ where: { title: item.title } });
                    if (exists) continue;

                    console.log(`   ✨ Adding: ${item.title}`);
                    const details = await fetchLiveProductDetails(item.title);
                    if (!details.success) {
                        console.log(`      ⚠️ Failed scraper for ${item.title}`);
                        continue;
                    }

                    const productData = details.data;
                    const imagesToSave = productData.images.slice(0, 4);

                    try {
                        const product = await prisma.product.create({
                            data: {
                                title: item.title,
                                description: productData.description || `Premium ${cat.name} product.`,
                                price: parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 499,
                                discountPrice: parseFloat(item.discountPrice?.replace(/[^0-9.]/g, '')) || 399,
                                discountPct: 20,
                                stock: 100,
                                rating: parseFloat(item.rating) || 4.2,
                                reviewCount: 50,
                                brand: cat.name,
                                categoryId: cat.id,
                                specifications: productData.specifications || {},
                                isFeatured: false
                            }
                        });

                        const sanitizedTitle = sanitizeFilename(product.title);
                        for (let j = 0; j < imagesToSave.length; j++) {
                            const filename = `${sanitizedTitle}_${j}.jpg`;
                            const relativePath = `/public/uploads/products/${product.id}/${filename}`;
                            const absolutePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'products', String(product.id), filename);

                            await downloadImage(imagesToSave[j], absolutePath);
                            await prisma.productImage.create({
                                data: { productId: product.id, imageUrl: relativePath, displayOrder: j }
                            });
                            if (j === 0) {
                                await prisma.product.update({ where: { id: product.id }, data: { thumbnail: relativePath } });
                            }
                        }
                        added++;
                        console.log(`      ✅ [${added}/${needed}] Added.`);
                    } catch (err) {
                        console.log(`      💥 DB Error: ${err.message}`);
                    }
                }
            }
        }
    }
    
    const finalCount = await prisma.product.count();
    console.log(`\n🎉 Final Total Count: ${finalCount}`);
    process.exit(0);
}

run();
