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

// Get all election results
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
        candidateId,
        electionType,
      } = req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (pollingStationId) where.pollingStationId = pollingStationId;
      if (candidateId) where.candidateId = candidateId;
      if (electionType) {
        where.electionType = electionType;
      }

      const [results, total] = await Promise.all([
        prisma.electionResult.findMany({
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
            candidate: {
              select: {
                id: true,
                name: true,
                party: true,
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
        }),
        prisma.electionResult.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          results,
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

// Get election result by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await prisma.electionResult.findUnique({
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
          candidate: {
            select: {
              id: true,
              name: true,
              party: true,
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

      if (!result) {
        return next(new AppError('Election result not found'));
      }

      res.json({
        success: true,
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Submit election result (mobile app only)
router.post(
  '/',
  authenticateToken,
  requireIMEI,
  validateRequest(schemas.electionResult),
  logUserAction('CREATE', 'ElectionResult'),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        pollingStationId,
        candidateId,
        electionType,
        votes,
        spoiltVotes = 0,
      } = req.body;

      // Verify polling station exists and get voter registration data
      const pollingStation = await prisma.pollingStation.findUnique({
        where: { id: pollingStationId },
        include: {
          voterRegistration: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!pollingStation) {
        return next(new AppError('Polling station not found'));
      }

      // Verify candidate exists
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        return next(new AppError('Candidate not found'));
      }

      // Check if result already exists for this polling station and candidate
      const existingResult = await prisma.electionResult.findUnique({
        where: {
          pollingStationId_candidateId: {
            pollingStationId,
            candidateId,
          },
        },
      });

      if (existingResult) {
        return next(
          new AppError(
            'Election result already exists for this polling station and candidate'
          )
        );
      }

      // Calculate total votes and voter turnout
      const totalVotes = votes + spoiltVotes;
      const registeredVoters =
        pollingStation.voterRegistration[0]?.registeredVoters || 0;
      const voterTurnout =
        registeredVoters > 0 ? (totalVotes / registeredVoters) * 100 : 0;

      // Validate against registered voters
      if (totalVotes > registeredVoters) {
        return next(
          new AppError(
            `Total votes (${totalVotes}) cannot exceed registered voters (${registeredVoters})`
          )
        );
      }

      const result = await prisma.electionResult.create({
        data: {
          pollingStationId,
          candidateId,
          electionType,
          votes,
          spoiltVotes,
          totalVotes,
          voterTurnout,
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
          candidate: {
            select: {
              id: true,
              name: true,
              party: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Election result submitted successfully',
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update election result (mobile app only)
router.put(
  '/:id',
  authenticateToken,
  requireIMEI,
  validateParams(schemas.id),
  validateRequest(schemas.electionResult),
  logUserAction('UPDATE', 'ElectionResult'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const {
        pollingStationId,
        candidateId,
        votes,
        spoiltVotes = 0,
      } = req.body;

      // Check if result exists and belongs to the reporter
      const existingResult = await prisma.electionResult.findFirst({
        where: {
          id,
          reporterId: req.user!.id,
        },
      });

      if (!existingResult) {
        return next(new AppError('Election result not found or access denied'));
      }

      // Verify polling station exists and get voter registration data
      const pollingStation = await prisma.pollingStation.findUnique({
        where: { id: pollingStationId },
        include: {
          voterRegistration: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!pollingStation) {
        return next(new AppError('Polling station not found'));
      }

      // Verify candidate exists
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        return next(new AppError('Candidate not found'));
      }

      // Calculate total votes and voter turnout
      const totalVotes = votes + spoiltVotes;
      const registeredVoters =
        pollingStation.voterRegistration[0]?.registeredVoters || 0;
      const voterTurnout =
        registeredVoters > 0 ? (totalVotes / registeredVoters) * 100 : 0;

      // Validate against registered voters
      if (totalVotes > registeredVoters) {
        return next(
          new AppError(
            `Total votes (${totalVotes}) cannot exceed registered voters (${registeredVoters})`
          )
        );
      }

      const result = await prisma.electionResult.update({
        where: { id },
        data: {
          pollingStationId,
          candidateId,
          votes,
          spoiltVotes,
          totalVotes,
          voterTurnout,
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
          candidate: {
            select: {
              id: true,
              name: true,
              party: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Election result updated successfully',
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify election result (admin only)
router.put(
  '/:id/verify',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  logUserAction('VERIFY', 'ElectionResult'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const result = await prisma.electionResult.update({
        where: { id },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
        },
        include: {
          pollingStation: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          candidate: {
            select: {
              id: true,
              name: true,
              party: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Election result verified successfully',
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
