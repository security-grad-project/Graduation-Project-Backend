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

const router = express.Router();

router.post('/', validationMiddleware({ body: createDeviceRequestValidation }), createDevice);
router.get(
  '/',
  validationMiddleware({ query: listDevicesQueryValidation }) as express.RequestHandler,
  listDevices,
);
router.get('/stream', streamDevices);
router.get('/:id', getDeviceById);
router.patch('/:id', validationMiddleware({ body: updateDeviceRequestValidation }), updateDevice);
router.delete('/:id', deleteDevice);

export default router;
