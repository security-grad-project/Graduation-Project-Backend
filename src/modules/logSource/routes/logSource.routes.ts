import express from 'express';
import {
  createLogSource,
  listLogSources,
  getLogSourceById,
  updateLogSource,
} from '../controllers/logSource.controller';
import {
  createLogSourceRequestValidation,
  updateLogSourceRequestValidation,
  listLogSourceRequestValidation,
  logSourceIdValidation,
} from '../validation/logSource.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { authenticate, authorize } from '../../../common/middlewares';
import { checkLogSourceExists } from '../middleware/logSource.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/log-sources:
 *   get:
 *     summary: List all log sources
 *     description: Retrieve a paginated list of log sources with optional filtering by category and status. Requires authentication.
 *     tags: [LogSources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by log source category (e.g., cloud, endpoint)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (active, stale, error)
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
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of log sources retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validationMiddleware({ query: listLogSourceRequestValidation }) as express.RequestHandler,
  listLogSources,
);

/**
 * @swagger
 * /api/v1/log-sources/{id}:
 *   get:
 *     summary: Get a log source by ID
 *     description: Retrieve detailed information for a specific log source by ID. Requires authentication.
 *     tags: [LogSources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log Source ID
 *     responses:
 *       200:
 *         description: Log source details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Log source not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  validationMiddleware({ params: logSourceIdValidation }) as express.RequestHandler,
  checkLogSourceExists,
  getLogSourceById,
);

/**
 * @swagger
 * /api/v1/log-sources:
 *   post:
 *     summary: Create a new log source
 *     description: Create a new log source configuration. Requires SOC_ADMIN role.
 *     tags: [LogSources]
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
 *               - category
 *               - vendor
 *               - product
 *               - description
 *               - dataset
 *               - agent
 *               - pipeline
 *               - index
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               vendor:
 *                 type: string
 *               product:
 *                 type: string
 *               description:
 *                 type: string
 *               dataset:
 *                 type: string
 *               agent:
 *                 type: string
 *               pipeline:
 *                 type: string
 *               index:
 *                 type: string
 *               retentionDays:
 *                 type: integer
 *               shards:
 *                 type: integer
 *               enabled:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Log source created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SOC_ADMIN)
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authorize(Role.SOC_ADMIN),
  validationMiddleware({ body: createLogSourceRequestValidation }) as express.RequestHandler,
  createLogSource,
);

/**
 * @swagger
 * /api/v1/log-sources/{id}:
 *   patch:
 *     summary: Update a log source
 *     description: Update an existing log source configuration by ID. Requires SOC_ADMIN role.
 *     tags: [LogSources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log Source ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               vendor:
 *                 type: string
 *               product:
 *                 type: string
 *               description:
 *                 type: string
 *               dataset:
 *                 type: string
 *               agent:
 *                 type: string
 *               pipeline:
 *                 type: string
 *               index:
 *                 type: string
 *               retentionDays:
 *                 type: integer
 *               shards:
 *                 type: integer
 *               enabled:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Log source updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SOC_ADMIN)
 *       404:
 *         description: Log source not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  authorize(Role.SOC_ADMIN),
  validationMiddleware({
    params: logSourceIdValidation,
    body: updateLogSourceRequestValidation,
  }) as express.RequestHandler,
  checkLogSourceExists,
  updateLogSource,
);

export default router;
