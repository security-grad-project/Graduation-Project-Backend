import { Router } from 'express';
import { status } from '../controllers/system/status';

const router = Router();

router.get('/status', status);

export default router;
