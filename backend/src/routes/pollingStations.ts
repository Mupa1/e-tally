import express from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { authenticateToken, logUserAction } from '../middleware/auth';
import { requireRole, requireAdmin } from '../middleware/authorization';
import { validateQuery, validateRequest } from '../middleware/validation';
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { prisma } from '../utils/database';

const router = express.Router();

// Optimized validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(1000).default(50), // Increased max limit
  sortBy: Joi.string()
    .valid('name', 'code', 'createdAt', 'updatedAt', 'registeredVoters')
    .default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  search: Joi.string().allow('').optional(),
  constituencyId: Joi.string().optional(),
  cawId: Joi.string().optional(),
  countyId: Joi.string().optional(),
  // Cursor-based pagination for better performance
  cursor: Joi.string().optional(),
  // Field selection for performance
  fields: Joi.string().optional(), // Comma-separated field list
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

const updatePollingStationSchema = Joi.object({
  code: Joi.string().optional(),
  name: Joi.string().optional(),
  constituencyId: Joi.string().optional(),
  cawId: Joi.string().optional(),
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

// Optimized field selection for different use cases
const getSelectFields = (fields?: string) => {
  const defaultFields = {
    id: true,
    code: true,
    name: true,
    latitude: true,
    longitude: true,
    address: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    constituencyId: true,
    cawId: true,
  };

  if (!fields) return defaultFields;

  const requestedFields = fields.split(',').map((f) => f.trim());
  const selectedFields: any = {};

  requestedFields.forEach((field) => {
    if (defaultFields.hasOwnProperty(field)) {
      selectedFields[field] = true;
    }
  });

  return selectedFields;
};

// GET /api/polling-stations - Highly optimized for 40k+ records
router.get(
  '/',
  authenticateToken,
  validateQuery(paginationSchema),
  async (req, res, next) => {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        constituencyId,
        cawId,
        countyId,
        cursor,
        fields,
      } = req.query as any;

      const selectFields = getSelectFields(fields);
      const skip = (page - 1) * limit;

      // Build optimized where clause
      const where: any = {
        isActive: true, // Only active polling stations
      };

      // Add filters
      if (constituencyId) where.constituencyId = constituencyId;
      if (cawId) where.cawId = cawId;
      if (countyId) {
        where.constituency = { countyId };
      }

      // Optimized search - use database indexes
      if (search) {
        const searchTerm = search.trim();
        if (searchTerm.length >= 2) {
          // Minimum search length for performance
          where.OR = [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { code: { contains: searchTerm, mode: 'insensitive' } },
            { address: { contains: searchTerm, mode: 'insensitive' } },
          ];
        }
      }

      // Optimized sorting
      const orderBy: any = {};
      if (sortBy === 'registeredVoters') {
        // Special handling for registered voters (requires join)
        orderBy.voterRegistration = { _count: sortOrder };
      } else {
        orderBy[sortBy] = sortOrder;
      }

      // Use cursor-based pagination for better performance on large datasets
      let paginationClause: any = {};
      if (cursor) {
        paginationClause = {
          cursor: { id: cursor },
          skip: 1, // Skip the cursor record
        };
      } else {
        paginationClause = { skip, take: limit };
      }

      // Optimized query with selective field loading
      const [pollingStations, total] = await Promise.all([
        prisma.pollingStation.findMany({
          where,
          select: {
            ...selectFields,
            // Always include relationships for context
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
            // Load voter registration count and sum
            _count: {
              select: {
                voterRegistration: true,
              },
            },
            // Sum of registered voters across all voter registration records
            voterRegistration: {
              select: {
                registeredVoters: true,
              },
            },
          },
          orderBy,
          ...paginationClause,
        }),
        // Only count if not using cursor pagination
        cursor ? null : prisma.pollingStation.count({ where }),
      ]);

      // Calculate pagination info
      const totalCount = total || 0;
      const hasNextPage = pollingStations.length === limit;
      const nextCursor = hasNextPage
        ? pollingStations[pollingStations.length - 1]?.id
        : null;

      // Calculate total registered voters for each polling station
      const pollingStationsWithVoterCount = pollingStations.map(
        (station: any) => ({
          ...station,
          totalRegisteredVoters:
            station.voterRegistration?.reduce(
              (sum: number, reg: any) => sum + reg.registeredVoters,
              0
            ) || 0,
        })
      );

      res.json({
        success: true,
        data: {
          pollingStations: pollingStationsWithVoterCount,
          pagination: {
            total: totalCount,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            totalPages: Math.ceil(totalCount / (parseInt(limit) || 50)),
            hasNextPage,
            nextCursor,
          },
        },
      });
    } catch (error: any) {
      logger.error('Error fetching polling stations:', error);
      next(new AppError('Failed to fetch polling stations', 500));
    }
  }
);

// GET /api/polling-stations/stats - Get polling station statistics
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const { countyId, constituencyId, pollingStationId } = req.query as any;

    const where: any = { isActive: true };
    if (countyId) where.constituency = { countyId };
    if (constituencyId) where.constituencyId = constituencyId;
    if (pollingStationId) where.id = pollingStationId;

    // Get polling station details if specific polling station requested
    let pollingStation = null;
    if (pollingStationId) {
      pollingStation = await prisma.pollingStation.findUnique({
        where: { id: pollingStationId },
        include: {
          constituency: {
            include: {
              county: true,
            },
          },
          caw: true,
          _count: {
            select: {
              voterRegistration: true,
            },
          },
        },
      });
    }

    const [totalCount, byCounty, byConstituency, voterStats] =
      await Promise.all([
        prisma.pollingStation.count({ where }),
        prisma.pollingStation.groupBy({
          by: ['constituencyId'],
          where,
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),
        prisma.pollingStation.groupBy({
          by: ['cawId'],
          where,
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),
        prisma.voterRegistration.aggregate({
          where: {
            pollingStation: pollingStationId
              ? { id: pollingStationId }
              : { isActive: true },
          },
          _sum: { registeredVoters: true },
          _avg: { registeredVoters: true },
          _max: { registeredVoters: true },
          _min: { registeredVoters: true },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalCount,
        pollingStation,
        byCounty,
        byConstituency,
        voterStats: {
          totalRegisteredVoters: voterStats._sum.registeredVoters || 0,
          averageRegisteredVoters: voterStats._avg.registeredVoters || 0,
          maxRegisteredVoters: voterStats._max.registeredVoters || 0,
          minRegisteredVoters: voterStats._min.registeredVoters || 0,
        },
      },
    });
  } catch (error: any) {
    logger.error('Error fetching polling station stats:', error);
    next(new AppError('Failed to fetch polling station statistics', 500));
  }
});

// GET /api/polling-stations/:id - Get polling station by ID (optimized)
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fields } = req.query as any;

    const selectFields = getSelectFields(fields);

    const pollingStation = await prisma.pollingStation.findUnique({
      where: { id, isActive: true },
      select: {
        ...selectFields,
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
          take: 5, // Limit to recent registrations
          select: {
            id: true,
            registeredVoters: true,
            source: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            voterRegistration: true,
          },
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

// POST /api/polling-stations - Create new polling station (optimized)
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

      // Use transaction for data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Check if polling station code already exists
        const existingStation = await tx.pollingStation.findUnique({
          where: { code },
          select: { id: true },
        });

        if (existingStation) {
          throw new AppError(
            'Polling station with this code already exists',
            400
          );
        }

        // Verify constituency and CAW exist and are related (optimized query)
        const constituency = await tx.constituency.findUnique({
          where: { id: constituencyId },
          select: {
            id: true,
            caws: {
              where: { id: cawId },
              select: { id: true },
            },
          },
        });

        if (!constituency) {
          throw new AppError('Constituency not found', 404);
        }

        if (constituency.caws.length === 0) {
          throw new AppError(
            'CAW not found or not associated with this constituency',
            404
          );
        }

        // Create polling station
        const pollingStation = await tx.pollingStation.create({
          data: {
            code,
            name,
            constituencyId,
            cawId,
            latitude,
            longitude,
            address,
          },
          select: {
            id: true,
            code: true,
            name: true,
            latitude: true,
            longitude: true,
            address: true,
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

        // Create voter registration record if provided
        if (registeredVoters && registeredVoters > 0) {
          await tx.voterRegistration.create({
            data: {
              pollingStationId: pollingStation.id,
              registeredVoters,
              source: 'Manual Entry',
            },
          });
        }

        return pollingStation;
      });

      logger.info(`Polling station created: ${result.code} - ${result.name}`);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Polling station created successfully',
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return next(error);
      }
      logger.error('Error creating polling station:', error);
      next(new AppError('Failed to create polling station', 500));
    }
  }
);

// PUT /api/polling-stations/:id - Update polling station (optimized)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  logUserAction('UPDATE', 'POLLING_STATION'),
  validateRequest(updatePollingStationSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await prisma.$transaction(async (tx) => {
        // Check if polling station exists
        const existingStation = await tx.pollingStation.findUnique({
          where: { id, isActive: true },
          select: { id: true, code: true },
        });

        if (!existingStation) {
          throw new AppError('Polling station not found', 404);
        }

        // Check if code is being changed and if new code already exists
        if (updateData.code && updateData.code !== existingStation.code) {
          const codeExists = await tx.pollingStation.findUnique({
            where: { code: updateData.code },
            select: { id: true },
          });

          if (codeExists) {
            throw new AppError(
              'Polling station with this code already exists',
              400
            );
          }
        }

        // Verify constituency and CAW if being updated
        if (updateData.constituencyId || updateData.cawId) {
          const constituencyId = updateData.constituencyId;
          const cawId = updateData.cawId;

          const constituency = await tx.constituency.findUnique({
            where: { id: constituencyId },
            select: {
              id: true,
              caws: {
                where: { id: cawId },
                select: { id: true },
              },
            },
          });

          if (!constituency) {
            throw new AppError('Constituency not found', 404);
          }

          if (constituency.caws.length === 0) {
            throw new AppError(
              'CAW not found or not associated with this constituency',
              404
            );
          }
        }

        // Update polling station
        const pollingStation = await tx.pollingStation.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            code: true,
            name: true,
            latitude: true,
            longitude: true,
            address: true,
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

        return pollingStation;
      });

      logger.info(`Polling station updated: ${result.code} - ${result.name}`);

      res.json({
        success: true,
        data: result,
        message: 'Polling station updated successfully',
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return next(error);
      }
      logger.error('Error updating polling station:', error);
      next(new AppError('Failed to update polling station', 500));
    }
  }
);

// DELETE /api/polling-stations/:id - Delete polling station (soft delete)
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  logUserAction('DELETE', 'POLLING_STATION'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingStation = await prisma.pollingStation.findUnique({
        where: { id, isActive: true },
        select: { id: true, code: true, name: true },
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

// POST /api/polling-stations/bulk-upload - Optimized bulk upload
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

      // Process in optimized batches
      const batchSize = 500; // Increased batch size for better performance

      for (let i = 0; i < pollingStations.length; i += batchSize) {
        const batch = pollingStations.slice(i, i + batchSize);

        // Process batch in parallel
        const batchPromises = batch.map(async (stationData: any) => {
          try {
            return await prisma.$transaction(async (tx) => {
              // Find or create county (optimized)
              let county = await tx.county.findFirst({
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
                select: { id: true, code: true, name: true },
              });

              if (!county) {
                county = await tx.county.create({
                  data: {
                    code: stationData.countyCode,
                    name: stationData.countyName,
                  },
                  select: { id: true, code: true, name: true },
                });
              }

              // Find or create constituency (optimized)
              let constituency = await tx.constituency.findFirst({
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
                select: { id: true, code: true, name: true },
              });

              if (!constituency) {
                constituency = await tx.constituency.create({
                  data: {
                    code: stationData.constCode,
                    name: stationData.constName,
                    countyId: county.id,
                  },
                  select: { id: true, code: true, name: true },
                });
              }

              // Find or create CAW (optimized)
              let caw = await tx.cAW.findFirst({
                where: {
                  OR: [
                    { code: stationData.cawCode },
                    {
                      name: {
                        equals: stationData.cawName,
                        mode: 'insensitive',
                      },
                    },
                  ],
                  constituencyId: constituency.id,
                },
                select: { id: true, code: true, name: true },
              });

              if (!caw) {
                caw = await tx.cAW.create({
                  data: {
                    code: stationData.cawCode,
                    name: stationData.cawName,
                    constituencyId: constituency.id,
                  },
                  select: { id: true, code: true, name: true },
                });
              }

              // Check if polling station already exists
              const existingStation = await tx.pollingStation.findUnique({
                where: { code: stationData.pollingStationCode },
                select: { id: true },
              });

              if (existingStation) {
                throw new Error('Polling station already exists');
              }

              // Create polling station
              const pollingStation = await tx.pollingStation.create({
                data: {
                  code: stationData.pollingStationCode,
                  name: stationData.pollingStationName,
                  constituencyId: constituency.id,
                  cawId: caw.id,
                  address: stationData.regCentreName,
                },
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              });

              // Create voter registration record
              if (stationData.registeredVoters > 0) {
                await tx.voterRegistration.create({
                  data: {
                    pollingStationId: pollingStation.id,
                    registeredVoters: stationData.registeredVoters,
                    source: 'IEBC Import',
                  },
                });
              }

              return {
                code: pollingStation.code,
                name: pollingStation.name,
                county: county.name,
                constituency: constituency.name,
                caw: caw.name,
                registeredVoters: stationData.registeredVoters,
              };
            });
          } catch (error: any) {
            throw {
              code: stationData.pollingStationCode,
              name: stationData.pollingStationName,
              error: error.message,
            };
          }
        });

        // Wait for batch to complete
        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            results.successful++;
            results.created.push(result.value);
          } else {
            results.failed++;
            results.errors.push(result.reason);
          }
        });
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

// POST /api/polling-stations/bulk-update - Bulk update polling stations
router.post(
  '/bulk-update',
  authenticateToken,
  requireAdmin,
  logUserAction('BULK_UPDATE', 'POLLING_STATION'),
  validateRequest(
    Joi.object({
      updates: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().required(),
            data: updatePollingStationSchema.required(),
          })
        )
        .min(1)
        .max(1000)
        .required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { updates } = req.body;

      const results = {
        total: updates.length,
        successful: 0,
        failed: 0,
        errors: [] as any[],
      };

      // Process in batches
      const batchSize = 100;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);

        const batchPromises = batch.map(async (update: any) => {
          try {
            await prisma.pollingStation.update({
              where: { id: update.id, isActive: true },
              data: update.data,
            });
            return { id: update.id, success: true };
          } catch (error: any) {
            return {
              id: update.id,
              success: false,
              error: error.message,
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach((result) => {
          if (result.success) {
            results.successful++;
          } else {
            results.failed++;
            results.errors.push(result);
          }
        });
      }

      res.json({
        success: true,
        data: results,
        message: `Bulk update completed: ${results.successful} successful, ${results.failed} failed`,
      });
    } catch (error: any) {
      logger.error('Error in bulk update:', error);
      next(new AppError('Failed to process bulk update', 500));
    }
  }
);

export default router;
