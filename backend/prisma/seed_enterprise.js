/**
 * Enterprise-Scale Database Seed Script
 * Generates ~840 products (6 categories × 7 brands/category × 20 products/brand)
 * optimized for fast seeding with high-quality visual data.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png' },
  { name: 'Electronics', slug: 'electronics', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg' },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Sports', slug: 'sports', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
];

const DATA_TEMPLATES = {
  'mobiles': {
    brands: ['Samsung', 'Apple', 'OnePlus', 'Google', 'Redmi', 'Vivo', 'Realme'],
    titles: ['Galaxy Edge', 'iPhone Ultra', 'OnePlus Pro', 'Pixel Pro', 'Redmi Note', 'V-Series Neo', 'Realme Neo'],
    adjectives: ['5G', 'Pro', 'Max', 'Ultra', 'Plus', 'Edition', 'Lite'],
    colors: ['Midnight Black', 'Pearl White', 'Ocean Blue', 'Titanium Gray', 'Gold', 'Silver'],
    basePrice: 15000, maxPrice: 150000,
    specs: { 'RAM': ['8GB', '12GB', '16GB'], 'Storage': ['128GB', '256GB', '512GB', '1TB'], 'Display': ['6.1" OLED', '6.7" AMOLED', '6.8" QHD+'] },
    imageUrls: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1574758666731-3011304aa32d?w=600'
    ]
  },
  'electronics': {
    brands: ['Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Apple', 'Samsung'],
    titles: ['Bravia Smart', 'Inspiron Lat', 'Pavilion Gam', 'ThinkPad Pro', 'ROG Zephyrus', 'MacBook Air', 'Crystal UHD'],
    adjectives: ['Premium', 'Advanced', 'Ultra HD', 'Next Gen', 'Classic', 'Pro', 'Studio'],
    colors: ['Silver', 'Black', 'Gray', 'White'],
    basePrice: 20000, maxPrice: 200000,
    specs: { 'Processor': ['i5', 'i7', 'M2', 'M3'], 'Memory': ['16GB', '32GB'], 'GPU': ['Integrated', 'RTX 4060', 'RTX 4070'] },
    imageUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'
    ]
  },
  'fashion': {
    brands: ['Levi\'s', 'Puma', 'W', 'Fastrack', 'Adidas', 'Nike', 'Zara'],
    titles: ['Slim Fit Jeans', 'Running Shoes', 'Ethnic Kurta', 'Analog Watch', 'Track Pants', 'Air Max', 'Casual Shirt'],
    adjectives: ['Premium', 'Comfort', 'Sporty', 'Urban', 'Classic', 'Exclusive', 'Daily'],
    colors: ['Blue', 'Black', 'White', 'Red', 'Gray', 'Navy'],
    basePrice: 999, maxPrice: 15000,
    specs: { 'Material': ['Cotton', 'Denim', 'Polyester', 'Leather'], 'Size': ['S', 'M', 'L', 'XL', 'UK 8', 'UK 9'], 'Season': ['Summer', 'Winter', 'All-Year'] },
    imageUrls: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600',
      'https://images.unsplash.com/photo-1514489022916-35bbdd9d45be?w=600',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
    ]
  },
  'home-kitchen': {
    brands: ['Instant Pot', 'Dyson', 'Philips', 'IKEA', 'Prestige', 'Butterfly', 'Pigeon'],
    titles: ['Pressure Cooker', 'Cordless Vacuum', 'Pop-Up Toaster', 'Shelf Unit', 'Kettle', 'Mixer Grinder', 'Frying Pan'],
    adjectives: ['High-Power', 'Heavy Duty', 'Modern', 'Compact', 'Pro', 'Classic', 'Value'],
    colors: ['Silver', 'Black', 'White', 'Red'],
    basePrice: 1500, maxPrice: 50000,
    specs: { 'Capacity': ['1.5L', '2L', '5L', '10L'], 'Power': ['500W', '750W', '1000W'], 'Material': ['Stainless Steel', 'Plastic', 'Glass'] },
    imageUrls: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=600',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'
    ]
  },
  'books': {
    brands: ['Penguin', 'Jaico', 'April Press', 'Prentice Hall', 'Oxford', 'HarperCollins', 'Scholastic'],
    titles: ['Atomic Habits', 'The Wealthy Life', 'Rich Mindset', 'Clean Code', 'Mastery', 'Historical Epic', 'Future Vision'],
    adjectives: ['Bestseller', 'Enhanced', 'Classic', 'Illustrated', 'Limited Ed.', 'Hardcover', 'Paperback'],
    colors: ['Modern', 'Vintage', 'Artistic'],
    basePrice: 299, maxPrice: 5000,
    specs: { 'Language': ['English', 'Hindi'], 'Pages': ['200', '350', '500'], 'Genre': ['Fiction', 'Self-Help', 'Tech', 'Biography'] },
    imageUrls: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      'https://images.unsplash.com/photo-1549439602-43bbcb62588a?w=600',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
    ]
  },
  'sports': {
    brands: ['Decathlon', 'Cosco', 'Nivia', 'Boldfit', 'Lifelong', 'Yonex', 'Speedo'],
    titles: ['Yoga Mat', 'Cricket Bat', 'Football Pro', 'Resistance Set', 'Exercise Bike', 'Badminton Racket', 'Swim Goggles'],
    adjectives: ['Pro', 'Sturdy', 'Elite', 'Performance', 'Comfort', 'Advanced', 'Tough'],
    colors: ['Blue', 'Neon Black', 'Orange', 'Red', 'White'],
    basePrice: 499, maxPrice: 25000,
    specs: { 'Level': ['Beginner', 'Intermediate', 'Professional'], 'Size': ['Small', 'Medium', 'Full Size'], 'Weather': ['All Weather'] },
    imageUrls: [
      'https://images.unsplash.com/photo-1601925228001-ba5f3c29d76c?w=600',
      'https://images.unsplash.com/photo-1540747913346-19212a4f0a5a?w=600',
      'https://images.unsplash.com/photo-1551958219-acbc55e0b3de?w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'
    ]
  }
};

function getRandomArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('\n🚀 Starting Enterprise Seed (Target: ~840 items)...');

  // Clear existing mapping-critical data
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Database cleared successfully.');

  // Create Categories
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
    console.log(`✅ Category Created: ${cat.name}`);
  }

  const productsToCreate = [];

  for (const catSlug in DATA_TEMPLATES) {
    const template = DATA_TEMPLATES[catSlug];
    const categoryId = categoryMap[catSlug];

    for (const brand of template.brands) {
      // Create 20 unique products for each brand
      for (let i = 1; i <= 20; i++) {
        const titleAdjective = getRandomArr(template.adjectives);
        const titleNoun = getRandomArr(template.titles);
        const color = getRandomArr(template.colors);
        const modelNum = 100 + i;
        
        const title = `${brand} ${titleNoun} ${titleAdjective} v${modelNum} (${color})`;
        
        const price = getRandomInt(template.basePrice, template.maxPrice);
        const discountPct = getRandomInt(5, 65);
        const discountPrice = Math.floor(price * (1 - (discountPct / 100)));

        // Generate specifications
        const finalSpecs = {};
        for (const specKey in template.specs) {
          finalSpecs[specKey] = getRandomArr(template.specs[specKey]);
        }
        finalSpecs['Brand'] = brand;
        finalSpecs['Color'] = color;
        finalSpecs['Warranty'] = '1 Year Domestic Warranty';

        // Images: Pick 2 random from the category pool
        const img1 = getRandomArr(template.imageUrls);
        const img2 = getRandomArr(template.imageUrls);
        const imagesList = [img1];
        if (img1 !== img2) imagesList.push(img2);

        productsToCreate.push({
          title,
          description: `Enjoy the premium quality of ${brand} now with the latest ${titleNoun}. This ${titleAdjective} variant offers unparalleled performance and durability. Perfect for users looking for ${Object.values(finalSpecs).join(' and ')}. Designed with a modern aesthetic in ${color}.`,
          price,
          discountPrice,
          discountPct,
          stock: getRandomInt(5, 1000),
          rating: parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
          reviewCount: getRandomInt(10, 15000),
          brand,
          categoryId,
          isFeatured: i === 1, // Feature the first one of each brand
          images: JSON.stringify(imagesList),
          specifications: JSON.stringify(finalSpecs)
        });
      }
    }
    console.log(`📦 Generated 140 products for ${catSlug} (7 brands × 20 per brand)`);
  }

  // Insert in chunks of 200 for stability
  const BATCH_SIZE = 200;
  for (let i = 0; i < productsToCreate.length; i += BATCH_SIZE) {
    const chunk = productsToCreate.slice(i, i + BATCH_SIZE);
    await prisma.product.createMany({ data: chunk });
    console.log(`🚀 Inserted items ${i + 1} to ${Math.min(i + BATCH_SIZE, productsToCreate.length)}`);
  }

  console.log(`\n🎉 SEED COMPLETE!`);
  console.log(`📊 TOTAL PRODUCTS: ${productsToCreate.length}`);
  console.log(`📊 TOTAL CATEGORIES: ${CATEGORIES.length}`);
}

main()
  .catch((e) => {
    console.error('❌ SEED FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
