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

// Get all polling stations
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, constituencyId, cawId } =
        req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (constituencyId) where.constituencyId = constituencyId;
      if (cawId) where.cawId = cawId;

      const [pollingStations, total] = await Promise.all([
        prisma.pollingStation.findMany({
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
            caw: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
            _count: {
              select: {
                voterRegistration: true,
                electionResults: true,
                incidents: true,
              },
            },
          },
        }),
        prisma.pollingStation.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          pollingStations,
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

// Get polling station by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const pollingStation = await prisma.pollingStation.findUnique({
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
          caw: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          voterRegistration: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          electionResults: {
            include: {
              candidate: {
                select: {
                  id: true,
                  name: true,
                  party: true,
                  electionType: true,
                },
              },
            },
          },
          incidents: {
            include: {
              media: true,
            },
          },
        },
      });

      if (!pollingStation) {
        return next(new AppError('Polling station not found'));
      }

      res.json({
        success: true,
        data: { pollingStation },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create polling station (admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateRequest(
    Joi.object({
      code: Joi.string().required(),
      name: Joi.string().required(),
      constituencyId: Joi.string().required(),
      cawId: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      address: Joi.string().optional(),
    })
  ),
  logUserAction('CREATE', 'PollingStation'),
  async (req, res, next) => {
    try {
      const {
        code,
        name,
        constituencyId,
        cawId,
        latitude,
        longitude,
        address,
      } = req.body;

      // Check if constituency exists
      const constituency = await prisma.constituency.findUnique({
        where: { id: constituencyId },
      });

      if (!constituency) {
        return next(new AppError('Constituency not found'));
      }

      // Check if CAW exists and belongs to the constituency
      const caw = await prisma.cAW.findFirst({
        where: {
          id: cawId,
          constituencyId,
        },
      });

      if (!caw) {
        return next(
          new AppError('CAW not found or does not belong to the constituency')
        );
      }

      // Check if polling station with code already exists
      const existingPollingStation = await prisma.pollingStation.findUnique({
        where: { code },
      });

      if (existingPollingStation) {
        return next(
          new AppError('Polling station with this code already exists')
        );
      }

      const pollingStation = await prisma.pollingStation.create({
        data: {
          code,
          name,
          constituencyId,
          cawId,
          latitude,
          longitude,
          address,
        },
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
          caw: {
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
        message: 'Polling station created successfully',
        data: { pollingStation },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update polling station (admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  validateRequest(
    Joi.object({
      code: Joi.string().optional(),
      name: Joi.string().optional(),
      constituencyId: Joi.string().optional(),
      cawId: Joi.string().optional(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      address: Joi.string().optional(),
      isActive: Joi.boolean().optional(),
    })
  ),
  logUserAction('UPDATE', 'PollingStation'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate constituency and CAW if being updated
      if (updateData.constituencyId || updateData.cawId) {
        const constituencyId = updateData.constituencyId;
        const cawId = updateData.cawId;

        if (constituencyId) {
          const constituency = await prisma.constituency.findUnique({
            where: { id: constituencyId },
          });

          if (!constituency) {
            return next(new AppError('Constituency not found'));
          }
        }

        if (cawId) {
          const caw = await prisma.cAW.findFirst({
            where: {
              id: cawId,
              ...(constituencyId && { constituencyId }),
            },
          });

          if (!caw) {
            return next(
              new AppError(
                'CAW not found or does not belong to the constituency'
              )
            );
          }
        }
      }

      // Check if code is being updated and if it already exists
      if (updateData.code) {
        const existingPollingStation = await prisma.pollingStation.findFirst({
          where: {
            code: updateData.code,
            id: { not: id },
          },
        });

        if (existingPollingStation) {
          return next(
            new AppError('Polling station with this code already exists')
          );
        }
      }

      const pollingStation = await prisma.pollingStation.update({
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
          caw: {
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
        message: 'Polling station updated successfully',
        data: { pollingStation },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete polling station (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  logUserAction('DELETE', 'PollingStation'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if polling station has election results or incidents
      const [resultCount, incidentCount] = await Promise.all([
        prisma.electionResult.count({
          where: { pollingStationId: id },
        }),
        prisma.incident.count({
          where: { pollingStationId: id },
        }),
      ]);

      if (resultCount > 0 || incidentCount > 0) {
        return next(
          new AppError(
            'Cannot delete polling station with election results or incidents'
          )
        );
      }

      await prisma.pollingStation.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Polling station deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
