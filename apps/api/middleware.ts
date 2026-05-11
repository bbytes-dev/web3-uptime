import { clerkMiddleware, requireAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';

export const authMiddleware = [
  clerkMiddleware(),
  requireAuth(),
  
  // Map the Clerk auth object to the custom req.userId property expected by the API
  (req: Request, res: Response, next: NextFunction) => {
    req.userId = (req as any).auth.userId;
    next();
  }
];
