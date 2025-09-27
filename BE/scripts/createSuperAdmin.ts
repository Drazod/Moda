import { prisma } from '../src';
import { hashSync } from 'bcryptjs';

const email = process.env.SUPERADMIN_EMAIL ;
const password = process.env.SUPERADMIN_PASSWORD;

async function createSuperAdmin() {
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