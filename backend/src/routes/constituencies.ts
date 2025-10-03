import express from 'express';
import Joi from 'joi';
import { prisma } from '../utils/database';
import {
  authenticateToken,
  requireRole,
  logUserAction,
} from '../middleware/auth';
import {
  validateRequest,
  validateParams,
  validateQuery,
  schemas,
} from '../middleware/validation';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Get all constituencies
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, countyId } = req.query as any;
      const skip = (page - 1) * limit;

      const where = countyId ? { countyId } : {};

      const [constituencies, total] = await Promise.all([
        prisma.constituency.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            county: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
            _count: {
              select: {
                caws: true,
                pollingStations: true,
              },
            },
          },
        }),
        prisma.constituency.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          constituencies,
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

// Get constituency statistics
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const { countyId, constituencyId } = req.query as any;

    // Build where clause based on query parameters
    const where: any = {};
    if (countyId) where.countyId = countyId;
    if (constituencyId) where.id = constituencyId;

    // Get total count
    const totalCount = await prisma.constituency.count({ where });

    // Get statistics by county
    const byCounty = await prisma.constituency.groupBy({
      by: ['countyId'],
      where,
      _count: {
        id: true,
      },
    });

    // Get statistics by CAW
    const byCAW = await prisma.cAW.groupBy({
      by: ['constituencyId'],
      where: constituencyId ? { constituencyId } : {},
      _count: {
        id: true,
      },
    });

    // Get voter statistics
    const voterStats = await prisma.voterRegistration.aggregate({
      where: constituencyId
        ? {
            pollingStation: {
              constituencyId: constituencyId,
            },
          }
        : {},
      _sum: {
        registeredVoters: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        registeredVoters: true,
      },
    });

    const stats = {
      totalCount,
      byCounty: byCounty.map((item) => ({
        constituencyId: item.countyId,
        _count: { id: item._count.id },
      })),
      byCAW: byCAW.map((item) => ({
        cawId: item.constituencyId,
        _count: { id: item._count.id },
      })),
      voterStats: {
        totalRegisteredVoters: voterStats._sum.registeredVoters || 0,
        totalPollingStations: voterStats._count.id || 0,
        averageRegisteredVoters: voterStats._avg.registeredVoters || 0,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// Get constituency by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const constituency = await prisma.constituency.findUnique({
        where: { id },
        include: {
          county: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          caws: {
            include: {
              _count: {
                select: {
                  pollingStations: true,
                },
              },
            },
          },
          pollingStations: {
            include: {
              _count: {
                select: {
                  voterRegistration: true,
                },
              },
            },
          },
          _count: {
            select: {
              caws: true,
              pollingStations: true,
            },
          },
        },
      });

      if (!constituency) {
        return next(new AppError('Constituency not found'));
      }

      res.json({
        success: true,
        data: { constituency },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create constituency (admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateRequest(schemas.constituency),
  logUserAction('CREATE', 'Constituency'),
  async (req, res, next) => {
    try {
      const { code, name, countyId } = req.body;

      // Check if county exists
      const county = await prisma.county.findUnique({
        where: { id: countyId },
      });

      if (!county) {
        return next(new AppError('County not found'));
      }

      // Check if constituency with code already exists
      const existingConstituency = await prisma.constituency.findUnique({
        where: { code },
      });

      if (existingConstituency) {
        return next(new AppError('Constituency with this code already exists'));
      }

      const constituency = await prisma.constituency.create({
        data: { code, name, countyId },
        include: {
          county: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Constituency created successfully',
        data: { constituency },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update constituency (admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  validateRequest(schemas.constituencyUpdate),
  logUserAction('UPDATE', 'Constituency'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if county is being updated and if it exists
      if (updateData.countyId) {
        const county = await prisma.county.findUnique({
          where: { id: updateData.countyId },
        });

        if (!county) {
          return next(new AppError('County not found'));
        }
      }

      // Check if code is being updated and if it already exists
      if (updateData.code) {
        const existingConstituency = await prisma.constituency.findFirst({
          where: {
            code: updateData.code,
            id: { not: id },
          },
        });

        if (existingConstituency) {
          return next(
            new AppError('Constituency with this code already exists')
          );
        }
      }

      const constituency = await prisma.constituency.update({
        where: { id },
        data: updateData,
        include: {
          county: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Constituency updated successfully',
        data: { constituency },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete constituency (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  logUserAction('DELETE', 'Constituency'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if constituency has CAWs
      const cawCount = await prisma.cAW.count({
        where: { constituencyId: id },
      });

      if (cawCount > 0) {
        return next(new AppError('Cannot delete constituency with CAWs'));
      }

      await prisma.constituency.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Constituency deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Bulk import constituencies (admin only)
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateRequest(
    Joi.object({
      constituencies: Joi.array().items(schemas.constituency).required(),
    })
  ),
  logUserAction('BULK_IMPORT', 'Constituency'),
  async (req, res, next) => {
    try {
      const { constituencies } = req.body;

      // Check for duplicate codes
      const codes = constituencies.map((c: any) => c.code);
      const duplicateCodes = codes.filter(
        (code: string, index: number) => codes.indexOf(code) !== index
      );

      if (duplicateCodes.length > 0) {
        return next(
          new AppError(`Duplicate codes found: ${duplicateCodes.join(', ')}`)
        );
      }

      // Check for existing codes
      const existingConstituencies = await prisma.constituency.findMany({
        where: {
          code: { in: codes },
        },
        select: { code: true },
      });

      if (existingConstituencies.length > 0) {
        const existingCodes = existingConstituencies.map((c: any) => c.code);
        return next(
          new AppError(
            `Constituencies with these codes already exist: ${existingCodes.join(
              ', '
            )}`
          )
        );
      }

      // Validate all county IDs exist
      const countyIds = [
        ...new Set(constituencies.map((c: any) => c.countyId)),
      ] as string[];
      const existingCounties = await prisma.county.findMany({
        where: {
          id: { in: countyIds },
        },
        select: { id: true },
      });

      if (existingCounties.length !== countyIds.length) {
        const existingCountyIds = existingCounties.map(
          (c: any) => c.id
        ) as string[];
        const missingCountyIds = countyIds.filter(
          (id) => !existingCountyIds.includes(id)
        );
        return next(
          new AppError(`Counties not found: ${missingCountyIds.join(', ')}`)
        );
      }

      // Create constituencies
      const createdConstituencies = await prisma.constituency.createMany({
        data: constituencies,
      });

      res.status(201).json({
        success: true,
        message: `${createdConstituencies.count} constituencies imported successfully`,
        data: { count: createdConstituencies.count },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
