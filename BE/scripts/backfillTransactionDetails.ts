import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillTransactionDetails() {
  // Find all transactions
  const transactions = await prisma.transaction.findMany();

  for (const transaction of transactions) {
    // Try to find the related cart by matching cart.userId and cart.state === 'ORDERED' and cart.updatedAt close to transaction.createdAt
    // (You may need to adjust this logic if you have a more direct link)
    const carts = await prisma.cart.findMany({
      where: {
        userId: transaction.userId,
        state: 'ORDERED',
        updatedAt: {
          gte: new Date(transaction.createdAt.getTime() - 1000 * 60 * 10), // 10 minutes before
          lte: new Date(transaction.createdAt.getTime() + 1000 * 60 * 10), // 10 minutes after
        },
      },
      include: { items: true },
    });
    if (carts.length === 0) {
      console.warn(`No cart found for transaction ${transaction.id}`);
      continue;
    }
    // If multiple carts, pick the closest by updatedAt
    const cart = carts.reduce((prev, curr) => {
      return Math.abs(curr.updatedAt.getTime() - transaction.createdAt.getTime()) < Math.abs(prev.updatedAt.getTime() - transaction.createdAt.getTime()) ? curr : prev;
    });
    for (const item of cart.items) {
      await prisma.transactionDetail.create({
        data: {
          transactionId: transaction.id,
          clothesId: item.ClothesId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          price: item.totalprice,
        },
      });
    }
    console.log(`Backfilled details for transaction ${transaction.id}`);
  }
}

backfillTransactionDetails()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
