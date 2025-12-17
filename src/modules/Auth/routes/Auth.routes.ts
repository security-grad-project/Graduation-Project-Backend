import { Router } from 'express';
import { signup } from '../controllers/Auth.controller';
import { allowOnlyFirstRun } from '../middlewares/Auth.middlewares';

const router = Router();

router.post('/signup', allowOnlyFirstRun, signup);

export default router;
