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

// Get all counties
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder } = req.query as any;
      const skip = (page - 1) * limit;

      const [counties, total] = await Promise.all([
        prisma.county.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: {
              select: {
                constituencies: true,
              },
            },
          },
        }),
        prisma.county.count(),
      ]);

      res.json({
        success: true,
        data: {
          counties,
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
    } catch (error) {
      next(error);
    }
  }
);

// Create county (admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
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
    } catch (error) {
      next(error);
    }
  }
);

// Update county (admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
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
    } catch (error) {
      next(error);
    }
  }
);

// Delete county (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
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
    } catch (error) {
      next(error);
    }
  }
);

// Bulk import counties (admin only)
router.post(
  '/bulk-import',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
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
    } catch (error) {
      next(error);
    }
  }
);

export default router;
