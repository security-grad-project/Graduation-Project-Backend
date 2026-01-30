import express from 'express';
import authRoutes from '../modules/Auth/routes/Auth.routes';
import systemRoutes from '../modules/System/routes/System.routes';
import deviceRoutes from '../modules/device/routes/device.routes';
import serviceRouter from '../modules/service/routes/service.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/system', systemRoutes);
router.use('/devices', deviceRoutes);
router.use('/services', serviceRouter);
export default router;
