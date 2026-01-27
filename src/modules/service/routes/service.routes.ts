import express from 'express';
import {
  createService,
  updateService,
  getDeviceById,
  listServices,
} from '../controllers/service.controller';
import {
  createServiceValidation,
  queryServicesValidation,
  updateServiceValidation,
} from '../validations/service.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  checkDeviceExists,
  checkUserExists,
} from './../../../common/middlewares/checkExistence.middleware';
import { checkServiceExists } from '../middlewares/service.middleware';

import { authenticate, authorize } from '../../../common/middlewares';
const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  listServices,
);

router.post(
  '/',
  validationMiddleware({ body: createServiceValidation }),
  checkUserExists,
  checkDeviceExists,
  createService,
);

router.patch(
  '/:id',
  validationMiddleware({ body: updateServiceValidation }),
  checkServiceExists,
  checkUserExists,
  checkDeviceExists,
  updateService,
);

router.get('/:id', getDeviceById);
export default router;
