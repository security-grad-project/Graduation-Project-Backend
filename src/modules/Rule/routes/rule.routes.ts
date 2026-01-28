import express from 'express';
import { authenticate, authorize } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  bulkCreateRulesValidation,
  bulkDeleteRulesValidation,
  createRuleValidation,
  deleteRuleValidation,
  duplicateRuleValidation,
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
  updateFullRule,
  getStats,
  duplicateRule,
  bulkCreateRules,
  bulkDeleteRules,
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
  validationMiddleware({ params: getRuleValidation, body: updateRuleValidation }),
  isRuleExistMiddleware,
  isRuleNameUniqueMiddleware,
  updateRule,
);
router.get('/stats', validationMiddleware({ query: queryRulesValidation }), getStats);

router.post('/bulk', validationMiddleware({ body: bulkCreateRulesValidation }), bulkCreateRules);
router.delete('/bulk', validationMiddleware({ body: bulkDeleteRulesValidation }), bulkDeleteRules);

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

router.put(
  '/:id',
  validationMiddleware({ params: getRuleValidation, body: createRuleValidation }),
  isRuleExistMiddleware,
  isRuleNameUniqueMiddleware,
  updateFullRule,
);

router.post(
  '/:id/duplicate',
  validationMiddleware({ params: getRuleValidation, body: duplicateRuleValidation }),
  isRuleNameUniqueMiddleware,
  duplicateRule,
);

export default router;
