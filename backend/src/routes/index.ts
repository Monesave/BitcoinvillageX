import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Import and mount route modules
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import paymentsRoutes from './payments.routes';
import marketplaceRoutes from './marketplace.routes';
import servicesRoutes from './services.routes';
import bountiesRoutes from './bounties.routes';
import crowdfundingRoutes from './crowdfunding.routes';
import adminRoutes from './admin.routes';
import councilRoutes from './council.routes';
import verificationRoutes from './verification.routes';

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentsRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/services', servicesRoutes);
router.use('/bounties', bountiesRoutes);
router.use('/crowdfunding', crowdfundingRoutes);
router.use('/admin', adminRoutes);
router.use('/council', councilRoutes);
router.use('/verification', verificationRoutes);

export default router;

