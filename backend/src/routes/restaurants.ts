import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, ownerMiddleware } from '../middleware/auth';
import { restaurantValidation, paginationValidation } from '../middleware/validation';
import logger from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/restaurants - Get all restaurants with pagination
router.get('/', paginationValidation, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;
    const { category, priceRange, search } = req.query;

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (priceRange) {
      where.priceRange = parseInt(priceRange as string);
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              fullName: true
            }
          }
        },
        orderBy: [
          { isVerified: 'desc' },
          { ratingAverage: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.restaurant.count({ where })
    ]);

    res.json({
      restaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get restaurants error:', error);
    res.status(500).json({
      error: 'Failed to get restaurants',
      message: 'Internal server error'
    });
  }
});

// GET /api/restaurants/:id - Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        posts: {
          where: { isPublic: true },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        userFavorites: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          },
          take: 5
        },
        _count: {
          select: {
            posts: true,
            userFavorites: true
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        error: 'Restaurant not found',
        message: 'The specified restaurant does not exist'
      });
    }

    res.json({ restaurant });

  } catch (error) {
    logger.error('Get restaurant by ID error:', error);
    res.status(500).json({
      error: 'Failed to get restaurant',
      message: 'Internal server error'
    });
  }
});

// POST /api/restaurants - Create new restaurant
router.post('/', authMiddleware, restaurantValidation, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const restaurantData = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        ...restaurantData,
        ownerId: userId
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });

    logger.info(`New restaurant created: ${restaurant.name} by ${userId}`);

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });

  } catch (error) {
    logger.error('Create restaurant error:', error);
    res.status(500).json({
      error: 'Failed to create restaurant',
      message: 'Internal server error'
    });
  }
});

// PUT /api/restaurants/:id - Update restaurant
router.put('/:id', authMiddleware, ownerMiddleware, restaurantValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantData = req.body;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: restaurantData,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });

    logger.info(`Restaurant updated: ${restaurant.name}`);

    res.json({
      message: 'Restaurant updated successfully',
      restaurant
    });

  } catch (error) {
    logger.error('Update restaurant error:', error);
    res.status(500).json({
      error: 'Failed to update restaurant',
      message: 'Internal server error'
    });
  }
});

// DELETE /api/restaurants/:id - Delete restaurant
router.delete('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.restaurant.delete({
      where: { id }
    });

    logger.info(`Restaurant deleted: ${id}`);

    res.json({
      message: 'Restaurant deleted successfully'
    });

  } catch (error) {
    logger.error('Delete restaurant error:', error);
    res.status(500).json({
      error: 'Failed to delete restaurant',
      message: 'Internal server error'
    });
  }
});

// GET /api/restaurants/nearby - Get restaurants near a location
router.get('/nearby/location', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing coordinates',
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string);

    // Simple distance calculation (for production, use PostGIS)
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        _count: {
          select: {
            posts: true,
            userFavorites: true
          }
        }
      }
    });

    // Filter by distance (simplified calculation)
    const nearbyRestaurants = restaurants.filter(restaurant => {
      const distance = calculateDistance(
        latitude, longitude,
        parseFloat(restaurant.latitude.toString()),
        parseFloat(restaurant.longitude.toString())
      );
      return distance <= radiusKm;
    }).sort((a, b) => {
      // Sort by distance and rating
      const distA = calculateDistance(
        latitude, longitude,
        parseFloat(a.latitude.toString()),
        parseFloat(a.longitude.toString())
      );
      const distB = calculateDistance(
        latitude, longitude,
        parseFloat(b.latitude.toString()),
        parseFloat(b.longitude.toString())
      );
      
      if (Math.abs(distA - distB) < 1) {
        return b.ratingAverage.toNumber() - a.ratingAverage.toNumber();
      }
      return distA - distB;
    });

    res.json({
      restaurants: nearbyRestaurants,
      center: { latitude, longitude },
      radius: radiusKm
    });

  } catch (error) {
    logger.error('Get nearby restaurants error:', error);
    res.status(500).json({
      error: 'Failed to get nearby restaurants',
      message: 'Internal server error'
    });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;
