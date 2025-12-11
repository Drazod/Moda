import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateDevices() {
  console.log('Starting device migration...\n');

  try {
    // Get all users with publicKeyDevice (old column name without 's')
    const users = await prisma.$queryRaw<any[]>`
      SELECT id, publicKeyDevice, publicKeyUpdatedAt 
      FROM User 
      WHERE publicKeyDevice IS NOT NULL
    `;

    console.log(`Found ${users.length} users with publicKeyDevice\n`);

    // First, add the new column publicKeyDevices
    try {
      await prisma.$executeRaw`
        ALTER TABLE User ADD COLUMN publicKeyDevices JSON NULL
      `;
      console.log('✓ Added publicKeyDevices column\n');
    } catch (err: any) {
      if (err.message.includes('Duplicate column')) {
        console.log('✓ Column publicKeyDevices already exists\n');
      } else {
        throw err;
      }
    }

    for (const user of users) {
      const deviceArray = [{
        name: user.publicKeyDevice,
        userAgent: 'Migrated device',
        addedAt: user.publicKeyUpdatedAt || new Date().toISOString(),
        lastUsedAt: user.publicKeyUpdatedAt || new Date().toISOString()
      }];

      await prisma.$executeRaw`
        UPDATE User 
        SET publicKeyDevices = ${JSON.stringify(deviceArray)}
        WHERE id = ${user.id}
      `;

      console.log(`✓ Migrated device for user ${user.id}: ${user.publicKeyDevice}`);
    }

    // Now drop the old column
    await prisma.$executeRaw`
      ALTER TABLE User DROP COLUMN publicKeyDevice
    `;
    console.log('\n✓ Dropped old publicKeyDevice column');

    console.log('\n✅ Device migration completed successfully!');
  } catch (error) {
    console.error('❌ Error migrating devices:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateDevices();
