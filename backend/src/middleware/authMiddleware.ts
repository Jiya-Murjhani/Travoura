import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env, requireEnv } from '../config/env';

const supabase = createClient(
  requireEnv(env.supabase.url, 'VITE_SUPABASE_URL'),
  requireEnv(env.supabase.anonKey, 'VITE_SUPABASE_ANON_KEY')
);

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
