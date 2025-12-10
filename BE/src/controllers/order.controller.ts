import { Request, Response } from "express";
import { prisma } from "..";

export const getOrderListForAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    // If not HOST, check if user is a branch manager
    let managedBranchId: number | null = null;
    if (userRole !== 'HOST') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { managedBranch: true }
      });

      if (!user?.managedBranch) {
        return res.status(403).json({ message: "Access denied. You are not a branch manager." });
      }

      managedBranchId = user.managedBranch.id;
    }

    // Get all transactions with user and shipping info through transactionDetails
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
        transactionDetails: {
          include: {
            shipping: true,
            clothes: true,
            size: true,
            refunds: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Helper to format date and time
    function formatDateTime(date: Date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const d = new Date(date);
      const dayOfWeek = days[d.getDay()];
      const day = d.getDate();
      const month = months[d.getMonth()];
      let hour = d.getHours();
      const minute = d.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'pm' : 'am';
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return {
        date: `${dayOfWeek}, ${day} ${month}`,
        time: `${hour}:${minute} ${ampm}`
      };
    }

    // Format price
    function formatPrice(amount: number) {
      return amount.toLocaleString('vi-VN') + ' VND';
    }

    // Filter and format for admin table
    const result = transactions
      .map((t) => {
        const { date, time } = formatDateTime(t.createdAt);
        
        // Map transaction details with shipping state and refund information
        const items = t.transactionDetails.map(td => {
          const availableForRefund = td.quantity - td.refundedQuantity;
          const itemState = td.shipping?.State;
          
          // Get refund status for this item
          let refundStatus = 'NONE';
          let latestRefund = null;
          if (td.refunds && td.refunds.length > 0) {
            latestRefund = td.refunds[0];
            refundStatus = latestRefund.status;
          }

          return {
            transactionDetailId: td.id,
            clothesId: td.clothesId,
            clothesName: td.clothes?.name || 'Unknown Item',
            size: td.size?.label || 'N/A',
            unitPrice: formatPrice(td.price),
            originalQuantity: td.quantity,
            refundedQuantity: td.refundedQuantity,
            availableForRefund: availableForRefund,
            refundStatus: refundStatus,
            latestRefundReason: latestRefund?.reason || null,
            latestRefundAdminNote: latestRefund?.adminNote || null,
            state: itemState,
            shippingAddress: td.shipping?.address || 'N/A',
            branchId: td.shipping?.branchId || null
          };
        });

        // Filter items for branch manager - only items related to their branch
        const filteredItems = managedBranchId 
          ? items.filter(item => item.branchId === managedBranchId)
          : items;

        // Skip this transaction if branch manager has no items from their branch
        if (filteredItems.length === 0) {
          return null;
        }

        // Create summary detail string
        let detail = 'No items';
        if (filteredItems.length > 0) {
          detail = filteredItems
            .map(item => `${item.clothesName} (${item.size}) x${item.originalQuantity}`)
            .join(', ');
        }

        return {
          orderId: `#${t.id}`,
          customerName: t.user?.name || "Unknown",
          customerEmail: t.user?.email || "N/A",
          detail,
          items: filteredItems,
          date,
          time,
          price: formatPrice(t.amount),
          method: t.method
        };
      })
      .filter(order => order !== null); // Remove null entries

    res.status(200).json({ orders: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};
