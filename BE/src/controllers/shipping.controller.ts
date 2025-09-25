import { Request, Response } from "express";
import { prisma } from "..";
import { createOrderNoticeForUser } from "./notice.controller";

export const updateShippingState = async (req: Request, res: Response) => {
  const { id } = req.params; // order id (transId)
  const { state } = req.body; // new state: "SHIPPING" or "COMPLETE"

  try {
    // Update shipping state
    const shipping = await prisma.shipping.update({
      where: { transId: parseInt(id) },
      data: { State: state },
    });

    // Find the transaction to get userId
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      select: { userId: true }
    });

    // If userId found, create a notice for the user
    if (transaction && transaction.userId) {
      let noticeType = "shipped";
      if (state === "COMPLETE") noticeType = "arrived";
      await createOrderNoticeForUser({
        userId: transaction.userId,
        orderId: parseInt(id),
        type: noticeType
      });
    }

    res.status(200).json({ message: "Shipping state updated", shipping });
  } catch (error) {
    res.status(500).json({ message: "Error updating shipping state", error });
  }
};
