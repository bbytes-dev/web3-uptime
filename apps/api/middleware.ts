import { clerkMiddleware, getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';

export const authMiddleware = [
  clerkMiddleware(),

  // Verify auth and map Clerk userId to req.userId
  (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }
    req.userId = auth.userId;
    next();
  }
];
