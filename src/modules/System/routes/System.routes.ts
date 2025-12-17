import { Router } from 'express';
import { status } from '../controllers/System.controller';

const router = Router();

router.get('/status', status);

export default router;
