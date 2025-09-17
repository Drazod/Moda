// middlewares/authorize.ts
import { NextFunction, Request, Response } from 'express';

const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'User not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next();
  };
};

export default authorize;
