import express from 'express';
import * as deviceController from './device.controller';

const router = express.Router();

router.route('/').post(deviceController.createDevice);

// router.route('/').get().post();
// router.route('/:id').get().patch().delete();

export default router;
