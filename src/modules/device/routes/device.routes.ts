import express from 'express';
import { createDevice, getDeviceById, updateDevice } from '../controllers/device.controller';

const router = express.Router();

router.route('/').post(createDevice);
router.route('/:id').get(getDeviceById).patch(updateDevice);

export default router;
