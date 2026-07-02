import { Router } from 'express';
import { authenticate, authorize } from '../../../common/middlewares';
import { Role } from '@prisma/client';
import { getAllAlerts, createAlert } from '../controllers/alert.controller';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { queryAlertsValidation } from '../validation/alert.validation';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SOC_ADMIN));

router.post('/', createAlert);
router.get('/', validationMiddleware({ query: queryAlertsValidation }), getAllAlerts);

export default router;
