import express from 'express';
import {
  createDevice,
  deleteDevice,
  getDeviceById,
  listDevices,
  updateDevice,
} from '../controllers/device.controller';

const router = express.Router();

router.route('/').post(createDevice).get(listDevices);
router.route('/:id').get(getDeviceById).patch(updateDevice).delete(deleteDevice);

export default router;
