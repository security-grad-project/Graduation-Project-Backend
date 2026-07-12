import express from 'express';
import authRoutes from '../modules/Auth/routes/Auth.routes';
import systemRoutes from '../modules/System/routes/System.routes';
import deviceRoutes from '../modules/device/routes/device.routes';
import ruleRoutes from '../modules/Rule/routes/rule.routes';
import serviceRouter from '../modules/service/routes/service.routes';
import logSourceRouter from '../modules/logSource/routes/logSource.routes';
import alertRoutes from '../modules/Alerts/routes/alert.routes';
import dashboardRoutes from '../modules/Dashboards/routes/dashboard.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/system', systemRoutes);
router.use('/devices', deviceRoutes);
router.use('/rules', ruleRoutes);
router.use('/services', serviceRouter);
router.use('/log-sources', logSourceRouter);
router.use('/alerts', alertRoutes);
router.use('/dashboards', dashboardRoutes);
export default router;
