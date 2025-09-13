import express from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireUserManagement } from '../middleware/authorization';
import { validateRequest, schemas } from '../middleware/validation';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Register new user (only admins can register users)
router.post(
  '/register',
  authenticateToken,
  requireUserManagement,
  validateRequest(schemas.user),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        email,
        username,
        password,
        firstName,
        lastName,
        phoneNumber,
        imei,
        role,
      } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }, ...(imei ? [{ imei }] : [])],
        },
      });

      if (existingUser) {
        return next(
          new AppError('User with this email, username, or IMEI already exists')
        );
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          phoneNumber,
          imei,
          role,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          imei: true,
          createdAt: true,
        },
      });

      logger.info(`New user registered: ${user.email} with role ${user.role}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login user
router.post(
  '/login',
  validateRequest(schemas.login),
  async (req, res, next) => {
    try {
      const { email, username, password, imei } = req.body;

      // Find user by email or username
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(username ? [{ username }] : []),
          ],
          isActive: true,
        },
      });

      if (!user) {
        return next(new AppError('Invalid credentials'));
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next(new AppError('Invalid credentials'));
      }

      // Check IMEI if provided (for mobile app)
      if (imei && user.imei !== imei) {
        return next(new AppError('IMEI mismatch - device not registered'));
      }

      // Generate JWT tokens
      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
      const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

      if (!jwtSecret) {
        return next(new AppError('JWT secret not configured'));
      }

      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        jwtSecret as string,
        { expiresIn: jwtExpiresIn } as jwt.SignOptions
      );

      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        jwtSecret as string,
        { expiresIn: refreshExpiresIn } as jwt.SignOptions
      );

      // Store refresh token in database
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            imei: user.imei,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh access token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token required'));
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(new AppError('JWT secret not configured'));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            imei: true,
            isActive: true,
          },
        },
      },
    });

    if (!storedToken || !storedToken.user.isActive) {
      return next(new AppError('Invalid or expired refresh token'));
    }

    // Generate new access token
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const accessToken = jwt.sign(
      {
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      },
      jwtSecret as string,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid refresh token'));
    } else {
      next(error);
    }
  }
});

// Logout user
router.post(
  '/logout',
  authenticateToken,
  async (req: AuthRequest, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Remove refresh token from database
        await prisma.refreshToken.deleteMany({
          where: {
            token: refreshToken,
            userId: req.user!.id,
          },
        });
      }

      logger.info(`User logged out: ${req.user!.email}`);

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        imei: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return next(new AppError('User not found'));
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put(
  '/change-password',
  authenticateToken,
  async (req: AuthRequest, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return next(
          new AppError('Current password and new password are required')
        );
      }

      if (newPassword.length < 8) {
        return next(
          new AppError('New password must be at least 8 characters long')
        );
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { password: true },
      });

      if (!user) {
        return next(new AppError('User not found'));
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return next(new AppError('Current password is incorrect'));
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { password: hashedNewPassword },
      });

      logger.info(`Password changed for user: ${req.user!.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
