// scripts/backfillBranch.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BRANCH_CODE = process.env.BRANCH_CODE || 'ONLINE-WH';
const BRANCH_NAME = process.env.BRANCH_NAME || 'Online Warehouse';
const PAGE_SIZE = parseInt(process.env.PAGE_SIZE || '500', 10);
const WRITE_CHUNK = parseInt(process.env.WRITE_CHUNK || '100', 10); // upserts per transaction
const DRY_RUN = (process.env.DRY_RUN || 'false').toLowerCase() === 'true';

type SizeLite = { id: number; quantity: number };

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main(): Promise<void> {
  console.log(`\n=== Backfill Stocks to default branch ===`);
  console.log(`Branch code: ${BRANCH_CODE}`);
  console.log(`Branch name: ${BRANCH_NAME}`);
  console.log(`Page size:   ${PAGE_SIZE}`);
  console.log(`WRITE_CHUNK: ${WRITE_CHUNK}`);
  console.log(`DRY_RUN:     ${DRY_RUN}\n`);

  // 1) Ensure default branch exists
  const branch = await prisma.branch.upsert({
    where: { code: BRANCH_CODE },
    update: { name: BRANCH_NAME, isActive: true },
    create: {
      code: BRANCH_CODE,
      name: BRANCH_NAME,
      address: 'N/A',
      isActive: true,
    },
  });
  console.log(`Using branch id=${branch.id} (${branch.code})`);

  let processed = 0;
  let created = 0;
  let updated = 0;
  let lastId: number | undefined = undefined;

  while (true) {
    // 2) Page through Size rows
    const sizes: SizeLite[] = await prisma.size.findMany({
      where: lastId ? { id: { gt: lastId } } : undefined,
      orderBy: { id: 'asc' },
      take: PAGE_SIZE,
      select: { id: true, quantity: true },
    });
    if (sizes.length === 0) break;

    // 3) Determine which Stock rows already exist (BEFORE writing)
    const existingForPage: { sizeId: number }[] = await prisma.stock.findMany({
      where: { branchId: branch.id, sizeId: { in: sizes.map((s) => s.id) } },
      select: { sizeId: true },
    });
    const existed = new Set<number>(existingForPage.map((e) => e.sizeId));
    const pageCreated = sizes.filter((s) => !existed.has(s.id)).length;
    const pageUpdated = sizes.length - pageCreated;

    // 4) Perform upserts in chunks
    if (!DRY_RUN) {
      const ops = sizes.map((s) =>
        prisma.stock.upsert({
          where: { branchId_sizeId: { branchId: branch.id, sizeId: s.id } },
          update: { quantity: s.quantity }, // mirror current Size.quantity
          create: { branchId: branch.id, sizeId: s.id, quantity: s.quantity },
        })
      );

      for (const group of chunk(ops, WRITE_CHUNK)) {
        // Prisma v6: array form of $transaction has no timeout option
        await prisma.$transaction(group);
      }
    }

    processed += sizes.length;
    created += pageCreated;
    updated += pageUpdated;
    lastId = sizes[sizes.length - 1].id;

    console.log(
      `Processed ${processed} sizes... (created this page: +${pageCreated}, updated: +${pageUpdated})`
    );
  }

  console.log(`\nDone. Total processed: ${processed}, created: ${created}, updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error('Backfill failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
