export const userTransactionHistory = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const userId = req.user.id;
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                shipping: true,
                transactionDetails: {
                    include: {
                        clothes: true,
                        size: true,
                        refunds: {
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                }
            },
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

        const result = transactions.map((t) => {
            const { date, time } = formatDateTime(t.createdAt);
            
            // Get state from first associated shipping record, if available
            let state = t.shipping && t.shipping.length > 0 ? t.shipping[0].State : undefined;
            
            // Map transaction details with refund information
            const items = t.transactionDetails.map(td => {
                const availableForRefund = td.quantity - td.refundedQuantity;
                
                // Get refund status for this item
                let refundStatus = 'NONE';
                let latestRefund = null;
                if (td.refunds && td.refunds.length > 0) {
                    latestRefund = td.refunds[0]; // Most recent refund
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
                    canRefund: availableForRefund > 0 && state === 'COMPLETE',
                    refundStatus: refundStatus,
                    latestRefundReason: latestRefund?.reason || null,
                    latestRefundAdminNote: latestRefund?.adminNote || null
                };
            });

            // Create summary detail string for backward compatibility
            let detail = 'No items';
            if (items.length > 0) {
                detail = items
                    .map(item => `${item.clothesName} (${item.size}) x${item.originalQuantity}`)
                    .join(', ');
            }

            return {
                orderId: `#${t.id}`,
                detail, // Keep for backward compatibility
                items, // New detailed item information
                date,
                time,
                price: formatPrice(t.amount),
                state, // Transaction state from shipping
                canRefundAny: items.some(item => item.canRefund)
            };
        });

        res.status(200).json({ message: "User transaction history", transactions: result });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
import { Request, Response } from 'express';
import { prisma } from '..';
import { uploadToFirebase, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';

export const userProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const userId = req.user.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        res.status(200).json({message: "User Profile: ", user: user});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const userUpdate = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const userId = req.user.id;
    
    try {
        // Get current user to check if they have an existing avatar
        const currentUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let updateData: any = { ...req.body };

        // Handle avatar upload if file is provided
        const files = req.files as { avatar?: Express.Multer.File[] };
        if (files && files.avatar && files.avatar.length > 0) {
            const avatarFile = files.avatar[0];
            
            // Delete old avatar if it exists
            if (currentUser.avatarId) {
                try {
                    await deleteImageFromFirebaseAndPrisma(currentUser.avatarId);
                } catch (error) {
                    console.error('Error deleting old avatar:', error);
                    // Continue with upload even if deletion fails
                }
            }

            // Upload new avatar
            const avatarName = Date.now() + '_avatar_' + avatarFile.originalname;
            const avatarUrl = await uploadToFirebase({ ...avatarFile, originalname: avatarName });
            
            // Create new image record
            const avatarImage = await prisma.image.create({
                data: {
                    name: avatarName,
                    url: avatarUrl,
                },
            });

            // Update user data to include new avatar
            updateData.avatarId = avatarImage.id;
        }

        // Update user with new data
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData
        });

        res.status(200).json({message: "User updated successfully", user: user});
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}