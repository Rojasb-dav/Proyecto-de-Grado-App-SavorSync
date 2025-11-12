import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { openStreetMapService } from '../services/openStreetMapService';
import logger from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/sync/restaurants
 * Sincroniza restaurantes desde OpenStreetMap a la base de datos
 */
router.post('/restaurants', async (req, res) => {
  try {
    logger.info('Starting restaurant sync from OpenStreetMap');
    
    // Obtener restaurantes de OpenStreetMap
    const osmRestaurants = await openStreetMapService.getRestaurantsInBogota(50);
    
    if (osmRestaurants.length === 0) {
      return res.status(404).json({
        error: 'No restaurants found',
        message: 'No restaurants were found in OpenStreetMap for Bogotá'
      });
    }

    logger.info(`Found ${osmRestaurants.length} restaurants from OpenStreetMap`);

    // Obtener usuario admin para asignar como owner
    const adminUser = await prisma.user.findFirst({
      where: { username: 'admin' }
    });

    if (!adminUser) {
      return res.status(500).json({
        error: 'Admin user not found',
        message: 'Please create an admin user first'
      });
    }

    let syncedCount = 0;
    let updatedCount = 0;

    // Procesar cada restaurante
    for (const osmRestaurant of osmRestaurants) {
      try {
        // Verificar si el restaurante ya existe (por nombre y dirección)
        const existingRestaurant = await prisma.restaurant.findFirst({
          where: {
            name: osmRestaurant.name,
            address: osmRestaurant.address
          }
        });

        if (existingRestaurant) {
          // Actualizar restaurante existente
          await prisma.restaurant.update({
            where: { id: existingRestaurant.id },
            data: {
              phone: osmRestaurant.phone,
              website: osmRestaurant.website,
              category: osmRestaurant.category,
              latitude: osmRestaurant.latitude,
              longitude: osmRestaurant.longitude,
              updatedAt: new Date()
            }
          });
          updatedCount++;
          logger.info(`Updated restaurant: ${osmRestaurant.name}`);
        } else {
          // Crear nuevo restaurante
          await prisma.restaurant.create({
            data: {
              name: osmRestaurant.name,
              address: osmRestaurant.address,
              latitude: osmRestaurant.latitude,
              longitude: osmRestaurant.longitude,
              phone: osmRestaurant.phone || '',
              email: osmRestaurant.email || '',
              website: osmRestaurant.website || '',
              category: osmRestaurant.category,
              priceRange: osmRestaurant.priceRange,
              ratingAverage: osmRestaurant.ratingAverage,
              isActive: osmRestaurant.isActive,
              isVerified: osmRestaurant.isVerified,
              ownerId: adminUser.id
            }
          });
          syncedCount++;
          logger.info(`Created restaurant: ${osmRestaurant.name}`);
        }
      } catch (error) {
        logger.error(`Error processing restaurant ${osmRestaurant.name}:`, error);
        // Continuar con el siguiente restaurante
        continue;
      }
    }

    logger.info(`Sync completed: ${syncedCount} created, ${updatedCount} updated`);

    res.json({
      message: 'Restaurant sync completed successfully',
      data: {
        totalFound: osmRestaurants.length,
        created: syncedCount,
        updated: updatedCount,
        processed: syncedCount + updatedCount
      }
    });

  } catch (error) {
    logger.error('Restaurant sync error:', error);
    res.status(500).json({
      error: 'Sync failed',
      message: 'Failed to sync restaurants from OpenStreetMap'
    });
  } finally {
    await prisma.$disconnect();
  }
});

/**
 * GET /api/sync/restaurants/preview
 * Previsualiza restaurantes de OpenStreetMap sin guardarlos
 */
router.get('/restaurants/preview', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    logger.info(`Previewing ${limit} restaurants from OpenStreetMap`);
    
    const restaurants = await openStreetMapService.getRestaurantsInBogota(limit);
    
    res.json({
      message: 'Restaurant preview loaded successfully',
      data: {
        count: restaurants.length,
        restaurants: restaurants.slice(0, 10) // Solo mostrar primeros 10
      }
    });

  } catch (error) {
    logger.error('Restaurant preview error:', error);
    res.status(500).json({
      error: 'Preview failed',
      message: 'Failed to load restaurant preview from OpenStreetMap'
    });
  }
});

/**
 * DELETE /api/sync/restaurants
 * Elimina todos los restaurantes (para testing)
 */
router.delete('/restaurants', async (req, res) => {
  try {
    logger.warn('Deleting all restaurants from database');
    
    const result = await prisma.restaurant.deleteMany({});
    
    logger.info(`Deleted ${result.count} restaurants`);
    
    res.json({
      message: 'All restaurants deleted successfully',
      data: {
        deletedCount: result.count
      }
    });

  } catch (error) {
    logger.error('Delete restaurants error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'Failed to delete restaurants'
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
