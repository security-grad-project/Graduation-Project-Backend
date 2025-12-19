import express from 'express';
import { createDevice, getDeviceById } from '../controllers/device.controller';

const router = express.Router();

router.route('/').post(createDevice);
router.route('/:id').get(getDeviceById);

export default router;
