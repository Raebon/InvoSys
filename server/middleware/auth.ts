import { Request, Response, NextFunction } from 'express';
import { getUser } from '../services/user/users';

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const user = getUser(req.headers.authorization);

  if (!user) {
    return res.status(403).json({ error: 'Neoprávněný přístup' });
  }
  next();
};
