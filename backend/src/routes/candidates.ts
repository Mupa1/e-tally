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

// Get all candidates
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
        electionType,
        constituencyId,
        cawId,
      } = req.query as any;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (electionType) where.electionType = electionType;
      if (constituencyId) where.constituencyId = constituencyId;
      if (cawId) where.cawId = cawId;

      const [candidates, total] = await Promise.all([
        prisma.candidate.findMany({
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
                results: true,
              },
            },
          },
        }),
        prisma.candidate.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          candidates,
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

// Get candidate by ID
router.get(
  '/:id',
  authenticateToken,
  validateParams(schemas.id),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
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
          results: {
            include: {
              pollingStation: {
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

      if (!candidate) {
        return next(new AppError('Candidate not found'));
      }

      res.json({
        success: true,
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create candidate (admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateRequest(
    Joi.object({
      name: Joi.string().required(),
      party: Joi.string().optional(),
      electionType: Joi.string()
        .valid(
          'PRESIDENTIAL',
          'PARLIAMENTARY',
          'LOCAL_GOVERNMENT',
          'SENATORIAL',
          'GUBERNATORIAL',
          'COUNTY_ASSEMBLY_REPRESENTATIVE',
          'WOMENS_REPRESENTATIVE'
        )
        .required(),
      constituencyId: Joi.string().optional(),
      cawId: Joi.string().optional(),
    })
  ),
  logUserAction('CREATE', 'Candidate'),
  async (req, res, next) => {
    try {
      const { name, party, electionType, constituencyId, cawId } = req.body;

      // Validate constituency and CAW if provided
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
            new AppError('CAW not found or does not belong to the constituency')
          );
        }
      }

      const candidate = await prisma.candidate.create({
        data: { name, party, electionType, constituencyId, cawId },
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
        message: 'Candidate created successfully',
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update candidate (admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  validateRequest(
    Joi.object({
      name: Joi.string().optional(),
      party: Joi.string().optional(),
      electionType: Joi.string()
        .valid(
          'PRESIDENTIAL',
          'PARLIAMENTARY',
          'LOCAL_GOVERNMENT',
          'SENATORIAL',
          'GUBERNATORIAL',
          'COUNTY_ASSEMBLY_REPRESENTATIVE',
          'WOMENS_REPRESENTATIVE'
        )
        .optional(),
      constituencyId: Joi.string().optional(),
      cawId: Joi.string().optional(),
      isActive: Joi.boolean().optional(),
    })
  ),
  logUserAction('UPDATE', 'Candidate'),
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

      const candidate = await prisma.candidate.update({
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
        message: 'Candidate updated successfully',
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete candidate (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['CENTRAL_COMMAND_ADMIN']),
  validateParams(schemas.id),
  logUserAction('DELETE', 'Candidate'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if candidate has election results
      const resultCount = await prisma.electionResult.count({
        where: { candidateId: id },
      });

      if (resultCount > 0) {
        return next(
          new AppError('Cannot delete candidate with election results')
        );
      }

      await prisma.candidate.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Candidate deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
