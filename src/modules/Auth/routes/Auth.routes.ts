import { Router } from 'express';
import { signup, login } from '../controllers/Auth.controller';
import { allowOnlyFirstRun } from '../middlewares/allowFirstRun';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { loginRequestValidation, signupRequestValidation } from '../validation/Auth.validation';
import { loginLimiter } from '../../../config/limiter';

const router = Router();

router.post(
  '/signup',
  allowOnlyFirstRun,
  validationMiddleware({ body: signupRequestValidation }),
  signup,
);
router.post('/login', loginLimiter, validationMiddleware({ body: loginRequestValidation }), login);

export default router;
