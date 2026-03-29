const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findProblemProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: {
        title: { contains: 'MOTOROLA g06 power' }
      },
      include: {
        category: true,
        images: true
      }
    });
    console.log(JSON.stringify(product, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

findProblemProduct();
