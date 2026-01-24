import express from 'express';
import authRoutes from '../modules/Auth/routes/Auth.routes';
import systemRoutes from '../modules/System/routes/System.routes';
import deviceRoutes from '../modules/device/routes/device.routes';
import ruleRoutes from '../modules/Rule/routes/rule.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/system', systemRoutes);
router.use('/devices', deviceRoutes);
router.use('/rule', ruleRoutes);
export default router;
