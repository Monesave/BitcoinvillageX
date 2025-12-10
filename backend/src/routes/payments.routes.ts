import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { paymentLimiter } from '../middleware/rateLimit.middleware';
import * as paymentsController from '../controllers/payments.controller';

const router = Router();

// Apply strict rate limiting to all payment routes
router.use(paymentLimiter);

// Validation schemas
const createInvoiceSchema = z.object({
  body: z.object({
    amountSats: z.number().int().positive('Amount must be positive'),
    memo: z.string().optional(),
    correlationId: z.string().optional(),
  }),
});

const checkInvoiceSchema = z.object({
  params: z.object({
    paymentHash: z.string(),
  }),
});

const payInvoiceSchema = z.object({
  body: z.object({
    paymentRequest: z.string().min(1, 'Payment request is required'),
  }),
});

const decodeInvoiceSchema = z.object({
  body: z.object({
    paymentRequest: z.string().min(1, 'Payment request is required'),
  }),
});

// Routes
router.post(
  '/lightning/invoice',
  authenticate,
  validate(createInvoiceSchema),
  paymentsController.createInvoice
);

router.get(
  '/lightning/invoice/:paymentHash',
  authenticate,
  validate(checkInvoiceSchema),
  paymentsController.checkInvoiceStatus
);

router.post(
  '/lightning/pay',
  authenticate,
  validate(payInvoiceSchema),
  paymentsController.payInvoice
);

router.post(
  '/lightning/decode',
  authenticate,
  validate(decodeInvoiceSchema),
  paymentsController.decodeInvoice
);

router.post('/withdraw', authenticate, paymentsController.withdraw);

export default router;

