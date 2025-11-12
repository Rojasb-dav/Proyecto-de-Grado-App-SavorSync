import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { loginValidation, registerValidation } from '../middleware/validation';
import logger from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

// POST /api/auth/register - Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    const { email, username, password, fullName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
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
        fullName,
        phone,
        isActive: true,
        emailVerified: false
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phone: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password, platform = 'mobile' } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'Your account has been disabled'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Create auth session
    const sessionToken = jwt.sign(
      { userId: user.id, platform },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.authSession.create({
      data: {
        userId: user.id,
        sessionToken,
        platform,
        deviceInfo: req.body.deviceInfo || {},
        ipAddress: req.ip,
        expiresAt,
        isActive: true
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });

    // Return user data without sensitive information
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      emailVerified: user.emailVerified
    };

    logger.info(`User logged in: ${user.email} from ${platform}`);

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      sessionToken,
      platform
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { sessionToken } = req.body;
    const userId = (req as any).user.userId;

    // Deactivate auth session
    if (sessionToken) {
      await prisma.authSession.updateMany({
        where: {
          userId,
          sessionToken,
          isActive: true
        },
        data: {
          isActive: false
        }
      });
    }

    logger.info(`User logged out: ${userId}`);

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Internal server error'
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        phoneVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    res.json({
      user
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user info',
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid user',
        message: 'User account not found or disabled'
      });
    }

    // Generate new token
    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Internal server error'
    });
  }
});

export default router;
