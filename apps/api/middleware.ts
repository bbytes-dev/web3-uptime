import { clerkMiddleware, getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';
import { JWT_PUBLIC_KEY } from './config';
import jwt from "jsonwebtoken"

export const authMiddleware = [
  clerkMiddleware(),

  // Verify auth and map Clerk userId to req.userId
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']
    if (!token || !token.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }
    const jwtToken = token.split(' ')[1]!;
    const decodedToken = jwt.verify(jwtToken, JWT_PUBLIC_KEY);
    if(!decodedToken || typeof decodedToken === 'string' || !decodedToken.sub){
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }
    req.userId = decodedToken.sub;
    next();
  }
];
