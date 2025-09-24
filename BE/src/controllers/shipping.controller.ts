import { Request, Response } from "express";
import { prisma } from "..";

export const updateShippingState = async (req: Request, res: Response) => {
  const { id } = req.params; // order id (transId)
  const { state } = req.body; // new state: "SHIPPING" or "COMPLETE"

  try {
    const shipping = await prisma.shipping.update({
      where: { transId: parseInt(id) },
      data: { State: state },
    });
    res.status(200).json({ message: "Shipping state updated", shipping });
  } catch (error) {
    res.status(500).json({ message: "Error updating shipping state", error });
  }
};
