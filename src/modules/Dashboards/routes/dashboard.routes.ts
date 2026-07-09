import Router from 'express';
import {
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getDashboardById,
  getAllDashboards,
  getDashboardData,
} from '../controllers/dashboard.controller';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  createDashboardValidation,
  updateDashboardValidation,
  getDashboardValidation,
  deleteDashboardValidation,
  queryDashboardsValidation,
  dashboardDataQueryValidation,
} from '../validation/dashboard.validation';

const router = Router();

router.use(authenticate);

router.get('/', validationMiddleware({ query: queryDashboardsValidation }), getAllDashboards);
router.get(
  '/:id/data',
  validationMiddleware({ params: getDashboardValidation, query: dashboardDataQueryValidation }),
  getDashboardData,
);
router.post('/', validationMiddleware({ body: createDashboardValidation }), createDashboard);

router.get('/:id', validationMiddleware({ params: getDashboardValidation }), getDashboardById);

router.patch(
  '/:id',
  validationMiddleware({ params: getDashboardValidation, body: updateDashboardValidation }),
  updateDashboard,
);
router.delete('/:id', validationMiddleware({ params: deleteDashboardValidation }), deleteDashboard);
export default router;
