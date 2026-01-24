import express from 'express';
import { createService, updateService } from '../controllers/service.controller';
import {
  createServiceValidation,
  updateServiceValidation,
} from '../validations/service.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  checkDeviceExists,
  checkUserExists,
  checkServiceExists,
} from './../../../common/middlewares/checkExistence.middleware';

import { authenticate, authorize } from '../../../common/middlewares';
const router = express.Router();

router.use(authenticate);

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

export default router;
