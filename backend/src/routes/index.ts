import { Router } from 'express';
import authRoutes from './auth.routes';
import onboardingRoutes from './onboarding.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);

export default router;
