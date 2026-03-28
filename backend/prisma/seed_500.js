/**
 * Bulk Database Seed Script (500+ Products)
 * Seeds diverse categories and hundreds of sample products.
 * Run: node backend/prisma/seed_500.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200', keywords: ['smartphone', 'iphone', 'samsung galaxy'] },
  { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200', keywords: ['laptop', 'headphones', 'camera', 'smartwatch'] },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200', keywords: ['clothing', 'jeans', 'tshirt', 'shoes', 'watch'] },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', keywords: ['furniture', 'kitchen', 'decor', 'lamp'] },
  { name: 'Appliances', slug: 'appliances', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200', keywords: ['refrigerator', 'washing machine', 'air conditioner'] },
  { name: 'Beauty', slug: 'beauty', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200', keywords: ['cosmetics', 'perfume', 'skin care'] },
  { name: 'Toys & Baby', slug: 'toys-baby', imageUrl: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=200', keywords: ['toys', 'lego', 'baby care'] },
  { name: 'Sports & Fitness', slug: 'sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200', keywords: ['fitness', 'gym', 'sports', 'football'] },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200', keywords: ['books', 'novel', 'education'] },
  { name: 'Groceries', slug: 'groceries', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200', keywords: ['food', 'snacks', 'beverage'] }
];

const brandsMap = {
  mobiles: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo'],
  electronics: ['Sony', 'Bose', 'HP', 'Dell', 'Asus', 'Lenovo', 'LG', 'Canon', 'Nikon', 'Boat', 'Noise'],
  fashion: ['Zara', 'H&M', 'Levis', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Casio', 'Fossil', 'W', 'Biba'],
  'home-kitchen': ['IKEA', 'Philips', 'Prestige', 'Hawkins', 'Pigeon', 'Bajaj', 'Borosil'],
  appliances: ['Voltas', 'Whirlpool', 'Haier', 'Blue Star', 'Daikin', 'Samsung', 'LG'],
  beauty: ['Lakme', 'Maybelline', 'LOreal', 'Nivea', 'Dove', 'The Body Shop', 'Mamaearth'],
  'toys-baby': ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Himalaya Baby', 'Johnson'],
  sports: ['Decathlon', 'Nivia', 'Cosco', 'Boldfit', 'Lifelong', 'Yonex', 'Wilson'],
  books: ['Penguin', 'HarperCollins', 'Scholastic', 'Oxford', 'Jaico'],
  groceries: ['Amul', 'Nestle', 'Cadbury', 'Britannia', 'Tata', 'Haldiram', 'Maggi']
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSpecifications(categorySlug) {
  const specs = {
    Warranty: '1 Year Domestic Warranty',
    'Return Policy': '7 Days Replacement Policy'
  };
  
  if (categorySlug === 'mobiles' || categorySlug === 'electronics') {
    specs.Brand = 'Premium';
    specs.Connectivity = 'Wireless/Bluetooth';
    specs.Performance = 'High Efficiency';
  } else if (categorySlug === 'fashion') {
    specs.Material = 'High Quality Fabric';
    specs.Fit = 'Regular/Slim';
    specs.Occasion = 'Daily Wear/Casual';
  } else if (categorySlug === 'groceries') {
    specs.Weight = `${getRandomInt(100, 1000)}g`;
    specs.ShelfLife = '6 Months';
  }
  
  return specs;
}

async function main() {
  console.log('🌱 Starting bulk database seed (500+ products)...');

  // Clear existing data to avoid foreign key violations
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Cleared existing catalog and dependency data');

  const createdCategories = {};
  for (const cat of categories) {
    const { keywords, ...catData } = cat;
    const created = await prisma.category.create({ data: catData });
    createdCategories[cat.slug] = { id: created.id, keywords };
    console.log(`✅ Category: ${cat.name}`);
  }

  const productsToCreate = [];
  const TOTAL_PRODUCTS = 520;

  for (let i = 0; i < TOTAL_PRODUCTS; i++) {
    const catKeys = Object.keys(createdCategories);
    const catSlug = catKeys[getRandomInt(0, catKeys.length - 1)];
    const cat = createdCategories[catSlug];
    const brand = brandsMap[catSlug][getRandomInt(0, brandsMap[catSlug].length - 1)];
    const keyword = cat.keywords[getRandomInt(0, cat.keywords.length - 1)];
    
    const price = getRandomInt(499, 99999);
    const discountPct = getRandomInt(10, 80);
    const discountPrice = Math.floor(price * (1 - discountPct / 100));
    const randomId = getRandomInt(1, 100000);

    const product = {
      title: `${brand} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Pro ${randomId}`,
      description: `Premium ${brand} ${keyword} with advanced features and sleek design. Perfect for your daily needs. High durability and top-rated performance in its class.`,
      price,
      discountPrice,
      discountPct,
      stock: getRandomInt(5, 500),
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviewCount: getRandomInt(50, 25000),
      brand,
      categoryId: cat.id,
      isFeatured: i < 20,
      images: JSON.stringify([
        `https://loremflickr.com/500/500/${catSlug},${keyword}?lock=${i}`,
        `https://loremflickr.com/500/500/${catSlug},${brand}?lock=${i+1000}`
      ]),
      specifications: JSON.stringify(generateSpecifications(catSlug))
    };

    productsToCreate.push(product);
    
    if (productsToCreate.length >= 100) {
      // For some reason createMany is not available in all Prisma versions or might conflict, 
      // but let's try it for speed. If it fails, I'll fallback.
      await prisma.product.createMany({ data: productsToCreate });
      console.log(`🚀 Created block of ${productsToCreate.length} products...`);
      productsToCreate.length = 0;
    }
  }

  if (productsToCreate.length > 0) {
    await prisma.product.createMany({ data: productsToCreate });
  }

  console.log(`\n🎉 Bulk seeding complete! Created ${TOTAL_PRODUCTS} products across ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error('❌ Bulk Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
