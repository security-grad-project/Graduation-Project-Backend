import express from 'express';
import { createService } from '../controllers/service.controller';
import { createServiceValidation } from '../validations/service.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  checkDeviceExists,
  checkUserExists,
} from './../../../common/middlewares/checkExistence.middleware';

import { authenticate, authorize } from '../../../common/middlewares';
import { Service } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  validationMiddleware({ body: createServiceValidation }),
  checkUserExists,
  checkDeviceExists,
  createService,
);

export default router;
