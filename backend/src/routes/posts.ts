import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { postValidation, paginationValidation } from '../middleware/validation';
import logger from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/posts - Get all posts with pagination
router.get('/', paginationValidation, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;
    const { userId, restaurantId, rating } = req.query;

    const where: any = {
      isPublic: true
    };

    if (userId) {
      where.userId = userId;
    }

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    if (rating) {
      where.rating = parseInt(rating as string);
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.post.count({ where })
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
    logger.error('Get posts error:', error);
    res.status(500).json({
      error: 'Failed to get posts',
      message: 'Internal server error'
    });
  }
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            bio: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            category: true,
            address: true,
            phone: true,
            ratingAverage: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true
              }
            }
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: true
      }
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'The specified post does not exist'
      });
    }

    // Check if post is public or user is the author
    if (!post.isPublic) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This post is not public'
      });
    }

    res.json({ post });

  } catch (error) {
    logger.error('Get post by ID error:', error);
    res.status(500).json({
      error: 'Failed to get post',
      message: 'Internal server error'
    });
  }
});

// POST /api/posts - Create new post
router.post('/', authMiddleware, postValidation, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { content, restaurantId, imageUrl, rating, isPublic } = req.body;

    const post = await prisma.post.create({
      data: {
        userId,
        content,
        restaurantId,
        imageUrl,
        rating,
        isPublic
      },
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
            category: true
          }
        }
      }
    });

    logger.info(`New post created: ${post.id} by user ${userId}`);

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    logger.error('Create post error:', error);
    res.status(500).json({
      error: 'Failed to create post',
      message: 'Internal server error'
    });
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { content, imageUrl, rating, isPublic } = req.body;

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'The specified post does not exist'
      });
    }

    if (existingPost.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own posts'
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        content,
        imageUrl,
        rating,
        isPublic
      },
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
            category: true
          }
        }
      }
    });

    logger.info(`Post updated: ${post.id} by user ${userId}`);

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    logger.error('Update post error:', error);
    res.status(500).json({
      error: 'Failed to update post',
      message: 'Internal server error'
    });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'The specified post does not exist'
      });
    }

    if (existingPost.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own posts'
      });
    }

    await prisma.post.delete({
      where: { id }
    });

    logger.info(`Post deleted: ${id} by user ${userId}`);

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    logger.error('Delete post error:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      message: 'Internal server error'
    });
  }
});

// POST /api/posts/:id/like - Like or unlike a post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'The specified post does not exist'
      });
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id }
      });

      res.json({
        message: 'Post unliked successfully',
        liked: false
      });

    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId,
          postId: id
        }
      });

      res.json({
        message: 'Post liked successfully',
        liked: true
      });
    }

  } catch (error) {
    logger.error('Like post error:', error);
    res.status(500).json({
      error: 'Failed to like/unlike post',
      message: 'Internal server error'
    });
  }
});

// GET /api/posts/featured - Get featured posts
router.get('/featured/list', paginationValidation, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          isPublic: true,
          isFeatured: true
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
          isPublic: true,
          isFeatured: true
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
    logger.error('Get featured posts error:', error);
    res.status(500).json({
      error: 'Failed to get featured posts',
      message: 'Internal server error'
    });
  }
});

export default router;
