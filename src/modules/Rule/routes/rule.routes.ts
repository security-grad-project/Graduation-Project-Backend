import express from 'express';
import * as z from 'zod';
import { authenticate, authorize } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  createRuleValidation,
  deleteRuleValidation,
  getRulesByTypeParamsValidation,
  getRulesByTypeQueriesValidation,
  getRuleValidation,
  queryRulesValidation,
  updateRuleValidation,
} from '../validation/rule.validation';
import { Role } from '@prisma/client';
import {
  createRule,
  deleteRule,
  getRuleById,
  getAllRules,
  updateRule,
  getRulesByType,
  getRuleWithAllAlerts,
} from '../controllers/rule.controller';
import { isRuleExistMiddleware, isRuleNameUniqueMiddleware } from '../middlewares/rule.middleware';

const router = express.Router();

router.use(authenticate);
router.use(authorize(Role.SOC_ADMIN));

router.post(
  '/',
  validationMiddleware({ body: createRuleValidation }),
  isRuleNameUniqueMiddleware,
  createRule,
);

router.patch(
  '/:id',
  validationMiddleware({ params: z.object({ id: z.uuid() }), body: updateRuleValidation }),
  isRuleExistMiddleware,
  isRuleNameUniqueMiddleware,
  updateRule,
);

router.get('/:id', validationMiddleware({ params: getRuleValidation }), getRuleById);

router.delete(
  '/:id',
  validationMiddleware({ params: deleteRuleValidation }),
  isRuleExistMiddleware,
  deleteRule,
);

router.get('/', validationMiddleware({ query: queryRulesValidation }), getAllRules);

router.get(
  '/type/:type',
  validationMiddleware({
    params: getRulesByTypeParamsValidation,
    query: getRulesByTypeQueriesValidation,
  }),
  getRulesByType,
);

router.get(
  '/:id/alerts',
  validationMiddleware({ params: getRuleValidation }),
  getRuleWithAllAlerts,
);

export default router;
