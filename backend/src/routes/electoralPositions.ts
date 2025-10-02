import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { AppError } from '../utils/AppError';

const router = Router();
const prisma = new PrismaClient();

// GET /api/electoral-positions - Get all electoral positions
router.get(
  '/',
  authenticateToken,
  validateQuery(
    require('../middleware/validation').schemas.electoralPositionPagination
  ),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, search, level, isActive } =
        req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (level) {
        where.level = level;
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [electoralPositions, total] = await Promise.all([
        prisma.electoralPosition.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: {
              select: {
                candidates: true,
              },
            },
          },
        }),
        prisma.electoralPosition.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          electoralPositions,
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

// GET /api/electoral-positions/:id - Get electoral position by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const electoralPosition = await prisma.electoralPosition.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            constituency: {
              select: {
                id: true,
                name: true,
                code: true,
                county: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
            caw: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        _count: {
          select: {
            candidates: true,
          },
        },
      },
    });

    if (!electoralPosition) {
      return next(new AppError('Electoral position not found', 404));
    }

    res.json({
      success: true,
      data: electoralPosition,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/electoral-positions/level/:level - Get electoral positions by level
router.get(
  '/level/:level',
  authenticateToken,
  validateQuery(
    require('../middleware/validation').schemas.electoralPositionPagination
  ),
  async (req, res, next) => {
    try {
      const { level } = req.params;
      const { page, limit, sortBy, sortOrder, search, isActive } =
        req.query as any;
      const skip = (page - 1) * limit;

      // Validate level parameter
      const validLevels = ['NATIONAL', 'COUNTY', 'CONSTITUENCY', 'WARD'];
      if (!validLevels.includes(level.toUpperCase())) {
        return next(new AppError('Invalid electoral level', 400));
      }

      const where: any = {
        level: level.toUpperCase(),
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [electoralPositions, total] = await Promise.all([
        prisma.electoralPosition.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: {
              select: {
                candidates: true,
              },
            },
          },
        }),
        prisma.electoralPosition.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          electoralPositions,
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

export default router;
