import express from 'express';
import { createLogSource, listLogSources, getLogSourceById, updateLogSource } from '../controllers/logSource.controller';
import {
  createLogSourceRequestValidation,
  updateLogSourceRequestValidation,
  listLogSourceRequestValidation,
  logSourceIdValidation,
} from '../validation/logSource.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { authenticate, authorize } from '../../../common/middlewares';
import { checkLogSourceExists } from '../middleware/logSource.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  validationMiddleware({ query: listLogSourceRequestValidation }) as express.RequestHandler,
  listLogSources,
);

router.get(
  '/:id',
  validationMiddleware({ params: logSourceIdValidation }) as express.RequestHandler,
  checkLogSourceExists,
  getLogSourceById,
);

router.post(
  '/',
  authorize(Role.SOC_ADMIN),
  validationMiddleware({ body: createLogSourceRequestValidation }) as express.RequestHandler,
  createLogSource,
);

router.patch(
  '/:id',
  authorize(Role.SOC_ADMIN),
  validationMiddleware({ params: logSourceIdValidation, body: updateLogSourceRequestValidation }) as express.RequestHandler,
  checkLogSourceExists,
  updateLogSource,
);

export default router;
