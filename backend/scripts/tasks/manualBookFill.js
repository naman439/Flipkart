const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fetchLiveProductDetails } = require('../../services/flipkartScraper');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const bookUrls = [
  "https://www.flipkart.com/manorama-year-book-2024-hindi-latest-updated-original-india-s-largest-selling-gk-update-hindi/p/itm754d08304f05b?pid=9789359598611",
  "https://www.flipkart.com/eddie-jaku-2024-biography-new-best-selling-auschwitz-memoir/p/itm537b60c325b7a?pid=9789363119581",
  "https://www.flipkart.com/gat-b-biotechnology-2026-previous-year-questions-book-2020-2024-3-mock-tests-topic-wise-sorted-pyqs-detailed-explanation-best-selling-b-iit-jam-tifr-cuet-pg-examinations-india-ifas-publications/p/itm491c66fc1baa3?pid=9789348798732",
  "https://www.flipkart.com/iit-jam-physics-books-2026-set-2-books-previous-year-solved-papers-practice-question-bank-topic-wise-sorted-pyqs-20052024-1600-questions-best-selling-book-set-jam-tifr-gate-set-cuet-pg-all-m-sc-entrance-exams-ifas-publications/p/itm552fb0127624f?pid=9788198881137",
  "https://www.flipkart.com/tifr-physics-gate-books-2026-set-2-books-chapter-wise-pyqs-detailed-explanations-2025-solved-papers-best-selling-guide-iit-jam-cuet-jest-csir-ugc-net-exam-preparation-2010-2024-concept-based-solutions-topic-wise-sent-segmentation/p/itma5b4a39a5c0f5?pid=9789349975828",
  "https://www.flipkart.com/trust-hard-work-not-destiny-best-selling-motivational-book-ambition-success-dr-ramesh-pokhriyal-nishank/p/itm8f7063d5e8201?pid=RBKHEEAMHF3RWWXT",
  "https://www.flipkart.com/think-grow-rich-richest-man-babylon-hindi-combo-2-best-selling-books/p/itm61bacd9641d4c?pid=9788119369584"
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
    console.log('📖 Manually filling 7 books from specific URLs...');
    const category = await prisma.category.findUnique({ where: { name: 'Books' } });
    
    let added = 0;
    for (const url of bookUrls) {
        console.log(`🔗 Scrapping URL: ${url}`);
        const details = await fetchLiveProductDetails(url);
        if (!details.success) {
            console.log(`   ❌ Failed: ${details.error}`);
            continue;
        }

        const productData = details.data;
        const imagesToSave = productData.images.slice(0, 4);

        const product = await prisma.product.create({
            data: {
                title: productData.title || "Manual Book Entry",
                description: productData.description || 'Premium quality book from Flipkart.',
                price: 499,
                discountPrice: 349,
                discountPct: 30,
                stock: 100,
                rating: 4.5,
                reviewCount: 150,
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
        console.log(`   ✅ [${added}/7] Added: ${product.title}`);
    }
    
    const finalCount = await prisma.product.count();
    console.log(`\n🎉 Restoration Complete! Total products: ${finalCount}`);
    process.exit(0);
}

run();
