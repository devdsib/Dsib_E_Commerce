import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    include: {
      orderItems: true,
      reviews: true,
    }
  });

  if (!product) {
    console.log("No products found");
    return;
  }

  console.log("Found product:", product.id);
  console.log("OrderItems:", product.orderItems.length);
  console.log("Reviews:", product.reviews.length);

  try {
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { productId: product.id } }),
      prisma.orderItem.deleteMany({ where: { productId: product.id } }),
      prisma.product.delete({ where: { id: product.id } })
    ]);
    console.log("Successfully deleted product");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
