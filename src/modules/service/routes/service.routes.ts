import express from 'express';
import { createService, updateService, getDeviceById } from '../controllers/service.controller';
import {
  createServiceValidation,
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
