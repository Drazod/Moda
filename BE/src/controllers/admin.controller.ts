
import { sendOtpEmail } from '../utils/email';
import { Request, Response } from 'express';
import { prisma } from "..";// adjust import to where you export prisma
import { Prisma } from '@prisma/client';
import { getPresenceCounts } from '../services/presence.services';
import { hashSync } from 'bcryptjs';

type Range = { from: Date; to: Date };
const ONE_DAY = 24 * 60 * 60 * 1000;


// 2. Secure admin creation endpoint (only SUPER_ADMIN can create)
export const createAdminAccount = async (req: Request, res: Response) => {
  try {
    const requester = req.user;
    if (!requester || requester.role !== 'HOST') {
      return res.status(403).json({ error: 'Forbidden: Only super admins can create admin accounts.' });
    }
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
        role: 'ADMIN',
        isVerified: false,
        phone: phone || 'N/A',
        address: address || 'N/A',
        otpCode: otp,
        otpExpiry
      }
    });
    // 3. Log admin creation
    await prisma.log.create({
      data: {
        userId: requester.id,
        userName: requester.name,
        action: `created admin account for ${name} (${email})`,
      }
    });
    // Send OTP email for verification
    await sendOtpEmail(email, otp);
    res.status(201).json({ message: 'Admin account created. Please check email for OTP.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin account.' });
  }
};

 
export function parseRange(q: any): Range {
  const now = new Date();
  const to = q?.to ? new Date(q.to) : now;
  if (q?.from) return { from: new Date(q.from), to };

  // support ?range=7d|30d|90d (default 30d)
  const n =
    typeof q?.range === 'string' && /^\d+d$/.test(q.range)
      ? parseInt(q.range)
      : 30;
  const from = new Date(to.getTime() - n * ONE_DAY);
  return { from, to };
}

export function previous(range: Range): Range {
  const len = range.to.getTime() - range.from.getTime();
  return { from: new Date(range.from.getTime() - len), to: range.from };
}

export function pctChange(curr: number, prev: number): number {
  if (!isFinite(prev) || prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

/**
 * GET /api/admin/overview?range=30d
 * GET /api/admin/overview?from=2025-01-01&to=2025-01-31
 */
export async function getAdminOverview(req: Request, res: Response) {
  const r = parseRange(req.query);
  const rPrev = previous(r);

  try {
    // ---------- KPI: revenue ----------
    const [{ _sum: revCurr }, { _sum: revPrev }] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: r.from, lt: r.to } },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: rPrev.from, lt: rPrev.to } },
      }),
    ]);

    const revenueTotal = revCurr.amount ?? 0;
    const revenuePrev = revPrev.amount ?? 0;

    // ---------- KPI: products ----------
    const [productsTotal, productsNewCurr, productsNewPrev] = await Promise.all([
      prisma.clothes.count(),
      prisma.clothes.count({ where: { createdAt: { gte: r.from, lt: r.to } } }),
      prisma.clothes.count({
        where: { createdAt: { gte: rPrev.from, lt: rPrev.to } },
      }),
    ]);

    // ---------- KPI: customers ----------
    const [customersTotal, customersNewCurr, customersNewPrev] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({
        where: { role: 'USER', createdAt: { gte: r.from, lt: r.to } },
      }),
      prisma.user.count({
        where: { role: 'USER', createdAt: { gte: rPrev.from, lt: rPrev.to } },
      }),
    ]);

    const activeCustomersCurr = (
      await prisma.cart.groupBy({
        by: ['userId'],
        where: { state: 'ORDERED', createdAt: { gte: r.from, lt: r.to } },
      })
    ).length;

    // ---------- Top selling products (by quantity) ----------
    const grouped = await prisma.transactionDetail.groupBy({
      by: ['clothesId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const ids = grouped.map((g) => g.clothesId);
    
    const [clothesRows, lastBuys] = await Promise.all([
      prisma.clothes.findMany({
        where: { id: { in: ids } },
        include: { 
          category: true,
          mainImg: { select: { url: true } }
        },
      }),
      Promise.all(
        ids.map((id) =>
          prisma.transactionDetail.findFirst({
            where: {
              clothesId: id,
            },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          })
        )
      ),
    ]);

    const clothesById = new Map(clothesRows.map((c) => [c.id, c]));
    const lastBuyById = new Map(
      ids.map((id, i) => [id, lastBuys[i]?.createdAt ?? null])
    );

    const topSelling = grouped.map((g) => {
      const c = clothesById.get(g.clothesId)!;
      return {
        id: c.id,
        name: c.name,
        category: c.category?.name ?? null,
        image: c.mainImg?.url ?? null,
        price: c.price,
        lastBuyDate: lastBuyById.get(g.clothesId),
        orderQuantity: g._sum?.quantity ?? 0,
      };
    });

    const live = await getPresenceCounts();

    // ---------- Build response ----------
    res.json({
      range: { from: r.from, to: r.to },
      kpis: {
        revenue: {
          total: revenueTotal,
          currency: 'VND',
          changePct: pctChange(revenueTotal, revenuePrev),
          previousTotal: revenuePrev,
        },
        products: {
          total: productsNewCurr,
          addedInRange: productsNewCurr,
          changePct: pctChange(productsNewCurr, productsNewPrev),
        },
        timeSpentHrs: null,
        customers: {
          total: customersTotal,
          newInRange: customersNewCurr,
          changePct: pctChange(customersNewCurr, customersNewPrev),
        },
      },
      topSellingProducts: topSelling,
      webStatus: {
        webLoadPct: live.webLoadPct,
        totalConnects: live.totalConnects,
        customersActiveInRange: live.customersOnline,
        guests: live.guestsOnline,
      },
    });
  } catch (err) {
    console.error('[admin.overview] error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// Admin: Get list of users with id, name, role, isVerified
export const getAllUsersForAdmin = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        points: true,
        role: true,
        managedBranch: true,
        isVerified: true,
      }
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
export const userUpdate = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const userId = req.user.id;
    
    try {
        const { managedBranchId, points, ...otherData } = req.body;

        // Get current user to check existing data
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { managedBranch: true }
        });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let updateData: any = { ...otherData };
        const logs: string[] = [];

        // Handle branch manager assignment
        if (managedBranchId !== undefined) {
            if (managedBranchId === null) {
                // Remove branch manager assignment
                updateData.managedBranch = { disconnect: true };
                logs.push(`removed as branch manager`);
            } else {
                // Validate branch exists
                const branch = await prisma.branch.findUnique({
                    where: { id: parseInt(managedBranchId) },
                    include: { manager: true }
                });

                if (!branch) {
                    return res.status(404).json({ message: "Branch not found" });
                }

                // Check if branch already has a manager
                if (branch.manager && branch.manager.id !== userId) {
                    return res.status(400).json({ 
                        message: `Branch ${branch.code} is already managed by ${branch.manager.name}` 
                    });
                }

                // Check if user has ADMIN role (only admins can manage branches)
                if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HOST') {
                    return res.status(400).json({ 
                        message: "Only users with ADMIN or HOST role can be assigned as branch managers" 
                    });
                }

                updateData.managedBranch = { connect: { id: parseInt(managedBranchId) } };
                logs.push(`assigned as manager of branch ${branch.code}`);
            }
        }

        // Handle points update
        if (points !== undefined) {
            const pointsValue = parseInt(points);
            if (isNaN(pointsValue) || pointsValue < 0) {
                return res.status(400).json({ message: "Points must be a non-negative number" });
            }

            const pointsDiff = pointsValue - currentUser.points;
            updateData.points = pointsValue;

            // Log point change in PointHistory
            if (pointsDiff !== 0) {
                await prisma.pointHistory.create({
                    data: {
                        userId: userId,
                        points: pointsDiff,
                        type: 'ADMIN_ADJUSTMENT',
                        description: `Admin adjustment: ${pointsDiff > 0 ? 'added' : 'deducted'} ${Math.abs(pointsDiff)} points`,
                        transactionId: null
                    }
                });
                logs.push(`points ${pointsDiff > 0 ? 'increased' : 'decreased'} by ${Math.abs(pointsDiff)} (${currentUser.points} → ${pointsValue})`);
            }
        }

        // Update user with new data
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { 
                managedBranch: true,
                avatar: true 
            }
        });

        // Create log entry if there were significant changes
        if (logs.length > 0) {
            await prisma.log.create({
                data: {
                    userId: req.user.id,
                    userName: req.user.name,
                    action: `updated user ${currentUser.name} (id=${userId}): ${logs.join(', ')}`
                }
            });
        }

        res.status(200).json({
            message: "User updated successfully", 
            user: user,
            changes: logs.length > 0 ? logs : undefined
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};