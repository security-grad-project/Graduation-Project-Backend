import Router from 'express';
import { createDashboard, updateDashboard } from '../controllers/dashboard.controller';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  createDashboardValidation,
  updateDashboardValidation,
  getDashboardValidation,
} from '../validation/dashboard.validation';

const router = Router();

router.use(authenticate);

router.post('/', validationMiddleware({ body: createDashboardValidation }), createDashboard);
router.patch(
  '/:id',
  validationMiddleware({ params: getDashboardValidation, body: updateDashboardValidation }),
  updateDashboard,
);
export default router;
