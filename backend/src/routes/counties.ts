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

// Get all counties with pagination, search, and filtering
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, search } = req.query as any;
      const skip = (page - 1) * limit;

      // Build where clause for filtering
      const where: any = {};

      if (search) {
        // Split search term by spaces to handle full names
        const searchTerms = search.trim().split(/\s+/);

        if (searchTerms.length === 1) {
          // Single term search - search in individual fields
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ];
        } else {
          // Multiple terms search - search for combinations
          const searchConditions: any[] = [];

          // Add individual field searches
          searchTerms.forEach((term: string) => {
            searchConditions.push(
              { name: { contains: term, mode: 'insensitive' } },
              { code: { contains: term, mode: 'insensitive' } }
            );
          });

          where.OR = searchConditions;
        }
      }

      // Get total count for pagination
      const total = await prisma.county.count({ where });

      // Get counties with pagination and filtering
      const counties = await prisma.county.findMany({
        where,
        include: {
          _count: {
            select: {
              constituencies: true,
            },
          },
        },
        skip: skip || 0,
        take: parseInt(limit as string) || 10,
        orderBy:
          sortBy === 'name'
            ? { name: sortOrder || 'asc' }
            : sortBy === 'code'
            ? { code: sortOrder || 'asc' }
            : sortBy === 'updatedAt'
            ? { updatedAt: sortOrder || 'desc' }
            : { createdAt: sortOrder || 'desc' },
      });

      res.json({
        success: true,
        data: {
          counties,
          pagination: {
            total,
            page: parseInt(page as string) || 1,
            limit: parseInt(limit as string) || 10,
            totalPages: Math.ceil(total / (parseInt(limit as string) || 10)),
          },
        },
      });
    } catch (error: any) {
      next(new AppError('Failed to fetch counties', 500));
    }
  }
);

// Get county statistics
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const { countyId } = req.query as any;

    // Build where clause based on query parameters
    const where: any = {};
    if (countyId) where.id = countyId;

    // Get total count
    const totalCount = await prisma.county.count({ where });

    // Get statistics by constituency
    const byConstituency = await prisma.constituency.groupBy({
      by: ['countyId'],
      where: countyId ? { countyId } : {},
      _count: {
        id: true,
      },
    });

    // Get statistics by CAW
    const byCAW = await prisma.cAW.groupBy({
      by: ['constituencyId'],
      where: countyId
        ? {
            constituency: {
              countyId: countyId,
            },
          }
        : {},
      _count: {
        id: true,
      },
    });

    // Get voter statistics
    const voterStats = await prisma.voterRegistration.aggregate({
      where: countyId
        ? {
            pollingStation: {
              constituency: {
                countyId: countyId,
              },
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

    // Get polling station statistics
    const pollingStationStats = await prisma.pollingStation.aggregate({
      where: countyId
        ? {
            constituency: {
              countyId: countyId,
            },
          }
        : {},
      _count: {
        id: true,
      },
    });

    res.json({
      success: true,
      data: {
        totalCount,
        byConstituency,
        byCAW,
        voterStats,
        pollingStationStats,
      },
    });
  } catch (error: any) {
    next(new AppError('Failed to fetch county statistics', 500));
  }
});

// Get county statistics by ID
router.get(
  '/:id/stats',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Get county details
      const county = await prisma.county.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              constituencies: true,
            },
          },
        },
      });

      if (!county) {
        return next(new AppError('County not found', 404));
      }

      // Get statistics for this specific county
      const [byConstituency, byCAW, voterStats, pollingStationStats] =
        await Promise.all([
          // Constituencies in this county
          prisma.constituency.groupBy({
            by: ['countyId'],
            where: { countyId: id },
            _count: {
              id: true,
            },
          }),

          // CAWs in this county
          prisma.cAW.groupBy({
            by: ['constituencyId'],
            where: {
              constituency: {
                countyId: id,
              },
            },
            _count: {
              id: true,
            },
          }),

          // Voter statistics for this county
          prisma.voterRegistration.aggregate({
            where: {
              pollingStation: {
                constituency: {
                  countyId: id,
                },
              },
            },
            _sum: {
              registeredVoters: true,
            },
            _count: {
              id: true,
            },
            _avg: {
              registeredVoters: true,
            },
          }),

          // Polling station statistics for this county
          prisma.pollingStation.aggregate({
            where: {
              constituency: {
                countyId: id,
              },
            },
            _count: {
              id: true,
            },
          }),
        ]);

      res.json({
        success: true,
        data: {
          county,
          byConstituency,
          byCAW,
          voterStats,
          pollingStationStats,
        },
      });
    } catch (error: any) {
      next(new AppError('Failed to fetch county statistics', 500));
    }
  }
);

// Get county by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const county = await prisma.county.findUnique({
        where: { id },
        include: {
          constituencies: {
            include: {
              _count: {
                select: {
                  caws: true,
                  pollingStations: true,
                },
              },
            },
          },
          _count: {
            select: {
              constituencies: true,
            },
          },
        },
      });

      if (!county) {
        return next(new AppError('County not found'));
      }

      res.json({
        success: true,
        data: { county },
      });
    } catch (error: any) {
      next(new AppError('Failed to fetch county details', 500));
    }
  }
);

// Create county (admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN', 'SUPER_ADMIN']),
  validateRequest(schemas.county),
  logUserAction('CREATE', 'County'),
  async (req, res, next) => {
    try {
      const { code, name } = req.body;

      // Check if county with code already exists
      const existingCounty = await prisma.county.findUnique({
        where: { code },
      });

      if (existingCounty) {
        return next(new AppError('County with this code already exists'));
      }

      const county = await prisma.county.create({
        data: { code, name },
      });

      res.status(201).json({
        success: true,
        message: 'County created successfully',
        data: { county },
      });
    } catch (error: any) {
      next(new AppError('Failed to create county', 500));
    }
  }
);

// Update county (admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN', 'SUPER_ADMIN']),
  validateParams(schemas.id),
  validateRequest(schemas.countyUpdate),
  logUserAction('UPDATE', 'County'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if code is being updated and if it already exists
      if (updateData.code) {
        const existingCounty = await prisma.county.findFirst({
          where: {
            code: updateData.code,
            id: { not: id },
          },
        });

        if (existingCounty) {
          return next(new AppError('County with this code already exists'));
        }
      }

      const county = await prisma.county.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'County updated successfully',
        data: { county },
      });
    } catch (error: any) {
      next(new AppError('Failed to update county', 500));
    }
  }
);

// Delete county (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN', 'SUPER_ADMIN']),
  validateParams(schemas.id),
  logUserAction('DELETE', 'County'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if county has constituencies
      const constituencyCount = await prisma.constituency.count({
        where: { countyId: id },
      });

      if (constituencyCount > 0) {
        return next(new AppError('Cannot delete county with constituencies'));
      }

      await prisma.county.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'County deleted successfully',
      });
    } catch (error: any) {
      next(new AppError('Failed to delete county', 500));
    }
  }
);

// Bulk import counties (admin only)
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN', 'SUPER_ADMIN']),
  validateRequest(schemas.countiesBulk),
  logUserAction('BULK_IMPORT', 'County'),
  async (req, res, next) => {
    try {
      const { counties } = req.body;

      // Check for duplicate codes
      const codes = counties.map((c: any) => c.code);
      const duplicateCodes = codes.filter(
        (code: string, index: number) => codes.indexOf(code) !== index
      );

      if (duplicateCodes.length > 0) {
        return next(
          new AppError(`Duplicate codes found: ${duplicateCodes.join(', ')}`)
        );
      }

      // Check for existing codes
      const existingCounties = await prisma.county.findMany({
        where: {
          code: { in: codes },
        },
        select: { code: true },
      });

      if (existingCounties.length > 0) {
        const existingCodes = existingCounties.map((c: any) => c.code);
        return next(
          new AppError(
            `Counties with these codes already exist: ${existingCodes.join(
              ', '
            )}`
          )
        );
      }

      // Create counties
      const createdCounties = await prisma.county.createMany({
        data: counties,
      });

      res.status(201).json({
        success: true,
        message: `${createdCounties.count} counties imported successfully`,
        data: { count: createdCounties.count },
      });
    } catch (error: any) {
      next(new AppError('Failed to import counties', 500));
    }
  }
);

export default router;
