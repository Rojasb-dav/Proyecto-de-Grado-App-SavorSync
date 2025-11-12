import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authorization token is invalid'
      });
    }

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isActive: true }
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'Your account has been disabled'
      });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email
    };

    next();

  } catch (error) {
    logger.error('Auth middleware error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authorization token is invalid or expired'
      });
    }

    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error'
    });
  }
};

// Admin middleware (for admin-only routes)
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: { isActive: true }
        }
      }
    });

    if (!adminUser || !adminUser.user.isActive) {
      return res.status(403).json({
        error: 'Admin access required',
        message: 'You must be an administrator to access this resource'
      });
    }

    next();

  } catch (error) {
    logger.error('Admin middleware error:', error);
    res.status(500).json({
      error: 'Authorization failed',
      message: 'Internal server error'
    });
  }
};

// Restaurant owner middleware
export const ownerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    // Check if user owns the restaurant (if restaurantId is provided)
    const { restaurantId } = req.params;

    if (restaurantId) {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { ownerId: true }
      });

      if (!restaurant) {
        return res.status(404).json({
          error: 'Restaurant not found',
          message: 'The specified restaurant does not exist'
        });
      }

      if (restaurant.ownerId !== req.user.userId) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to access this restaurant'
        });
      }
    }

    next();

  } catch (error) {
    logger.error('Owner middleware error:', error);
    res.status(500).json({
      error: 'Authorization failed',
      message: 'Internal server error'
    });
  }
};
