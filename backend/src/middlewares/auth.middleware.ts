import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';


export const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // ต้องประกาศ type เสริมใน Express (ดูด้านล่าง)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
