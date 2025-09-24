import { Request, Response } from "express";
import { prisma } from "..";

export const getOrderListForAdmin = async (req: Request, res: Response) => {
  try {
    // Get all transactions with user and shipping info
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
        shipping: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Format for admin table
    const result = transactions.map((t) => ({
      orderId: t.id,
      customerName: t.user?.name || "Unknown",
      date: t.createdAt,
      status: t.shipping[0]?.State || "N/A",
      price: t.amount,
    }));

    res.status(200).json({ orders: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};
