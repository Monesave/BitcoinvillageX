import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { publicLimiter } from '../middleware/rateLimit.middleware';
import * as marketplaceController from '../controllers/marketplace.controller';

const router = Router();

// Apply public rate limiting to listing routes (public-facing)
router.use('/listings', publicLimiter);

// Validation schemas
const getListingsSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    search: z.string().optional(),
    isActive: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

const getListingSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid listing ID'),
  }),
});

const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    category: z.string().max(100).optional(),
    priceSats: z.number().int().positive(),
    currency: z.string().default('BTC'),
    priceUsd: z.number().positive().optional(),
    images: z.array(z.string().url()).optional(),
    condition: z.string().max(50).optional(),
    shippingMethod: z.string().max(50).optional(),
    shippingCostSats: z.number().int().nonnegative().optional(),
    location: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    radiusKm: z.number().int().nonnegative().optional(),
  }),
});

const updateListingSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid listing ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    category: z.string().max(100).optional(),
    priceSats: z.number().int().positive().optional(),
    priceUsd: z.number().positive().optional(),
    images: z.array(z.string().url()).optional(),
    condition: z.string().max(50).optional(),
    shippingMethod: z.string().max(50).optional(),
    shippingCostSats: z.number().int().nonnegative().optional(),
    location: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    radiusKm: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});

const deleteListingSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid listing ID'),
  }),
});

const createOrderSchema = z.object({
  body: z.object({
    listingId: z.string().uuid('Invalid listing ID'),
    quantity: z.number().int().positive().default(1),
    shippingAddress: z.record(z.any()), // JSONB object (flexible structure)
    shippingMethod: z.string().max(50).optional(),
    autoReleaseDays: z.number().int().positive().max(30).default(7),
  }),
});

const getOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

const getMyOrdersSchema = z.object({
  query: z.object({
    type: z.enum(['all', 'buying', 'selling']).default('all'),
    status: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

const confirmPaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

const confirmDeliverySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

// Listing routes
router.get('/listings', optionalAuth, validate(getListingsSchema), marketplaceController.getListings);
router.get('/listings/:id', optionalAuth, validate(getListingSchema), marketplaceController.getListing);
router.post('/listings', authenticate, validate(createListingSchema), marketplaceController.createListing);
router.put('/listings/:id', authenticate, validate(updateListingSchema), marketplaceController.updateListing);
router.delete('/listings/:id', authenticate, validate(deleteListingSchema), marketplaceController.deleteListing);

// Order routes
router.post('/orders', authenticate, validate(createOrderSchema), marketplaceController.createOrder);
router.get('/orders/my', authenticate, validate(getMyOrdersSchema), marketplaceController.getMyOrders);
router.get('/orders/:id', authenticate, validate(getOrderSchema), marketplaceController.getOrder);
router.post('/orders/:id/confirm-payment', authenticate, validate(confirmPaymentSchema), marketplaceController.confirmPayment);
router.post('/orders/:id/confirm-delivery', authenticate, validate(confirmDeliverySchema), marketplaceController.confirmDelivery);

export default router;

