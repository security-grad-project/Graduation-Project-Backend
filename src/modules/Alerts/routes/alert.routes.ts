import { Router } from 'express';
import { authenticate, authorize } from '../../../common/middlewares';
import { Role } from '@prisma/client';
import { getAlertById, getAllAlerts, updateAlertStatus } from '../controllers/alert.controller';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  getAlertValidation,
  queryAlertsValidation,
  updateAlertStatusValidation,
} from '../validation/alert.validation';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SOC_ADMIN));

router.get('/', validationMiddleware({ query: queryAlertsValidation }), getAllAlerts);
router.get('/:id', validationMiddleware({ params: getAlertValidation }), getAlertById);
router.patch(
  '/:id',
  validationMiddleware({ params: getAlertValidation, body: updateAlertStatusValidation }),
  updateAlertStatus,
);
export default router;
