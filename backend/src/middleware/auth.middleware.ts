import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractBearerToken } from '../utils/jwt.utils';
import { sendError } from '../utils/response.utils';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    sendError(res, 'Authentication required', 401);
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
}
