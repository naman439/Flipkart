const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const https = require('https');

// Helper to fetch from API using core https module (no extra npm packages required)
function fetchFromApi(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Convert DummyJSON's 19 categories into our 10 broad categories
function mapCategory(djCategory) {
  const map = {
    'smartphones': 'mobiles',
    'laptops': 'electronics',
    'fragrances': 'beauty',
    'skincare': 'beauty',
    'groceries': 'groceries',
    'home-decoration': 'home-kitchen',
    'furniture': 'home-kitchen',
    'tops': 'fashion',
    'womens-dresses': 'fashion',
    'womens-shoes': 'fashion',
    'mens-shirts': 'fashion',
    'mens-shoes': 'fashion',
    'mens-watches': 'fashion',
    'womens-watches': 'fashion',
    'womens-bags': 'fashion',
    'womens-jewellery': 'fashion',
    'sunglasses': 'fashion',
    'automotive': 'appliances', // rough fit
    'motorcycle': 'sports-fitness', // rough fit
    'lighting': 'home-kitchen',
    'beauty': 'beauty',
    'sports-accessories': 'sports-fitness',
    'tablets': 'electronics',
    'kitchen-accessories': 'home-kitchen',
    'mobile-accessories': 'mobiles',
    'mens-watches': 'fashion',
    'womens-watches': 'fashion'
  };
  return map[djCategory] || 'fashion'; // default fallback
}

const defaultCategories = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png' },
  { name: 'Electronics', slug: 'electronics', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg' },
  { name: 'Appliances', slug: 'appliances', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
  { name: 'Beauty', slug: 'beauty', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png' },
  { name: 'Toys & Baby', slug: 'toys-baby', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
  { name: 'Books', slug: 'books', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png' },
  { name: 'Groceries', slug: 'groceries', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png' }
];

async function main() {
  console.log('🌱 Starting API-Driven 100% Unique Seeding...');

  console.log('Fetching live product data from DummyJSON...');
  const response = await fetchFromApi('https://dummyjson.com/products?limit=250');
  const apiProducts = response.products;
  console.log(`Fetched ${apiProducts.length} real products from API.`);

  // Reset DB
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Cleared existing data.');

  // Create standard categories
  const createdCategories = {};
  for (const cat of defaultCategories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
    console.log(`✅ Category Setup: ${cat.name}`);
  }

  const productsToCreate = [];
  let count = 0;

  for (const p of apiProducts) {
    // Convert USD to INR (approx 85)
    const priceInr = Math.round(p.price * 86);
    const discountPct = Math.round(p.discountPercentage) || getRandomInt(5, 40);
    const discountPrice = Math.floor(priceInr * (1 - discountPct / 100));
    
    // Fallback if brand is missing
    const brandName = p.brand || p.title.split(' ')[0] || 'Generic';
    
    // Pick the category mapping
    const mySlug = mapCategory(p.category);
    const categoryId = createdCategories[mySlug] || createdCategories['fashion'];

    // Map the specifications safely
    const specs = {
      "Original Category": p.category,
      "SKU": p.sku || `SKU-${getRandomInt(1000, 9999)}`,
      "Weight": p.weight ? `${p.weight} kg` : 'N/A',
      "Warranty": p.warrantyInformation || 'Standard',
      "Shipping": p.shippingInformation || 'Standard Delivery',
      "Status": p.availabilityStatus || 'In Stock'
    };

    productsToCreate.push({
      title: p.title,
      description: p.description || 'Premium high-quality product.',
      price: priceInr,
      discountPrice,
      discountPct,
      stock: p.stock > 0 ? p.stock : getRandomInt(10, 100),
      rating: parseFloat(p.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviewCount: getRandomInt(20, 15000), // Randomize review count for flavor
      brand: brandName,
      categoryId,
      isFeatured: count < 25, // First 25 are featured
      images: JSON.stringify(p.images || [p.thumbnail]), // Use real CDN images!
      specifications: JSON.stringify(specs)
    });
    count++;
  }

  // Insert all 194 products
  await prisma.product.createMany({ data: productsToCreate });
  console.log(`🎉 Seeded ${count} 100% Unique, Real-Image products successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
