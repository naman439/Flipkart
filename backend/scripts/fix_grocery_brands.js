const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const brandMappings = [
  { match: 'Get Fresh', brand: 'Get Fresh' },
  { match: 'GRANIC FARMS', brand: 'GRANIC FARMS' },
  { match: 'vedic Wellness', brand: 'Vedic Wellness' },
  { match: 'PROTIUM', brand: 'PROTIUM' },
  { match: 'Farmley', brand: 'Farmley' },
  { match: 'Eatoriyumm', brand: 'Eatoriyumm' },
  { match: 'True Elements', brand: 'True Elements' },
  { match: 'Happilo', brand: 'Happilo' },
  { match: 'Yoga Bar', brand: 'Yoga Bar' }
];

async function main() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'groceries' } }
  });

  let count = 0;
  for (const product of products) {
    let correctedBrand = null;
    for (const mapping of brandMappings) {
      if (product.title.includes(mapping.match)) {
        correctedBrand = mapping.brand;
        break;
      }
    }

    if (correctedBrand) {
      await prisma.product.update({
        where: { id: product.id },
        data: { brand: correctedBrand }
      });
      count++;
      console.log(`Updated: ${product.title} -> ${correctedBrand}`);
    }
  }
  
  console.log(`Successfully updated ${count} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
