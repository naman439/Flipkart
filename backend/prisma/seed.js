/**
 * Database Seed Script
 * Seeds categories and 30 sample products for the Flipkart Clone
 * Run: npx prisma db seed
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' },
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Sports', slug: 'sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200' },
];

const products = [
  // ── Mobiles ──────────────────────────────────────────────────────────────
  {
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
    description: 'Experience the next generation of Samsung smartphones with the Galaxy S24 Ultra. Features a 6.8-inch QHD+ Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 200MP main camera, and built-in S Pen.',
    price: 134999, discountPrice: 109999, discountPct: 18, stock: 45, rating: 4.6, reviewCount: 2341,
    brand: 'Samsung', categorySlug: 'mobiles', isFeatured: true,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=500'],
    specifications: { Display: '6.8" QHD+ AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12 GB', Storage: '256 GB', Camera: '200MP + 50MP + 12MP + 10MP', Battery: '5000 mAh', OS: 'Android 14' },
  },
  {
    title: 'Apple iPhone 15 Pro (Natural Titanium, 128GB)',
    description: 'Introducing iPhone 15 Pro with the A17 Pro chip, titanium design, and the most powerful camera system ever on an iPhone with a 48MP main camera, now with a 5x Telephoto lens.',
    price: 134900, discountPrice: 127900, discountPct: 5, stock: 30, rating: 4.7, reviewCount: 5890,
    brand: 'Apple', categorySlug: 'mobiles', isFeatured: true,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=500', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500'],
    specifications: { Display: '6.1" Super Retina XDR OLED', Processor: 'A17 Pro Chip', RAM: '8 GB', Storage: '128 GB', Camera: '48MP + 12MP + 12MP', Battery: '3274 mAh', OS: 'iOS 17' },
  },
  {
    title: 'OnePlus 12 5G (Flowy Emerald, 256GB)',
    description: 'The OnePlus 12 features Snapdragon 8 Gen 3, a 6.82-inch 2K AMOLED display with 120Hz refresh rate, 50MP triple camera with Hasselblad tuning, and 100W SUPERVOOC fast charging.',
    price: 64999, discountPrice: 59999, discountPct: 8, stock: 60, rating: 4.5, reviewCount: 1102,
    brand: 'OnePlus', categorySlug: 'mobiles', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    specifications: { Display: '6.82" 2K AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 3', RAM: '12 GB', Storage: '256 GB', Camera: '50MP + 48MP + 64MP', Battery: '5400 mAh', OS: 'Android 14' },
  },
  {
    title: 'Redmi Note 13 Pro+ 5G (Midnight Black, 256GB)',
    description: 'Redmi Note 13 Pro+ comes with a 200MP flagship-grade camera, curved 1.5K AMOLED display, 120W HyperCharge, and MediaTek Dimensity 7200 Ultra processor.',
    price: 34999, discountPrice: 29999, discountPct: 14, stock: 100, rating: 4.3, reviewCount: 3456,
    brand: 'Redmi', categorySlug: 'mobiles', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'],
    specifications: { Display: '6.67" 1.5K AMOLED 120Hz', Processor: 'Dimensity 7200 Ultra', RAM: '8 GB', Storage: '256 GB', Camera: '200MP + 8MP + 2MP', Battery: '5000 mAh', OS: 'Android 13' },
  },
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with the new Integrated Processor V1. Up to 30-hour battery life, Multi-point connection, crystal-clear hands-free calling.',
    price: 34990, discountPrice: 24990, discountPct: 28, stock: 50, rating: 4.8, reviewCount: 8921,
    brand: 'Sony', categorySlug: 'electronics', isFeatured: true,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'],
    specifications: { 'Driver Unit': '30mm', 'Frequency Response': '4Hz-40,000Hz', 'Battery Life': '30 hours', 'Noise Cancellation': 'Active', Connectivity: 'Bluetooth 5.2 + NFC', Weight: '250g' },
  },
  {
    title: 'Apple MacBook Air M3 (13.6-inch, 8GB RAM, 256GB SSD)',
    description: 'Supercharged by M3 chip. MacBook Air is strikingly thin and fast. With up to 18 hours of battery life and a stunning Liquid Retina display.',
    price: 114900, discountPrice: 108900, discountPct: 5, stock: 20, rating: 4.9, reviewCount: 2100,
    brand: 'Apple', categorySlug: 'electronics', isFeatured: true,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
    specifications: { Processor: 'Apple M3 8-core', RAM: '8 GB', Storage: '256 GB SSD', Display: '13.6" Liquid Retina', Battery: '18 hours', Weight: '1.24 kg', OS: 'macOS Sonoma' },
  },
  {
    title: 'Samsung 65" Crystal 4K Pro UHD Smart TV',
    description: 'Vibrant 4K UHD visuals powered by Crystal Processor 4K. Enjoy Tizen OS with voice assistants, AirSlim design, and Object Tracking Sound Lite.',
    price: 89999, discountPrice: 67999, discountPct: 24, stock: 15, rating: 4.4, reviewCount: 678,
    brand: 'Samsung', categorySlug: 'electronics', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'],
    specifications: { Display: '65" Crystal 4K UHD', 'Refresh Rate': '60Hz', HDR: 'HDR10+', 'Smart TV OS': 'Tizen', 'HDMI Ports': '3', 'USB Ports': '2', Sound: '20W Dolby Audio' },
  },
  {
    title: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens',
    description: 'Perfect entry-level mirrorless camera. 24.2MP APS-C CMOS sensor, 4K video, intelligent subject tracking AF, and a compact, lightweight body.',
    price: 74995, discountPrice: 64995, discountPct: 13, stock: 18, rating: 4.5, reviewCount: 892,
    brand: 'Canon', categorySlug: 'electronics', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'],
    specifications: { Sensor: '24.2MP APS-C CMOS', AF: 'Dual Pixel CMOS AF II', Video: '4K 30fps', Viewfinder: 'EVF', Display: '3" Vari-angle touchscreen', Battery: 'approx. 390 shots' },
  },
  {
    title: 'boAt Rockerz 450 Bluetooth On-Ear Headphone',
    description: 'Enjoy 15 hours of playtime with boAt Signature Sound. 40mm dynamic drivers deliver immersive audio. Easy access playback controls and built-in mic.',
    price: 2990, discountPrice: 1298, discountPct: 57, stock: 200, rating: 4.1, reviewCount: 15678,
    brand: 'boAt', categorySlug: 'electronics', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'],
    specifications: { 'Driver Size': '40mm', 'Bluetooth Version': '5.0', 'Battery Life': '15 hours', 'Charging Time': '2 hours', Weight: '181g', Mic: 'Yes' },
  },
  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    title: 'Levi\'s Men\'s 511 Slim Fit Jeans',
    description: 'The 511 Slim Fit Jeans from Levi\'s sit below the waist with a slim leg from hip to ankle. Made with stretch fabric for all-day comfort.',
    price: 3599, discountPrice: 2159, discountPct: 40, stock: 150, rating: 4.3, reviewCount: 5430,
    brand: "Levi's", categorySlug: 'fashion', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500'],
    specifications: { Fabric: '98% Cotton, 2% Elastane', Fit: 'Slim Fit', Rise: 'Mid Rise', Closure: 'Zip Fly with Button', 'Care Instructions': 'Machine Wash' },
  },
  {
    title: 'Puma Men\'s Running Shoes - Voltage Series',
    description: 'Lightweight and breathable running shoes with SOFTFOAM+ sockliner for superior cushioning. Rubber outsole with flex grooves for natural foot movement.',
    price: 4999, discountPrice: 2499, discountPct: 50, stock: 75, rating: 4.2, reviewCount: 3210,
    brand: 'Puma', categorySlug: 'fashion', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    specifications: { Type: 'Running Shoes', Upper: 'Mesh', Sole: 'Rubber', Closure: 'Lace-up', 'Ideal For': 'Running, Walking' },
  },
  {
    title: 'W Women\'s Ethnic Anarkali Kurta',
    description: 'Elegant floral-print anarkali kurta with three-quarter sleeves, crafted from soft cotton. Perfect for festive occasions or casual office wear.',
    price: 1599, discountPrice: 799, discountPct: 50, stock: 120, rating: 4.4, reviewCount: 2109,
    brand: 'W', categorySlug: 'fashion', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500'],
    specifications: { Fabric: '100% Cotton', Occasion: 'Ethnic/Festive', 'Sleeve Type': 'Three-Quarter Sleeve', Pattern: 'Floral Print', 'Care Instructions': 'Machine Wash Cold' },
  },
  {
    title: 'Fastrack Men\'s Analog Watch - Blue Dial',
    description: 'Trendy analog watch from Fastrack with blue dial, day and date function, and 50m water resistance. Features a stainless steel case and leather strap.',
    price: 2995, discountPrice: 1795, discountPct: 40, stock: 80, rating: 4.0, reviewCount: 4532,
    brand: 'Fastrack', categorySlug: 'fashion', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'],
    specifications: { Movement: 'Analog', 'Case Material': 'Stainless Steel', 'Strap Material': 'Leather', 'Water Resistance': '50m', Display: 'Analog with Date' },
  },
  // ── Home & Kitchen ────────────────────────────────────────────────────────
  {
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6L)',
    description: '7-in-1 multi-use programmable cooker — Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker, and Warmer. Stainless steel inner pot.',
    price: 12999, discountPrice: 7999, discountPct: 38, stock: 40, rating: 4.6, reviewCount: 7832,
    brand: 'Instant Pot', categorySlug: 'home-kitchen', isFeatured: true,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
    specifications: { Capacity: '6 Liters', Functions: '7-in-1', 'Inner Pot': 'Stainless Steel 18/8', Power: '1000W', Voltage: '220V', 'Safety Features': '10+ safety mechanisms' },
  },
  {
    title: 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner',
    description: 'Dyson\'s most powerful and intelligent cordless vacuum. Laser reveals microscopic dust. LCD screen proves what you\'ve captured. Up to 60 minutes run time.',
    price: 62900, discountPrice: 52900, discountPct: 16, stock: 12, rating: 4.7, reviewCount: 1203,
    brand: 'Dyson', categorySlug: 'home-kitchen', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    specifications: { 'Run Time': '60 min', Suction: '230 AW', 'Bin Volume': '0.76L', Weight: '3.1 kg', Filter: 'Fully sealed HEPA', Noise: '79 dB' },
  },
  {
    title: 'Philips HD2516 750W Pop-Up Toaster',
    description: 'Wide-slot toaster with 8 browning settings. High-lift bread feature, reheat and cancel function. Removable crumb tray for easy cleaning.',
    price: 2295, discountPrice: 1499, discountPct: 35, stock: 90, rating: 4.2, reviewCount: 6721,
    brand: 'Philips', categorySlug: 'home-kitchen', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=500'],
    specifications: { Power: '750W', Slots: '2', 'Browning Settings': '8', Functions: 'Toast, Reheat, Cancel', 'Cord Length': '0.75m' },
  },
  {
    title: 'IKEA KALLAX Shelf Unit (4x4, White)',
    description: 'Versatile shelving unit that can be used as a room divider. 16 cubbies perfect for books, plants, or storage boxes. Easy to assemble.',
    price: 12990, discountPrice: 9990, discountPct: 23, stock: 25, rating: 4.5, reviewCount: 3456,
    brand: 'IKEA', categorySlug: 'home-kitchen', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
    specifications: { Dimensions: '147x147 cm', Material: 'Particleboard', 'Max Load': '13 kg/shelf', Color: 'White', Assembly: 'Required' },
  },
  // ── Books ─────────────────────────────────────────────────────────────────
  {
    title: 'Atomic Habits by James Clear (Paperback)',
    description: 'No.1 New York Times bestseller. James Clear shares proven strategies on how to build good habits, break bad ones, and get 1 percent better every day. Essential reading.',
    price: 599, discountPrice: 319, discountPct: 47, stock: 500, rating: 4.8, reviewCount: 23456,
    brand: 'Penguin', categorySlug: 'books', isFeatured: true,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specifications: { Author: 'James Clear', Publisher: 'Penguin Random House', Pages: '320', Language: 'English', Format: 'Paperback', ISBN: '978-0735211292' },
  },
  {
    title: 'The Psychology of Money by Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money — and how to think about it better.',
    price: 499, discountPrice: 249, discountPct: 50, stock: 350, rating: 4.7, reviewCount: 18940,
    brand: 'Jaico Publishing', categorySlug: 'books', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1549049950-48d5887197a0?w=500'],
    specifications: { Author: 'Morgan Housel', Publisher: 'Harriman House', Pages: '256', Language: 'English', Format: 'Paperback', ISBN: '978-0857197689' },
  },
  {
    title: 'Rich Dad Poor Dad by Robert Kiyosaki',
    description: 'The #1 personal finance book of all time. Learn what the rich teach their kids about money and what the poor and middle class do not.',
    price: 395, discountPrice: 179, discountPct: 55, stock: 400, rating: 4.5, reviewCount: 34500,
    brand: 'April Press', categorySlug: 'books', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    specifications: { Author: 'Robert Kiyosaki', Publisher: 'April Press', Pages: '336', Language: 'English', Format: 'Paperback', ISBN: '978-1612680194' },
  },
  {
    title: 'Clean Code by Robert C. Martin (Paperback)',
    description: 'A pioneer in software engineering shares best practices for writing clean, maintainable code. A must-read for every professional software developer.',
    price: 2899, discountPrice: 1799, discountPct: 38, stock: 120, rating: 4.6, reviewCount: 9870,
    brand: 'Prentice Hall', categorySlug: 'books', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'],
    specifications: { Author: 'Robert C. Martin', Publisher: 'Prentice Hall', Pages: '431', Language: 'English', Format: 'Paperback', ISBN: '978-0132350884' },
  },
  // ── Sports ────────────────────────────────────────────────────────────────
  {
    title: 'Decathlon Domyos Cross Training Yoga Mat (8mm, Purple)',
    description: 'High-density foam yoga mat with non-slip surface. Excellent cushioning for yoga, pilates, and floor exercises. Includes carry strap. 8mm thickness.',
    price: 999, discountPrice: 599, discountPct: 40, stock: 200, rating: 4.3, reviewCount: 8903,
    brand: 'Decathlon', categorySlug: 'sports', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1601925228001-ba5f3c29d76c?w=500'],
    specifications: { Material: 'NBR Foam', Thickness: '8mm', Dimensions: '183 x 61 cm', Weight: '900g', 'Non-slip': 'Yes' },
  },
  {
    title: 'Cosco Cricket Kit - Full Set (Senior)',
    description: 'Complete cricket kit for senior players. Includes English willow bat, batting gloves, pads, helmet, guard, and kitbag. Professional quality at an affordable price.',
    price: 8999, discountPrice: 5999, discountPct: 33, stock: 30, rating: 4.2, reviewCount: 432,
    brand: 'Cosco', categorySlug: 'sports', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1540747913346-19212a4f0a5a?w=500'],
    specifications: { Bat: 'English Willow', Pads: 'Lightweight EVA', Helmet: 'ABS Shell', 'Includes': 'Bat, Pads, Gloves, Helmet, Guard, Kit Bag' },
  },
  {
    title: 'Nivia Storm Football - Size 5 (Orange/Black)',
    description: 'Machine-stitched football with 32-panel design for accurate flight. High-quality rubber bladder for consistent bounce. Official FIFA size 5.',
    price: 999, discountPrice: 549, discountPct: 45, stock: 150, rating: 4.0, reviewCount: 2341,
    brand: 'Nivia', categorySlug: 'sports', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1551958219-acbc55e0b3de?w=500'],
    specifications: { Type: 'Machine Stitched', Panels: '32', Bladder: 'Rubber', Size: '5', Weight: '410-450g' },
  },
  {
    title: 'Boldfit Resistance Bands Set (5 Bands, Multiple Resistance)',
    description: 'Set of 5 resistance bands with varying resistance levels (light to extra heavy). Perfect for full-body workouts, muscle recovery, and stretching. Includes carry bag.',
    price: 999, discountPrice: 499, discountPct: 50, stock: 300, rating: 4.4, reviewCount: 11203,
    brand: 'Boldfit', categorySlug: 'sports', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'],
    specifications: { Material: 'Natural Latex', 'Number of Bands': '5', 'Resistance Levels': 'Light to Extra Heavy', Usage: 'Full body workout', Includes: 'Carry Bag + Instructions' },
  },
  {
    title: 'Lifelong LLF45 Fan Bike (Stationary Exercise Cycle)',
    description: 'Full body workout with dual-action handlebars. Fan resistance adjusts automatically. LCD display shows time, distance, calorie, and speed. Great for cardio and strength training.',
    price: 14999, discountPrice: 8999, discountPct: 40, stock: 20, rating: 4.1, reviewCount: 876,
    brand: 'Lifelong', categorySlug: 'sports', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'],
    specifications: { Type: 'Fan Bike', Resistance: 'Air Resistance', Display: 'LCD', 'Max Weight Capacity': '120 kg', Dimensions: '112x57x124 cm' },
  },
  {
    title: 'Noise ColorFit Pro 4 Smart Watch (Jet Black)',
    description: 'Smart watch with 1.72" TFT display, built-in GPS, 100+ sport modes, blood oxygen monitoring, and up to 7-day battery life. IP68 water resistant.',
    price: 4999, discountPrice: 2499, discountPct: 50, stock: 120, rating: 4.2, reviewCount: 15678,
    brand: 'Noise', categorySlug: 'electronics', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    specifications: { Display: '1.72" TFT', GPS: 'Built-in', 'Sport Modes': '100+', 'Battery Life': '7 days', 'Water Resistance': 'IP68', Connectivity: 'Bluetooth 5.0' },
  },
  {
    title: 'Mi Smart Band 8 Activity Tracker',
    description: 'Ultra-lightweight fitness band with 1.62" AMOLED display, 190+ workout modes, 24/7 heart rate monitoring, SpO2, stress monitoring, and 16-day battery life.',
    price: 3499, discountPrice: 2799, discountPct: 20, stock: 180, rating: 4.4, reviewCount: 23456,
    brand: 'Mi', categorySlug: 'electronics', isFeatured: false,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
    specifications: { Display: '1.62" AMOLED', 'Battery Life': '16 days', 'Water Resistance': '5ATM', 'Workout Modes': '190+', Weight: '27g', Connectivity: 'Bluetooth 5.3' },
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Seed categories
  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  // Seed products
  for (const product of products) {
    const { categorySlug, specifications, images, ...rest } = product;
    await prisma.product.create({
      data: {
        ...rest,
        categoryId: createdCategories[categorySlug],
        images: JSON.stringify(images),
        specifications: JSON.stringify(specifications),
      },
    });
    console.log(`✅ Product: ${product.title.substring(0, 50)}...`);
  }

  console.log(`\n🎉 Database seeded successfully!`);
  console.log(`   📦 ${categories.length} categories`);
  console.log(`   🛍️  ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
