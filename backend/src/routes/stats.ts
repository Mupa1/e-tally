import { Router } from 'express';
import { prisma } from '../utils/database';
import { authenticateToken } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const router = Router();

// GET /api/stats/electoral-area - Get electoral area statistics
router.get('/electoral-area', authenticateToken, async (req, res, next) => {
  try {
    // Get counts for all hierarchy levels
    const [
      totalCounties,
      totalConstituencies,
      totalWards,
      totalPollingStations,
      totalRegisteredVoters,
    ] = await Promise.all([
      prisma.county.count(),
      prisma.constituency.count(),
      prisma.cAW.count(),
      prisma.pollingStation.count(),
      prisma.voterRegistration.aggregate({
        _sum: {
          registeredVoters: true,
        },
      }),
    ]);

    const hierarchyStats = {
      totalCounties,
      totalConstituencies,
      totalWards,
      totalPollingStations,
      totalRegisteredVoters: totalRegisteredVoters._sum.registeredVoters || 0,
    };

    res.json({
      success: true,
      data: hierarchyStats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stats/electoral-positions - Get electoral positions statistics
router.get(
  '/electoral-positions',
  authenticateToken,
  async (req, res, next) => {
    try {
      const [totalPositions, positionsByLevel, totalCandidates] =
        await Promise.all([
          prisma.electoralPosition.count(),
          prisma.electoralPosition.groupBy({
            by: ['level'],
            _count: {
              level: true,
            },
          }),
          prisma.candidate.count(),
        ]);

      const positionsByLevelStats = positionsByLevel.reduce((acc, item) => {
        acc[item.level] = item._count.level;
        return acc;
      }, {} as Record<string, number>);

      const stats = {
        totalPositions,
        positionsByLevel: positionsByLevelStats,
        totalCandidates,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
