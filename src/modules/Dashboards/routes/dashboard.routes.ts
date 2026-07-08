import Router from 'express';
import {
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getDashboardById,
} from '../controllers/dashboard.controller';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  createDashboardValidation,
  updateDashboardValidation,
  getDashboardValidation,
  deleteDashboardValidation,
} from '../validation/dashboard.validation';

const router = Router();

router.use(authenticate);

router.post('/', validationMiddleware({ body: createDashboardValidation }), createDashboard);

router.get('/:id', validationMiddleware({ params: getDashboardValidation }), getDashboardById);

router.patch(
  '/:id',
  validationMiddleware({ params: getDashboardValidation, body: updateDashboardValidation }),
  updateDashboard,
);
router.delete('/:id', validationMiddleware({ params: deleteDashboardValidation }), deleteDashboard);
export default router;
