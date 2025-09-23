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
                        size: true
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
            // Compose detail string from transactionDetails
            let detail = 'No items';
            if (t.transactionDetails && t.transactionDetails.length > 0) {
                detail = t.transactionDetails
                    .map(td => {
                        let name = td.clothes?.name || '';
                        let size = td.size?.label ? ` (${td.size.label})` : '';
                        return name + size;
                    })
                    .filter(Boolean)
                    .join(', ');
            }
            return {
                orderId: `#${t.id}`,
                detail,
                date,
                time,
                price: formatPrice(t.amount)
            };
        });

        res.status(200).json({ message: "User transaction history", transactions: result });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
import { Request, Response } from 'express';
import { prisma } from '..';

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
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: req.body
        });
        res.status(200).json({message: "User updated successfully", user: user});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}