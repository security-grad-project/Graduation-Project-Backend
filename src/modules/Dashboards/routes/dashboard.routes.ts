import Router from 'express';
import { createDashboard } from '../controllers/dashboard.controller';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { createDashboardValidation } from '../validation/dashboard.validation';

const router = Router();

router.use(authenticate);

router.post('/', validationMiddleware({ body: createDashboardValidation }), createDashboard);

export default router;
