import express from 'express';
import { prisma } from '../utils/database';
import {
  authenticateToken,
  requireRole,
  requireIMEI,
  logUserAction,
  AuthRequest,
} from '../middleware/auth';
import {
  validateRequest,
  validateParams,
  validateQuery,
  schemas,
} from '../middleware/validation';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Get all incidents
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.pagination),
  async (req, res, next) => {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        pollingStationId,
        incidentType,
        severity,
        isResolved,
      } = req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (pollingStationId) where.pollingStationId = pollingStationId;
      if (incidentType) where.incidentType = incidentType;
      if (severity) where.severity = severity;
      if (isResolved !== undefined) where.isResolved = isResolved === 'true';

      const [incidents, total] = await Promise.all([
        prisma.incident.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            pollingStation: {
              select: {
                id: true,
                code: true,
                name: true,
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
            },
            reporter: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            media: true,
          },
        }),
        prisma.incident.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          incidents,
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

// Get incident by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const incident = await prisma.incident.findUnique({
        where: { id },
        include: {
          pollingStation: {
            select: {
              id: true,
              code: true,
              name: true,
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
          },
          reporter: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          media: true,
        },
      });

      if (!incident) {
        return next(new AppError('Incident not found'));
      }

      res.json({
        success: true,
        data: { incident },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Submit incident (mobile app only)
router.post(
  '/',
  authenticateToken,
  requireIMEI,
  validateRequest(schemas.incident),
  logUserAction('CREATE', 'Incident'),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        pollingStationId,
        title,
        description,
        incidentType,
        severity,
        latitude,
        longitude,
      } = req.body;

      // Verify polling station exists
      const pollingStation = await prisma.pollingStation.findUnique({
        where: { id: pollingStationId },
      });

      if (!pollingStation) {
        return next(new AppError('Polling station not found'));
      }

      const incident = await prisma.incident.create({
        data: {
          pollingStationId,
          title,
          description,
          incidentType,
          severity,
          latitude,
          longitude,
          reporterId: req.user!.id,
        },
        include: {
          pollingStation: {
            select: {
              id: true,
              code: true,
              name: true,
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
          },
          reporter: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Incident reported successfully',
        data: { incident },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update incident (mobile app only)
router.put(
  '/:id',
  authenticateToken,
  requireIMEI,
  validateParams(schemas.id),
  validateRequest(schemas.incident),
  logUserAction('UPDATE', 'Incident'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const {
        pollingStationId,
        title,
        description,
        incidentType,
        severity,
        latitude,
        longitude,
      } = req.body;

      // Check if incident exists and belongs to the reporter
      const existingIncident = await prisma.incident.findFirst({
        where: {
          id,
          reporterId: req.user!.id,
        },
      });

      if (!existingIncident) {
        return next(new AppError('Incident not found or access denied'));
      }

      // Verify polling station exists
      const pollingStation = await prisma.pollingStation.findUnique({
        where: { id: pollingStationId },
      });

      if (!pollingStation) {
        return next(new AppError('Polling station not found'));
      }

      const incident = await prisma.incident.update({
        where: { id },
        data: {
          pollingStationId,
          title,
          description,
          incidentType,
          severity,
          latitude,
          longitude,
        },
        include: {
          pollingStation: {
            select: {
              id: true,
              code: true,
              name: true,
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
          },
          reporter: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Incident updated successfully',
        data: { incident },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Resolve incident (admin only)
router.put(
  '/:id/resolve',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  logUserAction('RESOLVE', 'Incident'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const incident = await prisma.incident.update({
        where: { id },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
        },
        include: {
          pollingStation: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          reporter: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Incident resolved successfully',
        data: { incident },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
