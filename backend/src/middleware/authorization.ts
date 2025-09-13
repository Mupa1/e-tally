import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthRequest } from './auth';
import { AppError } from '../utils/AppError';

// Middleware to check if user has required role
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// Middleware to check if user is admin (SUPER_ADMIN or CENTRAL_COMMAND_ADMIN)
export const requireAdmin = requireRole([
  UserRole.SUPER_ADMIN,
  UserRole.CENTRAL_COMMAND_ADMIN,
]);

// Middleware to check if user is super admin only
export const requireSuperAdmin = requireRole([UserRole.SUPER_ADMIN]);

// Middleware to check if user can access user management (SUPER_ADMIN or CENTRAL_COMMAND_ADMIN)
export const requireUserManagement = requireRole([
  UserRole.SUPER_ADMIN,
  UserRole.CENTRAL_COMMAND_ADMIN,
]);
