import express from 'express';
import {
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getDashboardById,
  getAllDashboards,
  getDashboardData,
} from '../controllers/dashboard.controller';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  createDashboardValidation,
  updateDashboardValidation,
  getDashboardValidation,
  deleteDashboardValidation,
  queryDashboardsValidation,
  dashboardDataQueryValidation,
} from '../validation/dashboard.validation';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Dashboards
 *   description: Saved dashboards (panel definitions + live Elasticsearch data)
 *
 * components:
 *   schemas:
 *     DashboardPanel:
 *       type: object
 *       required: [id, type, title, spec]
 *       properties:
 *         id:
 *           type: string
 *           example: p1
 *         type:
 *           type: string
 *           enum: [metric, histogram, breakdown]
 *         title:
 *           type: string
 *           example: Total events
 *         spec:
 *           type: object
 *           description: >
 *             Query/aggregation spec, shape depends on "type".
 *             metric: { index, aggType: count|cardinality|ratio, field?, filter?, numeratorFilter? }
 *             histogram: { index, interval?, filter? }
 *             breakdown: { index, field, size?, filter? }
 *           example:
 *             index: logs-auditbeat.auditd-*
 *             aggType: cardinality
 *             field: host.name
 *     Dashboard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           example: Auditd Overview
 *         description:
 *           type: string
 *           nullable: true
 *           example: Kernel audit events
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [auditd]
 *         ownerId:
 *           type: string
 *           format: uuid
 *         panels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardPanel'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     DashboardListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         desc:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         hasNextPage:
 *           type: boolean
 *         hasPreviousPage:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/dashboards:
 *   get:
 *     summary: List dashboards (metadata rows for the dashboard list page)
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across title and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of dashboards
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
 *                     $ref: '#/components/schemas/DashboardListItem'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Unauthorized
 */
router.get('/', validationMiddleware({ query: queryDashboardsValidation }), getAllDashboards);

/**
 * @swagger
 * /dashboards/{id}/data:
 *   get:
 *     summary: Get live panel data for a dashboard (metric cards, histogram, breakdown)
 *     description: >
 *       Runs each panel's Elasticsearch aggregation at request time over the given
 *       time range. Kept separate from the dashboard definition so changing the
 *       time range does not refetch the layout/panels config.
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of time range (ISO 8601). Defaults to 24h before "to".
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of time range (ISO 8601). Defaults to now.
 *     responses:
 *       200:
 *         description: Dashboard panel data retrieved successfully
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
 *                     stats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: Total events
 *                           value:
 *                             oneOf:
 *                               - type: string
 *                               - type: number
 *                             example: 128340
 *                     histogram:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           time:
 *                             type: string
 *                             example: "14:00"
 *                           count:
 *                             type: integer
 *                             example: 342
 *                     breakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: success
 *                           value:
 *                             type: integer
 *                             example: 87
 *                 message:
 *                   type: string
 *                   example: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dashboard not found
 */

router.get(
  '/:id/data',
  validationMiddleware({ params: getDashboardValidation, query: dashboardDataQueryValidation }),
  getDashboardData,
);

/**
 * @swagger
 * /dashboards:
 *   post:
 *     summary: Create a dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Auditd Overview
 *               description:
 *                 type: string
 *                 example: Kernel audit events
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [auditd]
 *               panels:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/DashboardPanel'
 *     responses:
 *       201:
 *         description: Dashboard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Dashboard'
 *                 message:
 *                   type: string
 *                   example: Dashboard created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validationMiddleware({ body: createDashboardValidation }), createDashboard);

/**
 * @swagger
 * /dashboards/{id}:
 *   get:
 *     summary: Get a dashboard's full definition (metadata + panels config)
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Dashboard'
 *                 message:
 *                   type: string
 *                   example: Dashboard retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dashboard not found
 */
router.get('/:id', validationMiddleware({ params: getDashboardValidation }), getDashboardById);

/**
 * @swagger
 * /dashboards/{id}:
 *   patch:
 *     summary: Update a dashboard's metadata and/or panels
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               panels:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/DashboardPanel'
 *     responses:
 *       200:
 *         description: Dashboard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Dashboard'
 *                 message:
 *                   type: string
 *                   example: Dashboard updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dashboard not found
 */
router.patch(
  '/:id',
  validationMiddleware({ params: getDashboardValidation, body: updateDashboardValidation }),
  updateDashboard,
);

/**
 * @swagger
 * /dashboards/{id}:
 *   delete:
 *     summary: Delete a dashboard
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Dashboard deleted successfully (no content)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dashboard not found
 */
router.delete('/:id', validationMiddleware({ params: deleteDashboardValidation }), deleteDashboard);
export default router;
