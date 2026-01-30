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

/**
 * @swagger
 * /api/v1/rules:
 *   post:
 *     summary: Create a new rule
 *     description: Create a new rule entry. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Rule name
 *                 example: High CPU Usage
 *               description:
 *                 type: string
 *                 description: Rule description
 *                 example: Detects when CPU usage exceeds 90%
 *               type:
 *                 type: string
 *                 description: Rule type
 *                 enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *                 example: threshold
 *     responses:
 *       201:
 *         description: Rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Rule created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  validationMiddleware({ body: createRuleValidation }),
  isRuleNameUniqueMiddleware,
  createRule,
);

/**
 * @swagger
 * /api/v1/rules/{id}:
 *   patch:
 *     summary: Partially update a rule
 *     description: Update specific fields of a rule. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rule ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Rule updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *       404:
 *         description: Rule not found
 */
router.patch(
  '/:id',
  validationMiddleware({ params: getRuleValidation, body: updateRuleValidation }),
  isRuleExistMiddleware,
  isRuleNameUniqueMiddleware,
  updateRule,
);
/**
 * @swagger
 * /api/v1/rules/stats:
 *   get:
 *     summary: Get rule statistics
 *     description: Retrieve statistics about rules. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *         description: Filter stats by rule type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Rule statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: JSON object containing statistics
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', validationMiddleware({ query: queryRulesValidation }), getStats);

/**
 * @swagger
 * /api/v1/rules/bulk:
 *   post:
 *     summary: Bulk create rules
 *     description: Create multiple rules at once. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rules
 *             properties:
 *               rules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - description
 *                     - type
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *     responses:
 *       201:
 *         description: Rules created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Rules created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/bulk', validationMiddleware({ body: bulkCreateRulesValidation }), bulkCreateRules);
/**
 * @swagger
 * /api/v1/rules/bulk:
 *   delete:
 *     summary: Bulk delete rules
 *     description: Delete multiple rules by their IDs. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Rules deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Rules deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/bulk', validationMiddleware({ body: bulkDeleteRulesValidation }), bulkDeleteRules);

/**
 * @swagger
 * /api/v1/rules/{id}:
 *   get:
 *     summary: Get rule by ID
 *     description: Retrieve a single rule by its ID. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rule ID
 *     responses:
 *       200:
 *         description: Rule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *       404:
 *         description: Rule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validationMiddleware({ params: getRuleValidation }), getRuleById);

/**
 * @swagger
 * /api/v1/rules/{id}:
 *   delete:
 *     summary: Delete a rule
 *     description: Permanently remove a rule by ID. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rule ID
 *     responses:
 *       204:
 *         description: Rule deleted successfully
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *       404:
 *         description: Rule not found
 */
router.delete(
  '/:id',
  validationMiddleware({ params: deleteRuleValidation }),
  isRuleExistMiddleware,
  deleteRule,
);

/**
 * @swagger
 * /api/v1/rules:
 *   get:
 *     summary: List all rules
 *     description: Retrieve a paginated list of rules with optional filtering and sorting. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *         description: Filter by rule type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, type, createdAt, updatedAt]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *       - in: query
 *         name: includeAlerts
 *         schema:
 *           type: boolean
 *         description: Include associated alerts
 *       - in: query
 *         name: includeCount
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include total count in metadata
 *     responses:
 *       200:
 *         description: List of rules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       type:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', validationMiddleware({ query: queryRulesValidation }), getAllRules);

/**
 * @swagger
 * /api/v1/rules/type/{type}:
 *   get:
 *     summary: Get rules by type
 *     description: Retrieve rules filtered by type. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *         description: Rule type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Rules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/type/:type',
  validationMiddleware({
    params: getRulesByTypeParamsValidation,
    query: getRulesByTypeQueriesValidation,
  }),
  getRulesByType,
);

/**
 * @swagger
 * /api/v1/rules/{id}/alerts:
 *   get:
 *     summary: Get rule with alerts
 *     description: Retrieve a rule with its associated alerts. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rule ID
 *     responses:
 *       200:
 *         description: Rule with alerts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     alerts:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Rule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id/alerts',
  validationMiddleware({ params: getRuleValidation }),
  getRuleWithAllAlerts,
);

/**
 * @swagger
 * /api/v1/rules/{id}:
 *   put:
 *     summary: Fully update a rule
 *     description: Replace all fields of a rule. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [threshold, anomaly, pattern, condition, schedule, composite]
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Rule updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                       description: Rule name
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *       404:
 *         description: Rule not found
 */
router.put(
  '/:id',
  validationMiddleware({ params: getRuleValidation, body: createRuleValidation }),
  isRuleExistMiddleware,
  isRuleNameUniqueMiddleware,
  updateFullRule,
);

/**
 * @swagger
 * /api/v1/rules/{id}/duplicate:
 *   post:
 *     summary: Duplicate a rule
 *     description: Duplicate an existing rule. Requires authentication and SOC_ADMIN role.
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name for the duplicated rule
 *     responses:
 *       201:
 *         description: Rule duplicated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Rule duplicated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - SOC_ADMIN role required
 *       404:
 *         description: Rule not found
 */
router.post(
  '/:id/duplicate',
  validationMiddleware({ params: getRuleValidation, body: duplicateRuleValidation }),
  isRuleNameUniqueMiddleware,
  duplicateRule,
);

export default router;
