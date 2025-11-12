import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { updateUserValidation, paginationValidation } from '../middleware/validation';
import logger from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - Get all users with pagination (admin only)
router.get('/', authMiddleware, paginationValidation, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          avatarUrl: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          _count: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: 'Internal server error'
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        locationName: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        _count: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    res.json({ user });

  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: 'Internal server error'
    });
  }
});

// PUT /api/users/profile - Update current user profile
router.put('/profile', authMiddleware, updateUserValidation, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { fullName, phone, bio, locationName, preferences } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        bio,
        locationName,
        preferences
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        locationName: true,
        preferences: true,
        isActive: true,
        emailVerified: true,
        updatedAt: true
      }
    });

    logger.info(`User profile updated: ${updatedUser.email}`);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Internal server error'
    });
  }
});

// GET /api/users/:id/posts - Get user's posts
router.get('/:id/posts', paginationValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { 
          userId: id,
          isPublic: true 
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              category: true,
              address: true
            }
          },
          _count: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count({
        where: { 
          userId: id,
          isPublic: true 
        }
      })
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get user posts error:', error);
    res.status(500).json({
      error: 'Failed to get user posts',
      message: 'Internal server error'
    });
  }
});

// GET /api/users/:id/followers - Get user's followers
router.get('/:id/followers', paginationValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: id },
        skip,
        take: limit,
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.follow.count({
        where: { followingId: id }
      })
    ]);

    res.json({
      followers: followers.map(f => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get user followers error:', error);
    res.status(500).json({
      error: 'Failed to get user followers',
      message: 'Internal server error'
    });
  }
});

// GET /api/users/:id/following - Get users that current user follows
router.get('/:id/following', paginationValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: id },
        skip,
        take: limit,
        include: {
          following: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.follow.count({
        where: { followerId: id }
      })
    ]);

    res.json({
      following: following.map(f => f.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get user following error:', error);
    res.status(500).json({
      error: 'Failed to get user following',
      message: 'Internal server error'
    });
  }
});

export default router;
