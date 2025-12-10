import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import * as servicesController from '../controllers/services.controller';

const router = Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

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
    basePriceSats: z.number().int().positive(),
    priceType: z.string().max(50).optional(),
    deliveryTimeDays: z.number().int().positive().optional(),
    revisionLimit: z.number().int().nonnegative().default(2),
    images: z.array(z.string().url()).optional(),
    location: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
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
    basePriceSats: z.number().int().positive().optional(),
    priceType: z.string().max(50).optional(),
    deliveryTimeDays: z.number().int().positive().optional(),
    revisionLimit: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
    isActive: z.boolean().optional(),
    location: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
  }),
});

const deleteListingSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid listing ID'),
  }),
});

const milestoneSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  amountSats: z.number().int().positive(),
  dueDate: z.string().datetime().optional(),
});

const createContractSchema = z.object({
  body: z.object({
    listingId: z.string().uuid('Invalid listing ID'),
    milestones: z.array(milestoneSchema).min(1),
    autoCompleteDays: z.number().int().positive().max(90).default(14),
  }),
});

const getContractSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid contract ID'),
  }),
});

const getMyContractsSchema = z.object({
  query: z.object({
    type: z.enum(['all', 'buying', 'providing']).default('all'),
    status: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

const contractActionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid contract ID'),
  }),
});

const getMilestoneSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid milestone ID'),
  }),
});

const submitMilestoneSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid milestone ID'),
  }),
  body: z.object({
    deliverables: z.array(z.object({
      fileUrl: z.string().url(),
      fileName: z.string(),
      description: z.string().optional(),
    })).optional(),
  }),
});

const approveMilestoneSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid milestone ID'),
  }),
});

const requestRevisionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid milestone ID'),
  }),
  body: z.object({
    requestNotes: z.string().min(1),
  }),
});

// ============================================================================
// SERVICE LISTING ROUTES
// ============================================================================

router.get('/listings', optionalAuth, validate(getListingsSchema), servicesController.getListings);
router.get('/listings/:id', optionalAuth, validate(getListingSchema), servicesController.getListing);
router.post('/listings', authenticate, validate(createListingSchema), servicesController.createListing);
router.put('/listings/:id', authenticate, validate(updateListingSchema), servicesController.updateListing);
router.delete('/listings/:id', authenticate, validate(deleteListingSchema), servicesController.deleteListing);

// ============================================================================
// SERVICE CONTRACT ROUTES
// ============================================================================

router.post('/contracts', authenticate, validate(createContractSchema), servicesController.createContract);
router.get('/contracts/:id', authenticate, validate(getContractSchema), servicesController.getContract);
router.get('/contracts/my/list', authenticate, validate(getMyContractsSchema), servicesController.getMyContracts);
router.post('/contracts/:id/start', authenticate, validate(contractActionSchema), servicesController.startContract);
router.post('/contracts/:id/complete', authenticate, validate(contractActionSchema), servicesController.completeContract);

// ============================================================================
// MILESTONE ROUTES
// ============================================================================

router.get('/milestones/:id', authenticate, validate(getMilestoneSchema), servicesController.getMilestone);
router.post('/milestones/:id/submit', authenticate, validate(submitMilestoneSchema), servicesController.submitMilestone);
router.post('/milestones/:id/approve', authenticate, validate(approveMilestoneSchema), servicesController.approveMilestone);
router.post('/milestones/:id/revision', authenticate, validate(requestRevisionSchema), servicesController.requestRevision);

export default router;

