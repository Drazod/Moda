import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();
const email = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
const password = process.env.SUPERADMIN_PASSWORD || 'Admin@123456';

async function createSuperAdmin() {
  if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
    console.warn('Warning: Using default credentials. Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD in .env file.');
  }
  
  const name = 'Super Admin';
  const phone = 'N/A';
  const address = 'N/A';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Super admin already exists.');
    return;
  }
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      role: 'HOST', // or SUPER_ADMIN if you use that
      isVerified: true,
      phone,
      address
    }
  });
  console.log('Super admin created:', email);
}

(async () => {
  await createSuperAdmin();
  await prisma.$disconnect();
})();