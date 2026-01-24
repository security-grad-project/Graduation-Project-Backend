import express from 'express';
import { authenticate, authorize } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { createRuleValidation } from '../validation/rule.validation';
import { Role } from '@prisma/client';
import { createRule } from '../controllers/rule.controller';
import { isRuleNameUniqueMiddleware } from '../middlewares/rule.middleware';

const router = express.Router();

router.use(authenticate);
router.use(authorize(Role.SOC_ADMIN));

router.post(
  '/',
  validationMiddleware({ body: createRuleValidation }),
  isRuleNameUniqueMiddleware,
  createRule,
);

export default router;
