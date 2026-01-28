import express from 'express';
import {
  createService,
  updateService,
  getServiceById,
  listServices,
  streamService,
  deleteService,
  countServices,
  getServiceByUser,
  getServiceByDevice,
} from '../controllers/service.controller';
import {
  createServiceValidation,
  queryServicesValidation,
  updateServiceValidation,
  updateServiceStrictValidation,
  getServiceByUserValidation,
  getServiceByDeviceValidation,
  serviceIdValidation,
} from '../validations/service.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  checkDeviceExists,
  checkUserExists,
} from './../../../common/middlewares/checkExistence.middleware';
import { checkServiceExists } from '../middlewares/service.middleware';
import { Role } from '@prisma/client';

import { authenticate, authorize } from '../../../common/middlewares';

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  listServices,
);

router.get(
  '/stream',
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  streamService,
);

router.get(
  '/count',
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  countServices,
);

router.get(
  '/user/:userId',
  validationMiddleware({ params: getServiceByUserValidation }) as unknown as express.RequestHandler,
  checkUserExists,
  getServiceByUser,
);

router.get(
  '/device/:deviceId',
  validationMiddleware({
    params: getServiceByDeviceValidation,
  }) as unknown as express.RequestHandler,
  checkDeviceExists,
  getServiceByDevice,
);

router.post(
  '/',
  validationMiddleware({ body: createServiceValidation }),
  checkUserExists,
  checkDeviceExists,
  createService,
);

router.get('/:id', validationMiddleware({ params: serviceIdValidation }), getServiceById);

router.use(authorize(Role.SOC_ADMIN));

router.patch(
  '/:id',
  validationMiddleware({ body: updateServiceValidation, params: serviceIdValidation }),
  checkServiceExists,
  checkUserExists,
  checkDeviceExists,
  updateService,
);

router.put(
  '/:id',
  validationMiddleware({ body: updateServiceStrictValidation, params: serviceIdValidation }),
  checkServiceExists,
  checkUserExists,
  checkDeviceExists,
  updateService,
);

router.delete('/:id', validationMiddleware({ params: serviceIdValidation }), deleteService);

export default router;
