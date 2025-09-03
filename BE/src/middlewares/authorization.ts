import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { Type } from "@prisma/client";

const authorize = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
          }
      
          const userRole = req.user.role;
      
          if (!roles.includes(userRole)) {
            return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
          }
      
          next();
    }
}

export default authorize;