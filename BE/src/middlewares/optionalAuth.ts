// src/middlewares/optionalAuth.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs';
import { prisma } from '..';

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return next();

  try {
    const token = auth.slice('Bearer '.length);
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) (req as any).user = user;
  } catch {
    // ignore errors—this middleware is best-effort
  } finally {
    next();
  }
}
