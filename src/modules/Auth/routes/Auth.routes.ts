import { Router } from 'express';
import {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
  getActiveSessions,
} from '../controllers/Auth.controller';
import { allowOnlyFirstRun } from '../middlewares/allowFirstRun';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { loginRequestValidation, signupRequestValidation } from '../validation/Auth.validation';
import { loginLimiter, refreshLimiter } from '../../../config/limiter';
import { authenticate } from '../../../common/middlewares';

const router = Router();

router.post(
  '/signup',
  allowOnlyFirstRun,
  validationMiddleware({ body: signupRequestValidation }),
  signup,
);
router.post('/login', loginLimiter, validationMiddleware({ body: loginRequestValidation }), login);

router.post('/refresh', refreshLimiter, refresh);

router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/sessions', authenticate, getActiveSessions);

export default router;
