import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
  console.log('Starting to delete all data...\n');

  try {
    // Delete in correct order due to foreign key constraints
    
    console.log('Deleting Shipping records...');
    const shippingCount = await prisma.shipping.deleteMany();
    console.log(`✓ Deleted ${shippingCount.count} Shipping records`);

    console.log('Deleting TransactionDetail records...');
    const transactionDetailCount = await prisma.transactionDetail.deleteMany();
    console.log(`✓ Deleted ${transactionDetailCount.count} TransactionDetail records`);

    console.log('Deleting Transaction records...');
    const transactionCount = await prisma.transaction.deleteMany();
    console.log(`✓ Deleted ${transactionCount.count} Transaction records`);

    console.log('Deleting CartItem records...');
    const cartItemCount = await prisma.cartItem.deleteMany();
    console.log(`✓ Deleted ${cartItemCount.count} CartItem records`);

    console.log('Deleting Cart records...');
    const cartCount = await prisma.cart.deleteMany();
    console.log(`✓ Deleted ${cartCount.count} Cart records`);

    console.log('\n✅ All data deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
