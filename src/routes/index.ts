import express from 'express';
import authRoutes from '../modules/Auth/routes/Auth.routes';
import systemRoutes from '../modules/System/routes/System.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/system', systemRoutes);

export default router;
