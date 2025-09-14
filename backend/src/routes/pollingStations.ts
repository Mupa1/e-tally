import express from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { authenticateToken, logUserAction } from '../middleware/auth';
import { requireRole, requireAdmin } from '../middleware/authorization';
import { validateQuery, validateRequest } from '../middleware/validation';
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid('name', 'code', 'createdAt', 'updatedAt')
    .default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().allow('').optional(),
});

const createPollingStationSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  constituencyId: Joi.string().required(),
  cawId: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  address: Joi.string().allow('').optional(),
  registeredVoters: Joi.number().integer().min(0).optional(),
});

const bulkUploadSchema = Joi.object({
  pollingStations: Joi.array()
    .items(
      Joi.object({
        countyCode: Joi.string().required(),
        countyName: Joi.string().required(),
        constCode: Joi.string().required(),
        constName: Joi.string().required(),
        cawCode: Joi.string().required(),
        cawName: Joi.string().required(),
        regCentreCode: Joi.string().required(),
        regCentreName: Joi.string().required(),
        pollingStationCode: Joi.string().required(),
        pollingStationName: Joi.string().required(),
        registeredVoters: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .max(10000)
    .required(),
});

// GET /api/polling-stations - Get all polling stations with pagination and search
router.get(
  '/',
  authenticateToken,
  validateQuery(paginationSchema),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, sortOrder, search } = req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        const searchTerms = search.trim().split(/\s+/);
        if (searchTerms.length === 1) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ];
        } else {
          const searchConditions: any[] = [];
          searchTerms.forEach((term: string) => {
            searchConditions.push(
              { name: { contains: term, mode: 'insensitive' } },
              { code: { contains: term, mode: 'insensitive' } },
              { address: { contains: term, mode: 'insensitive' } }
            );
          });
          where.OR = searchConditions;
        }
      }

      const total = await prisma.pollingStation.count({ where });
      const pollingStations = await prisma.pollingStation.findMany({
        where,
        include: {
          constituency: {
            include: {
              county: true,
            },
          },
          caw: true,
          voterRegistration: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
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
          pollingStations,
          pagination: {
            total,
            page: parseInt(page as string) || 1,
            limit: parseInt(limit as string) || 10,
            totalPages: Math.ceil(total / (parseInt(limit as string) || 10)),
          },
        },
      });
    } catch (error: any) {
      logger.error('Error fetching polling stations:', error);
      next(new AppError('Failed to fetch polling stations', 500));
    }
  }
);

// GET /api/polling-stations/:id - Get polling station by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const pollingStation = await prisma.pollingStation.findUnique({
      where: { id },
      include: {
        constituency: {
          include: {
            county: true,
          },
        },
        caw: true,
        voterRegistration: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!pollingStation) {
      return next(new AppError('Polling station not found', 404));
    }

    res.json({
      success: true,
      data: pollingStation,
    });
  } catch (error: any) {
    logger.error('Error fetching polling station:', error);
    next(new AppError('Failed to fetch polling station', 500));
  }
});

// POST /api/polling-stations - Create new polling station
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  logUserAction('CREATE', 'POLLING_STATION'),
  validateRequest(createPollingStationSchema),
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
        registeredVoters,
      } = req.body;

      // Check if polling station code already exists
      const existingStation = await prisma.pollingStation.findUnique({
        where: { code },
      });

      if (existingStation) {
        return next(
          new AppError('Polling station with this code already exists', 400)
        );
      }

      // Verify constituency and CAW exist and are related
      const constituency = await prisma.constituency.findUnique({
        where: { id: constituencyId },
        include: { caws: true },
      });

      if (!constituency) {
        return next(new AppError('Constituency not found', 404));
      }

      const caw = constituency.caws.find((c) => c.id === cawId);
      if (!caw) {
        return next(
          new AppError(
            'CAW not found or not associated with this constituency',
            404
          )
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
            include: {
              county: true,
            },
          },
          caw: true,
        },
      });

      // Create voter registration record if provided
      if (registeredVoters && registeredVoters > 0) {
        await prisma.voterRegistration.create({
          data: {
            pollingStationId: pollingStation.id,
            registeredVoters,
            source: 'Manual Entry',
          },
        });
      }

      logger.info(
        `Polling station created: ${pollingStation.code} - ${pollingStation.name}`
      );

      res.status(201).json({
        success: true,
        data: pollingStation,
        message: 'Polling station created successfully',
      });
    } catch (error: any) {
      logger.error('Error creating polling station:', error);
      next(new AppError('Failed to create polling station', 500));
    }
  }
);

// POST /api/polling-stations/bulk-upload - Bulk upload polling stations
router.post(
  '/bulk-upload',
  authenticateToken,
  requireAdmin,
  logUserAction('BULK_UPLOAD', 'POLLING_STATION'),
  validateRequest(bulkUploadSchema),
  async (req, res, next) => {
    try {
      const { pollingStations } = req.body;

      logger.info(
        `Starting bulk upload of ${pollingStations.length} polling stations`
      );

      const results = {
        total: pollingStations.length,
        successful: 0,
        failed: 0,
        errors: [] as any[],
        created: [] as any[],
      };

      // Process in batches to avoid memory issues
      const batchSize = 100;
      for (let i = 0; i < pollingStations.length; i += batchSize) {
        const batch = pollingStations.slice(i, i + batchSize);

        for (const stationData of batch) {
          try {
            // Find or create county
            let county = await prisma.county.findFirst({
              where: {
                OR: [
                  { code: stationData.countyCode },
                  {
                    name: {
                      equals: stationData.countyName,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            });

            if (!county) {
              county = await prisma.county.create({
                data: {
                  code: stationData.countyCode,
                  name: stationData.countyName,
                },
              });
              logger.info(`Created county: ${county.code} - ${county.name}`);
            }

            // Find or create constituency
            let constituency = await prisma.constituency.findFirst({
              where: {
                OR: [
                  { code: stationData.constCode },
                  {
                    name: {
                      equals: stationData.constName,
                      mode: 'insensitive',
                    },
                  },
                ],
                countyId: county.id,
              },
            });

            if (!constituency) {
              constituency = await prisma.constituency.create({
                data: {
                  code: stationData.constCode,
                  name: stationData.constName,
                  countyId: county.id,
                },
              });
              logger.info(
                `Created constituency: ${constituency.code} - ${constituency.name}`
              );
            }

            // Find or create CAW
            let caw = await prisma.cAW.findFirst({
              where: {
                OR: [
                  { code: stationData.cawCode },
                  {
                    name: { equals: stationData.cawName, mode: 'insensitive' },
                  },
                ],
                constituencyId: constituency.id,
              },
            });

            if (!caw) {
              caw = await prisma.cAW.create({
                data: {
                  code: stationData.cawCode,
                  name: stationData.cawName,
                  constituencyId: constituency.id,
                },
              });
              logger.info(`Created CAW: ${caw.code} - ${caw.name}`);
            }

            // Check if polling station already exists
            const existingStation = await prisma.pollingStation.findUnique({
              where: { code: stationData.pollingStationCode },
            });

            if (existingStation) {
              results.failed++;
              results.errors.push({
                code: stationData.pollingStationCode,
                name: stationData.pollingStationName,
                error: 'Polling station already exists',
              });
              continue;
            }

            // Create polling station
            const pollingStation = await prisma.pollingStation.create({
              data: {
                code: stationData.pollingStationCode,
                name: stationData.pollingStationName,
                constituencyId: constituency.id,
                cawId: caw.id,
                address: stationData.regCentreName,
              },
            });

            // Create voter registration record
            if (stationData.registeredVoters > 0) {
              await prisma.voterRegistration.create({
                data: {
                  pollingStationId: pollingStation.id,
                  registeredVoters: stationData.registeredVoters,
                  source: 'IEBC Import',
                },
              });
            }

            results.successful++;
            results.created.push({
              code: pollingStation.code,
              name: pollingStation.name,
              county: county.name,
              constituency: constituency.name,
              caw: caw.name,
              registeredVoters: stationData.registeredVoters,
            });
          } catch (error: any) {
            results.failed++;
            results.errors.push({
              code: stationData.pollingStationCode,
              name: stationData.pollingStationName,
              error: error.message,
            });
            logger.error(
              `Error processing polling station ${stationData.pollingStationCode}:`,
              error
            );
          }
        }
      }

      logger.info(
        `Bulk upload completed: ${results.successful} successful, ${results.failed} failed`
      );

      res.json({
        success: true,
        data: results,
        message: `Bulk upload completed: ${results.successful} successful, ${results.failed} failed`,
      });
    } catch (error: any) {
      logger.error('Error in bulk upload:', error);
      next(new AppError('Failed to process bulk upload', 500));
    }
  }
);

// PUT /api/polling-stations/:id - Update polling station
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  logUserAction('UPDATE', 'POLLING_STATION'),
  validateRequest(createPollingStationSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        code,
        name,
        constituencyId,
        cawId,
        latitude,
        longitude,
        address,
      } = req.body;

      // Check if polling station exists
      const existingStation = await prisma.pollingStation.findUnique({
        where: { id },
      });

      if (!existingStation) {
        return next(new AppError('Polling station not found', 404));
      }

      // Check if code is being changed and if new code already exists
      if (code !== existingStation.code) {
        const codeExists = await prisma.pollingStation.findUnique({
          where: { code },
        });

        if (codeExists) {
          return next(
            new AppError('Polling station with this code already exists', 400)
          );
        }
      }

      // Verify constituency and CAW exist and are related
      const constituency = await prisma.constituency.findUnique({
        where: { id: constituencyId },
        include: { caws: true },
      });

      if (!constituency) {
        return next(new AppError('Constituency not found', 404));
      }

      const caw = constituency.caws.find((c) => c.id === cawId);
      if (!caw) {
        return next(
          new AppError(
            'CAW not found or not associated with this constituency',
            404
          )
        );
      }

      const pollingStation = await prisma.pollingStation.update({
        where: { id },
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
            include: {
              county: true,
            },
          },
          caw: true,
        },
      });

      logger.info(
        `Polling station updated: ${pollingStation.code} - ${pollingStation.name}`
      );

      res.json({
        success: true,
        data: pollingStation,
        message: 'Polling station updated successfully',
      });
    } catch (error: any) {
      logger.error('Error updating polling station:', error);
      next(new AppError('Failed to update polling station', 500));
    }
  }
);

// DELETE /api/polling-stations/:id - Delete polling station
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  logUserAction('DELETE', 'POLLING_STATION'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if polling station exists
      const existingStation = await prisma.pollingStation.findUnique({
        where: { id },
      });

      if (!existingStation) {
        return next(new AppError('Polling station not found', 404));
      }

      // Soft delete by setting isActive to false
      await prisma.pollingStation.update({
        where: { id },
        data: { isActive: false },
      });

      logger.info(
        `Polling station deleted: ${existingStation.code} - ${existingStation.name}`
      );

      res.json({
        success: true,
        message: 'Polling station deleted successfully',
      });
    } catch (error: any) {
      logger.error('Error deleting polling station:', error);
      next(new AppError('Failed to delete polling station', 500));
    }
  }
);

export default router;
