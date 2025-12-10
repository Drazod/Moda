import { Request, Response, NextFunction } from 'express';
import { checkRateLimit } from '../config/redis';

/**
 * Rate limiting middleware
 * Limits requests per user per action
 */
export const rateLimitMiddleware = (
  action: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Skip rate limit for unauthenticated requests
    }

    const { allowed, remaining } = await checkRateLimit(
      req.user.id,
      action,
      maxRequests,
      windowSeconds
    );

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', windowSeconds);

    if (!allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${windowSeconds} seconds.`,
        retryAfter: windowSeconds
      });
    }

    next();
  };
};
