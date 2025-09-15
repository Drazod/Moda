import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { prisma } from "..";
import { JwtPayload } from "../types/express";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);

    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    token = token.split(' ')[1]; // Extract token part
    try {

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await prisma.user.findFirst({
            where: {
                id: payload.id,
                role: payload.role,
                email: payload.email,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default authMiddleware;