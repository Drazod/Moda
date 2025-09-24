import { Request, Response } from 'express';
import { prisma } from '..';

// GET /products/sales-report
export const productsSalesReport = async (req: Request, res: Response) => {
  try {
    const products = await prisma.clothes.findMany({
      include: {
        transactionDetails: {
          include: {
            transaction: true,
          },
        },
        category: true,
      },
    });

    const result = products.map(product => {
      // Get all transactionDetails for this product
      const details = product.transactionDetails;
      // Calculate total quantity sold
      const totalSold = details.reduce((sum, td) => sum + td.quantity, 0);
      // Find the last buy date (latest transaction.createdAt)
      let lastBuyDate = null;
      if (details.length > 0) {
        lastBuyDate = details
          .map(td => td.transaction?.createdAt)
          .filter(Boolean)
          .sort((a, b) => (a > b ? -1 : 1))[0];
      }
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        totalSold,
        lastBuyDate,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
