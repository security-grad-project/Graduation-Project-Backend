import express from 'express';
import {
  createDevice,
  deleteDevice,
  getDeviceById,
  listDevices,
  streamDevices,
  updateDevice,
} from '../controllers/device.controller';
import {
  createDeviceRequestValidation,
  updateDeviceRequestValidation,
  listDevicesQueryValidation,
} from '../validation/device.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { authenticate, authorize } from '../../../common/middlewares';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

router.get('/stream', streamDevices);
router.get('/:id', getDeviceById);
router.get(
  '/',
  validationMiddleware({ query: listDevicesQueryValidation }) as express.RequestHandler,
  listDevices,
);

router.use(authorize(Role.SOC_ADMIN));

router.post('/', validationMiddleware({ body: createDeviceRequestValidation }), createDevice);
router.patch('/:id', validationMiddleware({ body: updateDeviceRequestValidation }), updateDevice);
router.delete('/:id', deleteDevice);

export default router;
