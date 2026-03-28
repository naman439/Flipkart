/**
 * Advanced High-Fidelity Database Seed Script (1000+ Products)
 * Seeds realistic products, multiple images, and curated specifications.
 * Run: node backend/prisma/seed_advanced.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
  { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' },
  { name: 'Appliances', slug: 'appliances', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200' },
  { name: 'Beauty', slug: 'beauty', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200' },
  { name: 'Toys & Baby', slug: 'toys-baby', imageUrl: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=200' },
  { name: 'Sports & Fitness', slug: 'sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200' },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200' },
  { name: 'Groceries', slug: 'groceries', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' }
];

const productTemplates = {
  mobiles: [
    { brand: 'Apple', model: 'iPhone 15 Pro', colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'], basePrice: 129990, keyword: 'iphone' },
    { brand: 'Samsung', model: 'Galaxy S24 Ultra', colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'], basePrice: 134990, keyword: 'samsung phone' },
    { brand: 'Google', model: 'Pixel 8 Pro', colors: ['Obsidian', 'Porcelain', 'Bay'], basePrice: 106990, keyword: 'pixel phone' },
    { brand: 'OnePlus', model: '12', colors: ['Flowy Emerald', 'Silky Black'], basePrice: 64999, keyword: 'oneplus' },
    { brand: 'Xiaomi', model: '14 Ultra', colors: ['Black', 'White'], basePrice: 99999, keyword: 'xiaomi phone' },
    { brand: 'Vivo', model: 'V30 Pro', colors: ['Andaman Blue', 'Classic Black'], basePrice: 41999, keyword: 'vivo phone' },
    { brand: 'Realme', model: 'GT 5G', colors: ['Dashing Silver', 'Dashing Blue'], basePrice: 29999, keyword: 'realme' }
  ],
  electronics: [
    { brand: 'Apple', model: 'MacBook Air M3 (13-inch)', specs: '8GB RAM, 256GB SSD', basePrice: 114900, keyword: 'laptop' },
    { brand: 'Sony', model: 'WH-1000XM5 Wireless Headphones', specs: 'Noise Cancelling, 30h Battery', basePrice: 29990, keyword: 'headphones' },
    { brand: 'Asus', model: 'ROG Zephyrus G14', specs: 'Ryzen 9, RTX 4060, 16GB', basePrice: 149990, keyword: 'gaming laptop' },
    { brand: 'Canon', model: 'EOS R5 Mirrorless Camera', specs: '45MP, 8K Video', basePrice: 329995, keyword: 'camera' },
    { brand: 'LG', model: '27-inch 4K UHD Monitor', specs: 'IPS Panel, HDR 10', basePrice: 24990, keyword: 'monitor' },
    { brand: 'Bose', model: 'QuietComfort Ultra Earbuds', specs: 'World-class Noise Cancellation', basePrice: 24900, keyword: 'earbuds' },
    { brand: 'HP', model: 'Pavilion Laptop 15', specs: 'Intel Core i5, 16GB RAM', basePrice: 56990, keyword: 'hp laptop' }
  ],
  fashion: [
    { brand: 'Levis', model: '511 Slim Fit Men Jeans', material: '99% Cotton, 1% Elastane', basePrice: 3999, keyword: 'jeans' },
    { brand: 'Nike', model: 'Air Max 270 Sneakers', material: 'Synthetic & Mesh', basePrice: 12995, keyword: 'shoes' },
    { brand: 'Zara', model: 'Floral Print Midi Dress', material: '100% Viscose', basePrice: 4590, keyword: 'dress' },
    { brand: 'Adidas', model: 'Originals Trefoil Hoodie', material: 'Heavyweight Cotton', basePrice: 5999, keyword: 'hoodie' },
    { brand: 'Casio', model: 'G-Shock GA-2100-1A1DR', material: 'Carbon Core Guard', basePrice: 9995, keyword: 'watch' },
    { brand: 'H&M', model: 'Regular Fit T-shirt', material: 'Jersey Cotton', basePrice: 799, keyword: 'tshirt' }
  ],
  groceries: [
    { brand: 'Tata Tea', model: 'Gold', variant: '1 kg Pack', basePrice: 650, keyword: 'tea' },
    { brand: 'Maggi', model: '2-Minute Noodles', variant: 'Pack of 12', basePrice: 168, keyword: 'noodles' },
    { brand: 'Amul', model: 'Pasteurised Butter', variant: '500 g', basePrice: 275, keyword: 'butter' },
    { brand: 'Nestle', model: 'Nescafe Classic Coffee', variant: '100 g', basePrice: 340, keyword: 'coffee' },
    { brand: 'Cadbury', model: 'Celebrations Gift Pack', variant: '183 g', basePrice: 150, keyword: 'chocolate' },
    { brand: 'Haldiram', model: 'Aloo Bhujia', variant: '200 g', basePrice: 55, keyword: 'snacks' },
    { brand: 'Fortune', model: 'Refined Mustard Oil', variant: '1 L', basePrice: 145, keyword: 'oil' }
  ]
};

// ... more templates will be added during generation to reach 1000

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSpecs(categorySlug, product) {
  const common = {
    'Warranty': '1 Year Brand Warranty',
    'Return Policy': '7 Days Replacement Policy',
    'Country of Origin': 'India'
  };

  if (categorySlug === 'mobiles') {
    return {
      ...common,
      'Model Name': product.model,
      'Display Size': '6.7 inch',
      'RAM': '8 GB / 12 GB',
      'Internal Storage': '128 GB / 256 GB',
      'Primary Camera': '50MP + 12MP + 10MP',
      'Secondary Camera': '12MP Front',
      'Processor': 'Octa Core',
      'Battery Capacity': '5000 mAh'
    };
  }
  if (categorySlug === 'electronics') {
    return {
      ...common,
      'Model Name': product.model,
      'Features': product.specs,
      'Connectivity': 'Bluetooth, Wi-Fi',
      'Power Source': 'Battery/DC'
    };
  }
  if (categorySlug === 'fashion') {
    return {
      ...common,
      'Material': product.material || 'Cotton Mix',
      'Fit': 'Regular Fit',
      'Occasion': 'Casual',
      'Type': 'Stylish'
    };
  }
  if (categorySlug === 'groceries') {
    return {
      ...common,
      'Weight': product.variant || '500g',
      'Shelf Life': '6 Months',
      'Container Type': 'Pouch/Box',
      'Ingredients': 'High quality ingredients sourced locally'
    };
  }
  return common;
}

const highFidelityImages = {
  apple_iphone: [
    'photo-1695048133142-1a20484d2569',
    'photo-1591337676887-a217a6970a8a',
    'photo-1621330396173-e41b1ae07d5b',
    'photo-1510557880182-3d4d3cba35a5'
  ],
  samsung_phone: [
    'photo-1610945265064-0e34e5519bbf',
    'photo-1678911820864-e2c567c655d7',
    'photo-1610945415295-d9bbf067e59c'
  ],
  laptop: [
    'photo-1517336714460-4c7b8097d51b',
    'photo-1496181133206-80ce9b88a853',
    'photo-1541807084-5c52b6b3adef'
  ],
  headphones: [
    'photo-1505740420928-5e560c06d30e',
    'photo-1546435770-a3e426bb47a7',
    'photo-1583394838336-acd977736f90'
  ],
  shoes: [
    'photo-1542291026-7eec264c274d',
    'photo-1606107557195-0e29a4b5b4aa',
    'photo-1491553895911-0055eca6402d'
  ],
  watch: [
    'photo-1523275335684-37898b6baf30',
    'photo-1542496658-e33a6d0d50f6',
    'photo-1508685096489-77a5ad30a04f'
  ],
  noodles: [
    'photo-1569718212165-3a8278d5f624',
    'photo-1612927621455-d02a02e0a0a1',
    'photo-1552611052-33e04de081de'
  ],
  tea_coffee: [
    'photo-1544787210-28271393638c',
    'photo-1595981267035-7b04ec82237e',
    'photo-1517686469429-8bdb88b9f907'
  ]
};

function getProductImages(slug, brand, keyword, seed) {
  const brandLower = brand.toLowerCase();
  const keywordLower = (keyword || '').toLowerCase();
  
  let ids = [];
  if (brandLower === 'apple' && (slug === 'mobiles' || keywordLower.includes('phone'))) {
    ids = highFidelityImages.apple_iphone;
  } else if (brandLower === 'samsung' && (slug === 'mobiles' || keywordLower.includes('phone'))) {
    ids = highFidelityImages.samsung_phone;
  } else if (keywordLower.includes('laptop')) {
    ids = highFidelityImages.laptop;
  } else if (keywordLower.includes('headphones')) {
    ids = highFidelityImages.headphones;
  } else if (keywordLower.includes('shoes')) {
    ids = highFidelityImages.shoes;
  } else if (keywordLower.includes('watch')) {
    ids = highFidelityImages.watch;
  } else if (keywordLower.includes('noodles')) {
    ids = highFidelityImages.noodles;
  } else if (keywordLower.includes('tea') || keywordLower.includes('coffee')) {
    ids = highFidelityImages.tea_coffee;
  }

  if (ids.length > 0) {
    return ids.map(id => `https://images.unsplash.com/${id}?w=800&q=80`);
  }

  // Fallback to highly specific loremflickr
  return [
    `https://loremflickr.com/800/800/${brand},${keyword || slug}?lock=${seed}`,
    `https://loremflickr.com/800/800/${keyword || slug}?lock=${seed + 500}`,
    `https://loremflickr.com/800/800/product?lock=${seed + 1000}`
  ];
}

async function main() {
  console.log('🌱 Starting Advanced High-Fidelity Seeding (V2: Real Images)...');

  // Reset DB
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Cleared existing data.');

  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  const productsToCreate = [];
  const TOTAL_GOAL = 1000;
  let count = 0;

  // 1. Seed from real templates first
  for (const [slug, templates] of Object.entries(productTemplates)) {
    const categoryId = createdCategories[slug];
    for (const t of templates) {
      const price = t.basePrice;
      const discountPct = getRandomInt(5, 40);
      const discountPrice = Math.floor(price * (1 - discountPct / 100));
      
      const title = slug === 'mobiles' 
        ? `${t.brand} ${t.model} (${t.colors[0]}, 128 GB)`
        : `${t.brand} ${t.model} ${t.variant || t.specs || ''}`;

      productsToCreate.push({
        title,
        description: `Experience the excellence of ${t.brand} with the ${t.model}. Built with premium materials and cutting-edge technology to deliver unmatched performance and style. A top choice for modern consumers.`,
        price,
        discountPrice,
        discountPct,
        stock: getRandomInt(10, 200),
        rating: parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
        reviewCount: getRandomInt(100, 50000),
        brand: t.brand,
        categoryId,
        isFeatured: count < 20,
        images: JSON.stringify(getProductImages(slug, t.brand, t.keyword, count)),
        specifications: JSON.stringify(generateSpecs(slug, t))
      });
      count++;
    }
  }

  // 2. Fill the rest with high-quality variations
  const slugs = Object.keys(createdCategories);
  while (count < TOTAL_GOAL) {
    const slug = slugs[getRandomInt(0, slugs.length - 1)];
    const templates = productTemplates[slug] || productTemplates['fashion']; // fallback
    const t = templates[getRandomInt(0, templates.length - 1)];
    const categoryId = createdCategories[slug];
    
    // Create a variation
    const variation = getRandomInt(1, 9999);
    const price = slug === 'groceries' ? getRandomInt(20, 999) : getRandomInt(499, 49999);
    const discountPct = getRandomInt(10, 60);
    const discountPrice = Math.floor(price * (1 - discountPct / 100));

    productsToCreate.push({
      title: `${t.brand} ${t.model} Edition ${variation}`,
      description: `High-quality ${t.brand} product from the ${slug} collection. Durable, stylish, and highly rated for its utility and performance.`,
      price,
      discountPrice,
      discountPct,
      stock: getRandomInt(5, 500),
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviewCount: getRandomInt(50, 25000),
      brand: t.brand,
      categoryId,
      isFeatured: false,
      images: JSON.stringify(getProductImages(slug, t.brand, t.keyword, count)),
      specifications: JSON.stringify(generateSpecs(slug, t))
    });
    count++;

    if (productsToCreate.length >= 100) {
      await prisma.product.createMany({ data: productsToCreate });
      console.log(`🚀 Created block of ${productsToCreate.length} products (Total: ${count})`);
      productsToCreate.length = 0;
    }
  }

  if (productsToCreate.length > 0) {
    await prisma.product.createMany({ data: productsToCreate });
  }

  console.log(`\n🎉 Seeded ${count} high-fidelity products successfully.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
