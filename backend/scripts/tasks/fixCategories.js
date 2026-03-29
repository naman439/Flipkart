const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCategories() {
  console.log('Syncing database Categories with Frontend...');
  
  // 1. Rename 'sports' to 'sports-fitness' so it matches frontend
  try {
    const sportsCat = await prisma.category.findFirst({ where: { slug: 'sports' } });
    if (sportsCat) {
      await prisma.category.update({
        where: { id: sportsCat.id },
        data: { name: 'Sports & Fitness', slug: 'sports-fitness' }
      });
      console.log('Renamed sports -> sports-fitness');
    }
  } catch(e) { console.error('Error renaming sports:', e.message); }

  // 2. Add missing categories
  const missingCategories = [
    { name: 'Beauty', slug: 'beauty', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7e11fb437ab.png' },
    { name: 'Appliances', slug: 'appliances', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
    { name: 'Toys', slug: 'toys-baby', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7e11fb437ab.png' },
    { name: 'Groceries', slug: 'groceries', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png' }
  ];

  for (const cat of missingCategories) {
    try {
      const exists = await prisma.category.findFirst({ where: { slug: cat.slug } });
      if (!exists) {
        await prisma.category.create({ data: cat });
        console.log('Created missing category:', cat.slug);
      } else {
        console.log('Category already exists:', cat.slug);
      }
    } catch(e) { console.error('Error creating', cat.slug, e.message); }
  }

  const allCats = await prisma.category.findMany();
  console.log('Current DB Categories:', allCats.map(c => c.slug).join(', '));
}

fixCategories().finally(() => prisma.$disconnect());
