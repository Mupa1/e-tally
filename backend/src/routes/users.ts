import express from 'express';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import {
  requireUserManagement,
  requireAdmin,
  requireSuperAdmin,
} from '../middleware/authorization';
import {
  validateRequest,
  validateParams,
  validateQuery,
  schemas,
} from '../middleware/validation';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all users with pagination, search, and filtering
router.get(
  '/',
  authenticateToken,
  requireUserManagement,
  validateQuery(schemas.pagination),
  async (req: AuthRequest, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, search, role, isActive } =
        req.query as any;
      const skip = (page - 1) * limit;

      // Build where clause for filtering
      const where: any = {};

      if (search) {
        // Split search term by spaces to handle full names
        const searchTerms = search.trim().split(/\s+/);

        if (searchTerms.length === 1) {
          // Single term search - search in individual fields
          where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } },
          ];
        } else {
          // Multiple terms search - search for combinations
          const searchConditions = [];

          // Add individual field searches
          searchTerms.forEach((term: string) => {
            searchConditions.push(
              { firstName: { contains: term, mode: 'insensitive' } },
              { lastName: { contains: term, mode: 'insensitive' } },
              { email: { contains: term, mode: 'insensitive' } },
              { username: { contains: term, mode: 'insensitive' } }
            );
          });

          // Add full name search (firstName + lastName combination)
          if (searchTerms.length === 2) {
            searchConditions.push({
              AND: [
                {
                  firstName: { contains: searchTerms[0], mode: 'insensitive' },
                },
                { lastName: { contains: searchTerms[1], mode: 'insensitive' } },
              ],
            });
            // Also try reverse order
            searchConditions.push({
              AND: [
                {
                  firstName: { contains: searchTerms[1], mode: 'insensitive' },
                },
                { lastName: { contains: searchTerms[0], mode: 'insensitive' } },
              ],
            });
          }

          where.OR = searchConditions;
        }
      }

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      // Test basic query first
      logger.info('Testing basic Prisma query...');
      const testUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
        },
        take: 1,
      });
      logger.info('Basic query successful, found users:', testUsers.length);

      // Get total count for pagination
      const total = await prisma.user.count({ where });

      // Get users with pagination and filtering
      const users = await prisma.user.findMany({
        where,
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
        skip: skip || 0,
        take: parseInt(limit as string) || 10,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total,
            page: parseInt(page as string) || 1,
            limit: parseInt(limit as string) || 10,
            totalPages: Math.ceil(total / (parseInt(limit as string) || 10)),
          },
        },
      });
    } catch (error: any) {
      logger.error('Failed to fetch users:', error);
      logger.error('Prisma error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
      });
      next(new AppError('Failed to fetch users', 500));
    }
  }
);

// Get user by ID
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
      logger.error('Failed to fetch user:', error);
      next(new AppError('Failed to fetch user', 500));
    }
  }
);

// Create new user (only SUPER_ADMIN and CENTRAL_COMMAND_ADMIN can create users)
router.post(
  '/',
  authenticateToken,
  requireAdmin, // Only admins can create users
  validateRequest(schemas.user),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        email,
        username,
        password,
        firstName,
        lastName,
        phoneNumber,
        imei,
        role,
      } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }, ...(imei ? [{ imei }] : [])],
        },
      });

      if (existingUser) {
        return next(
          new AppError(
            'User with this email, username, or IMEI already exists',
            409
          )
        );
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          phoneNumber,
          imei,
          role,
          isActive: true,
        },
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
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info(`User created: ${user.email} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user },
      });
    } catch (error: any) {
      logger.error('Failed to create user:', error);
      next(new AppError('Failed to create user', 500));
    }
  }
);

// Update user
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

      // Check for duplicate email/username/IMEI if they're being updated
      if (updateData.email || updateData.username || updateData.imei) {
        const duplicateUser = await prisma.user.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              {
                OR: [
                  ...(updateData.email ? [{ email: updateData.email }] : []),
                  ...(updateData.username
                    ? [{ username: updateData.username }]
                    : []),
                  ...(updateData.imei ? [{ imei: updateData.imei }] : []),
                ],
              },
            ],
          },
        });

        if (duplicateUser) {
          return next(
            new AppError(
              'User with this email, username, or IMEI already exists',
              409
            )
          );
        }
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

      logger.info(`User updated: ${updatedUser.email} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser },
      });
    } catch (error: any) {
      logger.error('Failed to update user:', error);
      next(new AppError('Failed to update user', 500));
    }
  }
);

// Change user password (only admins can change passwords)
router.put(
  '/:id/change-password',
  authenticateToken,
  requireAdmin,
  validateParams(schemas.id),
  validateRequest(schemas.changePassword),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      logger.info(
        `Password changed for user: ${user.email} by ${req.user?.email}`
      );

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      logger.error('Failed to change password:', error);
      next(new AppError('Failed to change password', 500));
    }
  }
);

// Activate user
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

      if (existingUser.isActive) {
        return next(new AppError('User is already active', 400));
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

      logger.info(`User activated: ${updatedUser.email} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'User activated successfully',
        data: { user: updatedUser },
      });
    } catch (error: any) {
      logger.error('Failed to activate user:', error);
      next(new AppError('Failed to activate user', 500));
    }
  }
);

// Deactivate user
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

      if (!existingUser.isActive) {
        return next(new AppError('User is already inactive', 400));
      }

      // Prevent deactivating self
      if (req.user?.id === id) {
        return next(new AppError('Cannot deactivate your own account', 400));
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

      logger.info(
        `User deactivated: ${updatedUser.email} by ${req.user?.email}`
      );

      res.json({
        success: true,
        message: 'User deactivated successfully',
        data: { user: updatedUser },
      });
    } catch (error: any) {
      logger.error('Failed to deactivate user:', error);
      next(new AppError('Failed to deactivate user', 500));
    }
  }
);

// Delete user (only SUPER_ADMIN can delete users)
router.delete(
  '/:id',
  authenticateToken,
  requireSuperAdmin,
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

      // Prevent deleting self
      if (req.user?.id === id) {
        return next(new AppError('Cannot delete your own account', 400));
      }

      // Delete user
      await prisma.user.delete({
        where: { id },
      });

      logger.info(`User deleted: ${existingUser.email} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      logger.error('Failed to delete user:', error);
      next(new AppError('Failed to delete user', 500));
    }
  }
);

// Get user statistics (only admins)
router.get(
  '/stats/overview',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const [totalUsers, activeUsers, inactiveUsers, usersByRole, recentUsers] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { isActive: true } }),
          prisma.user.count({ where: { isActive: false } }),
          prisma.user.groupBy({
            by: ['role'],
            _count: { role: true },
          }),
          prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              createdAt: true,
            },
          }),
        ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          usersByRole,
          recentUsers,
        },
      });
    } catch (error: any) {
      logger.error('Failed to fetch user statistics:', error);
      next(new AppError('Failed to fetch user statistics', 500));
    }
  }
);

// Bulk operations (only SUPER_ADMIN)
router.post(
  '/bulk/activate',
  authenticateToken,
  requireSuperAdmin,
  validateRequest(schemas.bulkOperation),
  async (req: AuthRequest, res, next) => {
    try {
      const { userIds } = req.body;

      const result = await prisma.user.updateMany({
        where: {
          id: { in: userIds },
          isActive: false,
        },
        data: { isActive: true },
      });

      logger.info(`Bulk activated ${result.count} users by ${req.user?.email}`);

      res.json({
        success: true,
        message: `${result.count} users activated successfully`,
        data: { count: result.count },
      });
    } catch (error: any) {
      logger.error('Failed to bulk activate users:', error);
      next(new AppError('Failed to bulk activate users', 500));
    }
  }
);

router.post(
  '/bulk/deactivate',
  authenticateToken,
  requireSuperAdmin,
  validateRequest(schemas.bulkOperation),
  async (req: AuthRequest, res, next) => {
    try {
      const { userIds } = req.body;

      const result = await prisma.user.updateMany({
        where: {
          id: {
            in: userIds,
            not: req.user?.id, // Don't deactivate self
          },
          isActive: true,
        },
        data: { isActive: false },
      });

      logger.info(
        `Bulk deactivated ${result.count} users by ${req.user?.email}`
      );

      res.json({
        success: true,
        message: `${result.count} users deactivated successfully`,
        data: { count: result.count },
      });
    } catch (error: any) {
      logger.error('Failed to bulk deactivate users:', error);
      next(new AppError('Failed to bulk deactivate users', 500));
    }
  }
);

export default router;
