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