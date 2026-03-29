const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Mobiles', slug: 'mobiles', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png' },
  { name: 'Electronics', slug: 'electronics', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png' },
  { name: 'Fashion', slug: 'fashion', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg' },
  { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
  { name: 'Beauty', slug: 'beauty', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7e11fb437ab.png' },
  { name: 'Appliances', slug: 'appliances', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
  { name: 'Toys', slug: 'toys-baby', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7e11fb437ab.png' },
  { name: 'Groceries', slug: 'groceries', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png' }
];

async function main() {
  console.log('🌱 Seeding Categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log(`✅ Category: ${cat.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
