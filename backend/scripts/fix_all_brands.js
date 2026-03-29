const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const popularBrands = [
  // Mobiles & Tech
  'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Google', 'OPPO', 'Motorola', 'Nothing', 'Realme', 'Sony', 'Acer', 'ASUS', 'HP', 'Dell', 'Lenovo', 'MSI', 'LG', 'Panasonic', 'Philips', 'Bajaj', 'Havells', 'JBL', 'boAt',
  // Fashion & Beauty
  'Puma', 'Nike', 'Adidas', 'Reebok', 'Levi\'s', 'Wrogn', 'Biba', 'Nivea', 'L\'Oreal', 'Maybelline', 'Lakme', 'MAC', 'Plum', 'Garnier', 'Head & Shoulders',
  // Home & Kitchen
  'Pigeon', 'Prestige', 'Milton', 'Cello', 'Bombay Dyeing', 'Spaces', 'Sleepwell',
  // Toys & Sports
  'LEGO', 'Hot Wheels', 'Nerf', 'Fisher-Price', 'Barbie', 'Nivia', 'Cosco', 'Yonex', 'SS', 'SG', 'MRF', 'Decathlon',
  // Groceries (Though already run, just in case)
  'Get Fresh', 'GRANIC FARMS', 'Vedic Wellness', 'PROTIUM', 'Farmley', 'Eatoriyumm', 'True Elements', 'Aashirvaad', 'Nescafe', 'Tata', 'Saffola', 'Maggi', 'Daawat', 'Haldiram\'s'
];

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { brand: 'Premium' },
        { brand: 'Bestseller' },
        { brand: null },
        { brand: '' }
      ]
    }
  });

  let count = 0;
  for (const product of products) {
    let correctedBrand = null;

    // 1. Check strict match against popular dictionary first
    for (const brand of popularBrands) {
      // Check if title starts with the brand (case-insensitive)
      if (product.title.toLowerCase().startsWith(brand.toLowerCase())) {
        correctedBrand = brand;
        break;
      }
    }

    // 2. Fallback: Take the very first word of the title
    if (!correctedBrand) {
      const firstWord = product.title.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
      if (firstWord.length > 1) {
        correctedBrand = firstWord;
      } else {
        // If first word is just 1 letter, take two words
        correctedBrand = product.title.split(' ').slice(0, 2).join(' ').replace(/[^a-zA-Z0-9 ]/g, '');
      }
    }

    if (correctedBrand) {
      await prisma.product.update({
        where: { id: product.id },
        data: { brand: correctedBrand }
      });
      count++;
      console.log(`Updated: "${product.title}" -> Brand: [${correctedBrand}]`);
    }
  }
  
  console.log(`Successfully updated ${count} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
