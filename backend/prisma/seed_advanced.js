const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
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

const categoryData = {
  'mobiles': {
    brands: ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Vivo', 'Oppo'],
    basePrice: 15000, maxPrice: 150000,
    specs: {
      'RAM': ['4GB', '6GB', '8GB', '12GB', '16GB'],
      'Storage': ['64GB', '128GB', '256GB', '512GB', '1TB'],
      'Color': ['Midnight Black', 'Pearl White', 'Ocean Blue', 'Titanium Gray', 'Rose Gold']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/h/i/x/-original-imagtc5qxmwqz2zn.jpeg'
    ],
    generateTitle: (brand, color) => `${brand} Galaxy X Pro (${color})`
  },
  'electronics': {
    brands: ['Sony', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Apple'],
    basePrice: 25000, maxPrice: 250000,
    specs: {
      'RAM': ['8GB', '16GB', '32GB'],
      'Storage': ['256GB SSD', '512GB SSD', '1TB SSD'],
      'Color': ['Silver', 'Space Gray', 'Matte Black', 'White']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/v/d/b/15-fc0028au-thin-and-light-laptop-hp-original-imagp8nzgfbbgg8q.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/9/o/l/-original-imagx733c3a9z86x.jpeg'
    ],
    generateTitle: (brand, color) => `${brand} Pavilion/ZenBook Ultralight Laptop (${color})`
  },
  'fashion': {
    brands: ['Nike', 'Adidas', 'Puma', 'Reebok', "Levi's", 'H&M', 'Zara'],
    basePrice: 799, maxPrice: 14999,
    specs: {
      'Size': ['S', 'M', 'L', 'XL', 'XXL', 'UK 7', 'UK 8', 'UK 9'],
      'Color': ['Black', 'White', 'Navy Blue', 'Red', 'Olive Green', 'Yellow'],
      'Material': ['Cotton', 'Polyester', 'Leather', 'Denim']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/vest/2/y/x/s-8905206254707-jockey-original-imaghkfz2f8gqgxz.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/shoe/c/f/4/-original-imaggcbmqzzv2cyn.jpeg'
    ],
    generateTitle: (brand, color) => `${brand} Premium Comfort Wear (${color})`
  },
  'home-kitchen': {
    brands: ['Pigeon', 'Prestige', 'Hawkins', 'Cello', 'Milton', 'Wonderchef', 'Butterfly'],
    basePrice: 499, maxPrice: 12000,
    specs: {
      'Material': ['Stainless Steel', 'Glass', 'Plastic', 'Ceramic', 'Aluminium'],
      'Color': ['Silver', 'Black', 'Red', 'Blue', 'Transparent'],
      'Capacity': ['500ml', '1L', '2L', '5L']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/water-bottle/w/4/5/750-stainless-steel-fridge-water-bottle-silver-pack-of-3-original-imah4ggtuhhh8g4q.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/cookware-set/k/k/2/3-classic-non-stick-ptfe-coated-cookware-set-3-pc-s-pan-and-kadhai-original-imahfxgftbzz2v8h.jpeg'
    ],
    generateTitle: (brand, color) => `${brand} Heavy Duty Kitchen Essential (${color})`
  },
  'appliances': {
    brands: ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'IFB', 'Haier', 'Voltas'],
    basePrice: 15000, maxPrice: 85000,
    specs: {
      'Energy Rating': ['5 Star', '4 Star', '3 Star', '2 Star'],
      'Color': ['Silver', 'White', 'Black Stainless', 'Maroon'],
      'Capacity': ['190L', '250L', '300L', '6kg', '7kg', '8kg', '1 Ton', '1.5 Ton']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/air-conditioner-new/v/f/t/-original-imahatnt7y2zkxfa.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/refrigerator-new/j/y/2/-original-imagx733c3a9z86x.jpeg'
    ],
    generateTitle: (brand, color) => `${brand} Smart Digital Inverter Appliance (${color})`
  },
  'beauty': {
    brands: ["L'Oreal", 'Maybelline', 'Lakme', 'MAC', 'Plum', 'Nivea', 'Dove'],
    basePrice: 199, maxPrice: 4999,
    specs: {
      'Skin Type': ['All Skin Types', 'Oily Skin', 'Dry Skin', 'Sensitive Skin'],
      'Size': ['50ml', '100ml', '250ml', '500ml'],
      'Type': ['Face Cream', 'Serum', 'Lotion', 'Shampoo']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/face-wash/v/4/u/-original-imagg2gffqgszxgs.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/moisturizer-cream/b/l/w/-original-imagx2f5gbbnzh8j.jpeg'
    ],
    generateTitle: (brand, type) => `${brand} Advanced Care Formula (${type})`
  },
  'toys-baby': {
    brands: ['Lego', 'Hasbro', 'Mattel', 'Fisher-Price', 'Hot Wheels', 'Barbie', 'MeeMee'],
    basePrice: 299, maxPrice: 8999,
    specs: {
      'Age Group': ['0-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '12+ Years'],
      'Material': ['Plastic', 'Wood', 'Plush/Fabric', 'Metal'],
      'Color': ['Multicolor', 'Blue', 'Pink', 'Red', 'Yellow']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/puzzle/u/p/a/1-kids-educational-wooden-puzzle-toy-game-pegbound-original-imaghfz4zhzx2h6x.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/remote-control-toy/d/7/o/1-exceed-helicopter-white-toys-for-kids-flying-helicopter-with-original-imahfxgftbzz2v8h.jpeg'
    ],
    generateTitle: (brand, age) => `${brand} Premium Learning/Activity Toy (${age})`
  },
  'sports-fitness': {
    brands: ['Yonex', 'Nivia', 'Cosco', 'Decathlon', 'Kipsta', 'CultSport', 'SG'],
    basePrice: 399, maxPrice: 15999,
    specs: {
      'Sport': ['Cricket', 'Football', 'Badminton', 'Tennis', 'Gym'],
      'Color': ['Neon Green', 'Red', 'White', 'Black', 'Blue'],
      'Size': ['Free Size', 'Size 5', 'Size 4']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/ball/l/o/l/350-400-standard-size-5-football-1-12-nivia-original-imagp8nzgfbbgg8q.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/racquet/s/k/1/-original-imaggcbmqzzv2cyn.jpeg'
    ],
    generateTitle: (brand, sport) => `${brand} Pro Performance Gear for ${sport}`
  },
  'books': {
    brands: ['Penguin', 'HarperCollins', 'Oxford', 'Bloomsbury', 'Arihant', 'Simon & Schuster', 'Macmillan'],
    basePrice: 99, maxPrice: 2499,
    specs: {
      'Genre': ['Fiction', 'Non-Fiction', 'Biography', 'Educational', 'Sci-Fi', 'Romance'],
      'Language': ['English', 'Hindi', 'Spanish', 'French'],
      'Binding': ['Paperback', 'Hardcover'],
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/book/1/u/1/atomic-habits-original-imagp8nzgfbbgg8q.jpeg', // Fallback cover
      'https://rukminim2.flixcart.com/image/416/416/xif0q/book/h/k/m/harry-potter-and-the-philosopher-s-stone-original-imaggcbmqzzv2cyn.jpeg' // Fallback cover
    ],
    generateTitle: (brand, genre) => `${brand} Bestseller Selection (${genre})`
  },
  'groceries': {
    brands: ['Tata', 'Aashirvaad', 'Maggi', 'Patanjali', 'Amul', 'Britannia', 'Nestle'],
    basePrice: 40, maxPrice: 2500,
    specs: {
      'Dietary Preference': ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten Free'],
      'Weight': ['100g', '500g', '1kg', '5kg', '10kg'],
      'Package Type': ['Pouch', 'Box', 'Bottle', 'Tin']
    },
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/pulse/j/e/r/-original-imagp8nzgfbbgg8q.jpeg',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/snack-savourie/v/p/d/-original-imaggcbmqzzv2cyn.jpeg'
    ],
    generateTitle: (brand, weight) => `${brand} Everyday Essential Pack (${weight})`
  }
};

function getRandomArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Starting Dynamic 6-Brand-Per-Category Extravaganza Seeding...');

  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️ Cleared existing data.');

  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  const productsToCreate = [];
  const TOTAL_PER_CATEGORY = 50; // 50 items per category * 10 = 500 items. That guarantees many brand distributions.
  
  for (const cat of categories) {
    const data = categoryData[cat.slug];
    const categoryId = createdCategories[cat.slug];

    // Ensure every brand gets at least a few products explicitly
    for (const brand of data.brands) {
      for (let i = 0; i < 5; i++) {
        // Generate dynamic spec map
        const specMap = {};
        const specKeys = Object.keys(data.specs);
        
        let colorOrDynamic = '';
        for (const sk of specKeys) {
          specMap[sk] = getRandomArr(data.specs[sk]);
          if (sk === 'Color' || sk === 'Size' || sk === 'Type' || sk === 'Genre' || sk === 'Sport') {
            colorOrDynamic = specMap[sk];
          }
        }

        const price = getRandomInt(data.basePrice, data.maxPrice);
        const discountPct = getRandomInt(5, 60);
        const discountPrice = Math.floor(price * (1 - discountPct / 100));

        productsToCreate.push({
          title: data.generateTitle(brand, colorOrDynamic || 'Standard'),
          description: `Experience the cutting edge quality with this premium product from ${brand}. Features include highly durable build and incredible value.`,
          price,
          discountPrice,
          discountPct,
          stock: getRandomInt(10, 500),
          rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
          reviewCount: getRandomInt(10, 5000),
          brand: brand,
          categoryId,
          isFeatured: Math.random() > 0.8,
          images: JSON.stringify([getRandomArr(data.images), getRandomArr(data.images)]),
          specifications: JSON.stringify(specMap)
        });
      }
    }

    // Fill the rest randomly
    while (productsToCreate.length % TOTAL_PER_CATEGORY !== 0 || productsToCreate.length === 0) {
      const brand = getRandomArr(data.brands);
      const specMap = {};
      const specKeys = Object.keys(data.specs);
      
      let colorOrDynamic = '';
      for (const sk of specKeys) {
        specMap[sk] = getRandomArr(data.specs[sk]);
        if (sk === 'Color' || sk === 'Size' || sk === 'Type' || sk === 'Genre' || sk === 'Sport' || sk === 'Weight') {
          colorOrDynamic = specMap[sk];
        }
      }

      const price = getRandomInt(data.basePrice, data.maxPrice);
      const discountPct = getRandomInt(5, 60);
      const discountPrice = Math.floor(price * (1 - discountPct / 100));

      productsToCreate.push({
        title: data.generateTitle(brand, colorOrDynamic || 'Deluxe'),
        description: `Experience the cutting edge quality with this premium product from ${brand}. Includes top-tier components.`,
        price,
        discountPrice,
        discountPct,
        stock: getRandomInt(10, 500),
        rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
        reviewCount: getRandomInt(10, 5000),
        brand: brand,
        categoryId,
        isFeatured: Math.random() > 0.9,
        images: JSON.stringify([getRandomArr(data.images)]),
        specifications: JSON.stringify(specMap)
      });
    }

    console.log(`Generated ${data.brands.length} explicit brands for ${cat.name}`);
  }

  // Insert in batches
  const BATCH_SIZE = 100;
  for (let i = 0; i < productsToCreate.length; i += BATCH_SIZE) {
    const chunk = productsToCreate.slice(i, i + BATCH_SIZE);
    await prisma.product.createMany({ data: chunk });
    console.log(`🚀 Inserted ${chunk.length} items (Total: ${i + chunk.length})`);
  }

  console.log(`🎉 Seeded ${productsToCreate.length} advanced products successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
