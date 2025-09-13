import express from 'express';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireUserManagement } from '../middleware/authorization';
import {
  validateRequest,
  validateParams,
  schemas,
} from '../middleware/validation';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Get all users (only admins can access)
router.get(
  '/',
  authenticateToken,
  requireUserManagement,
  async (req: AuthRequest, res, next) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          imei: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: { users },
      });
    } catch (error: any) {
      next(new AppError('Failed to fetch users', 500));
    }
  }
);

// Get user by ID (only admins can access)
router.get(
  '/:id',
  authenticateToken,
  requireUserManagement,
  validateParams(schemas.id),
  async (req: AuthRequest, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          imei: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      next(new AppError('Failed to fetch user', 500));
    }
  }
);

// Update user (only admins can access)
router.put(
  '/:id',
  authenticateToken,
  requireUserManagement,
  validateParams(schemas.id),
  validateRequest(schemas.userUpdate),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return next(new AppError('User not found', 404));
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          imei: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser },
      });
    } catch (error: any) {
      next(new AppError('Failed to update user', 500));
    }
  }
);

// Deactivate user (only admins can access)
router.put(
  '/:id/deactivate',
  authenticateToken,
  requireUserManagement,
  validateParams(schemas.id),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return next(new AppError('User not found', 404));
      }

      // Deactivate user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isActive: false },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          imei: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        message: 'User deactivated successfully',
        data: { user: updatedUser },
      });
    } catch (error: any) {
      next(new AppError('Failed to deactivate user', 500));
    }
  }
);

// Activate user (only admins can access)
router.put(
  '/:id/activate',
  authenticateToken,
  requireUserManagement,
  validateParams(schemas.id),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return next(new AppError('User not found', 404));
      }

      // Activate user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isActive: true },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          imei: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        message: 'User activated successfully',
        data: { user: updatedUser },
      });
    } catch (error: any) {
      next(new AppError('Failed to activate user', 500));
    }
  }
);

export default router;
