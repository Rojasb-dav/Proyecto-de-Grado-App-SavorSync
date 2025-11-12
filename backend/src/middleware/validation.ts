import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must only contain alphanumeric characters',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 30 characters',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name must not exceed 100 characters',
    'any.required': 'Full name is required'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  }),
  platform: Joi.string().valid('mobile', 'web_owners', 'web_admin').optional().default('mobile'),
  deviceInfo: Joi.object().optional()
});

const restaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Restaurant name must be at least 2 characters long',
    'string.max': 'Restaurant name must not exceed 100 characters',
    'any.required': 'Restaurant name is required'
  }),
  address: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Address must be at least 5 characters long',
    'string.max': 'Address must not exceed 500 characters',
    'any.required': 'Address is required'
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required'
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).required().messages({
    'string.pattern.base': 'Please provide a valid phone number',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address'
  }),
  website: Joi.string().uri().optional().messages({
    'string.uri': 'Please provide a valid website URL'
  }),
  category: Joi.string().valid('italian', 'mexican', 'chinese', 'japanese', 'american', 'indian', 'thai', 'mediterranean', 'fast_food', 'cafe', 'bar', 'other').required().messages({
    'any.only': 'Please select a valid restaurant category',
    'any.required': 'Restaurant category is required'
  }),
  priceRange: Joi.number().integer().min(1).max(4).required().messages({
    'number.integer': 'Price range must be an integer',
    'number.min': 'Price range must be between 1 and 4',
    'number.max': 'Price range must be between 1 and 4',
    'any.required': 'Price range is required'
  })
});

const postSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Post content cannot be empty',
    'string.max': 'Post content must not exceed 1000 characters',
    'any.required': 'Post content is required'
  }),
  restaurantId: Joi.string().uuid().optional().messages({
    'string.uuid': 'Please provide a valid restaurant ID'
  }),
  imageUrl: Joi.string().uri().optional().messages({
    'string.uri': 'Please provide a valid image URL'
  }),
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    'number.integer': 'Rating must be an integer',
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5'
  }),
  isPublic: Joi.boolean().optional().default(true)
});

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name must not exceed 100 characters'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional().allow('').messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  bio: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Bio must not exceed 500 characters'
  }),
  locationName: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Location name must not exceed 100 characters'
  }),
  preferences: Joi.object().optional()
});

// Validation middleware factory
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input and try again',
        errors
      });
    }

    // Replace request body with validated and cleaned data
    req.body = value;
    next();
  };
};

// Export validation middleware
export const registerValidation = validate(registerSchema);
export const loginValidation = validate(loginSchema);
export const restaurantValidation = validate(restaurantSchema);
export const postValidation = validate(postSchema);
export const updateUserValidation = validate(updateUserSchema);

// Query parameter validation
export const paginationValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  });

  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Query validation failed',
      message: 'Please check your query parameters',
      errors
    });
  }

  req.query = value;
  next();
};
