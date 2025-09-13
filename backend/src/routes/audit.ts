import express from 'express';
import { prisma } from '../utils/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateQuery, schemas } from '../middleware/validation';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Get audit logs (admin only)
router.get(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        userId,
        action,
        entityType,
        startDate,
        endDate,
      } = req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (entityType) where.entityType = entityType;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        }),
        prisma.auditLog.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get audit log by ID (admin only)
router.get(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateQuery(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const log = await prisma.auditLog.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      if (!log) {
        return next(new AppError('Audit log not found'));
      }

      res.json({
        success: true,
        data: { log },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get audit statistics (admin only)
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query as any;

      const where: any = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [totalLogs, actionStats, entityStats, userStats, recentLogs] =
        await Promise.all([
          prisma.auditLog.count({ where }),
          prisma.auditLog.groupBy({
            by: ['action'],
            where,
            _count: { action: true },
            orderBy: { _count: { action: 'desc' } },
          }),
          prisma.auditLog.groupBy({
            by: ['entityType'],
            where,
            _count: { entityType: true },
            orderBy: { _count: { entityType: 'desc' } },
          }),
          prisma.auditLog.groupBy({
            by: ['userId'],
            where,
            _count: { userId: true },
            orderBy: { _count: { userId: 'desc' } },
            take: 10,
          }),
          prisma.auditLog.findMany({
            where,
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
          }),
        ]);

      // Get user details for user stats
      const userIds = userStats.map((stat: any) => stat.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      const userStatsWithDetails = userStats.map((stat: any) => {
        const user = users.find((u: any) => u.id === stat.userId);
        return {
          ...stat,
          user: user || null,
        };
      });

      res.json({
        success: true,
        data: {
          totalLogs,
          actionStats,
          entityStats,
          userStats: userStatsWithDetails,
          recentLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
