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
import protect from '../../../common/middlewares/protect.middleware';
import { restrictedTo } from '../../../common/middlewares/restrictedTo.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(protect);

router.get('/stream', streamDevices);
router.get('/:id', getDeviceById);
router.get(
  '/',
  validationMiddleware({ query: listDevicesQueryValidation }) as express.RequestHandler,
  listDevices,
);

router.use(restrictedTo(Role.SOC_ADMIN));

router.post('/', validationMiddleware({ body: createDeviceRequestValidation }), createDevice);
router.patch('/:id', validationMiddleware({ body: updateDeviceRequestValidation }), updateDevice);
router.delete('/:id', deleteDevice);

export default router;
