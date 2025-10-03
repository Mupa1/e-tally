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

// Get all CAWs
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, constituencyId, countyId, search } =
        req.query as any;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (constituencyId) {
        where.constituencyId = constituencyId;
      }
      if (countyId) {
        where.constituency = {
          countyId: countyId,
        };
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [caws, total] = await Promise.all([
        prisma.cAW.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            constituency: {
              select: {
                id: true,
                code: true,
                name: true,
                county: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                pollingStations: true,
              },
            },
          },
        }),
        prisma.cAW.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          caws,
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

// Get CAW by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const caw = await prisma.cAW.findUnique({
        where: { id },
        include: {
          constituency: {
            select: {
              id: true,
              code: true,
              name: true,
              county: {
                select: {
                  id: true,
                  code: true,
                  name: true,
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
              pollingStations: true,
            },
          },
        },
      });

      if (!caw) {
        return next(new AppError('CAW not found'));
      }

      res.json({
        success: true,
        data: { caw },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create CAW (admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateRequest(schemas.caw),
  logUserAction('CREATE', 'CAW'),
  async (req, res, next) => {
    try {
      const { code, name, constituencyId } = req.body;

      // Check if constituency exists
      const constituency = await prisma.constituency.findUnique({
        where: { id: constituencyId },
      });

      if (!constituency) {
        return next(new AppError('Constituency not found'));
      }

      // Check if CAW with code already exists
      const existingCAW = await prisma.cAW.findUnique({
        where: { code },
      });

      if (existingCAW) {
        return next(new AppError('CAW with this code already exists'));
      }

      const caw = await prisma.cAW.create({
        data: { code, name, constituencyId },
        include: {
          constituency: {
            select: {
              id: true,
              code: true,
              name: true,
              county: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'CAW created successfully',
        data: { caw },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update CAW (admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  validateRequest(schemas.cawUpdate),
  logUserAction('UPDATE', 'CAW'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if constituency is being updated and if it exists
      if (updateData.constituencyId) {
        const constituency = await prisma.constituency.findUnique({
          where: { id: updateData.constituencyId },
        });

        if (!constituency) {
          return next(new AppError('Constituency not found'));
        }
      }

      // Check if code is being updated and if it already exists
      if (updateData.code) {
        const existingCAW = await prisma.cAW.findFirst({
          where: {
            code: updateData.code,
            id: { not: id },
          },
        });

        if (existingCAW) {
          return next(new AppError('CAW with this code already exists'));
        }
      }

      const caw = await prisma.cAW.update({
        where: { id },
        data: updateData,
        include: {
          constituency: {
            select: {
              id: true,
              code: true,
              name: true,
              county: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'CAW updated successfully',
        data: { caw },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete CAW (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  logUserAction('DELETE', 'CAW'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if CAW has polling stations
      const pollingStationCount = await prisma.pollingStation.count({
        where: { cawId: id },
      });

      if (pollingStationCount > 0) {
        return next(new AppError('Cannot delete CAW with polling stations'));
      }

      await prisma.cAW.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'CAW deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Bulk import CAWs (admin only)
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateRequest(
    Joi.object({
      caws: Joi.array().items(schemas.caw).required(),
    })
  ),
  logUserAction('BULK_IMPORT', 'CAW'),
  async (req, res, next) => {
    try {
      const { caws } = req.body;

      // Check for duplicate codes
      const codes = caws.map((c: any) => c.code);
      const duplicateCodes = codes.filter(
        (code: string, index: number) => codes.indexOf(code) !== index
      );

      if (duplicateCodes.length > 0) {
        return next(
          new AppError(`Duplicate codes found: ${duplicateCodes.join(', ')}`)
        );
      }

      // Check for existing codes
      const existingCAWs = await prisma.cAW.findMany({
        where: {
          code: { in: codes },
        },
        select: { code: true },
      });

      if (existingCAWs.length > 0) {
        const existingCodes = existingCAWs.map((c: any) => c.code);
        return next(
          new AppError(
            `CAWs with these codes already exist: ${existingCodes.join(', ')}`
          )
        );
      }

      // Validate all constituency IDs exist
      const constituencyIds = [
        ...new Set(caws.map((c: any) => c.constituencyId)),
      ] as string[];
      const existingConstituencies = await prisma.constituency.findMany({
        where: {
          id: { in: constituencyIds },
        },
        select: { id: true },
      });

      if (existingConstituencies.length !== constituencyIds.length) {
        const existingConstituencyIds = existingConstituencies.map(
          (c: any) => c.id
        ) as string[];
        const missingConstituencyIds = constituencyIds.filter(
          (id) => !existingConstituencyIds.includes(id)
        );
        return next(
          new AppError(
            `Constituencies not found: ${missingConstituencyIds.join(', ')}`
          )
        );
      }

      // Create CAWs
      const createdCAWs = await prisma.cAW.createMany({
        data: caws,
      });

      res.status(201).json({
        success: true,
        message: `${createdCAWs.count} CAWs imported successfully`,
        data: { count: createdCAWs.count },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
