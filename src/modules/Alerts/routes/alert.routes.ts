import { Router } from 'express';
import { authenticate, authorize } from '../../../common/middlewares';
import { Role } from '@prisma/client';
import {
  getAlertById,
  getAlertStats,
  getAllAlerts,
  updateAlertStatus,
} from '../controllers/alert.controller';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  alertStatsQueryValidation,
  getAlertValidation,
  queryAlertsValidation,
  updateAlertStatusValidation,
} from '../validation/alert.validation';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SOC_ADMIN));

/**
 * @swagger
 * tags:
 *   name: Alerts
 *   description: Security alert queue management
 */

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get all alerts (paginated, filterable, sorted by severity then time)
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across name, description
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by host/device
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [severity, createdAt, updatedAt]
 *         description: Defaults to severity then createdAt when omitted
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated list of alerts
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
 *                     id:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     name:
 *                       type: string
 *                       example: AWS root account used
 *                     description:
 *                       type: string
 *                       example: The AWS root account was used to perform an action. This is a high-severity alert because it indicates that the root account credentials may have been compromised or misused.
 *                     severity:
 *                       type: string
 *                       example: HIGH
 *                     status:
 *                       type: string
 *                       example: OPEN
 *                     deviceId:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     device:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                         name:
 *                           type: string
 *                           example: My Device
 *                     confidence:
 *                       type: float
 *                       example: 0.85
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-01T12:34:56Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-01T12:34:56Z
 *                     ruleId:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     rule:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                         name:
 *                           type: string
 *                           example: rule
 *                         description:
 *                           type: string
 *                           example: A rule for detecting alerts
 *                         type:
 *                           type: string
 *                           example: CONDITION
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-05-01T12:34:56Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-05-01T12:34:56Z
 *                     scope:
 *                       type: string
 *                       example: AWS
 *                     source:
 *                       type: string
 *                       example: CloudTrail
 *                     mitre:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: T1078
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     total:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: false
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: true
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
router.get('/', validationMiddleware({ query: queryAlertsValidation }), getAllAlerts);

/**
 * @swagger
 * /alerts/stats:
 *   get:
 *     summary: Get alert counts by severity (for summary cards)
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alert stats retrieved successfully
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
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     bySeverity:
 *                       type: object
 *                       properties:
 *                         LOW:
 *                           type: integer
 *                         MEDIUM:
 *                           type: integer
 *                         HIGH:
 *                           type: integer
 *                         CRITICAL:
 *                           type: integer
 *                 message:
 *                   type: string
 *                   example: Alert stats retrieved successfully
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
router.get('/stats', validationMiddleware({ query: alertStatsQueryValidation }), getAlertStats);

/**
 * @swagger
 * /alerts/{id}:
 *   get:
 *     summary: Get a single alert by id
 *     tags: [Alerts]
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
 *         description: Alert retrieved successfully
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
 *                   object:
 *                     id:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     name:
 *                       type: string
 *                       example: AWS root account used
 *                     description:
 *                       type: string
 *                       example: The AWS root account was used to perform an action. This is a high-severity alert because it indicates that the root account credentials may have been compromised or misused.
 *                     severity:
 *                       type: string
 *                       example: HIGH
 *                     status:
 *                       type: string
 *                       example: OPEN
 *                     deviceId:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     device:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                         name:
 *                           type: string
 *                           example: My Device
 *                     confidence:
 *                       type: float
 *                       example: 0.85
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-01T12:34:56Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-01T12:34:56Z
 *                     ruleId:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     rule:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                         name:
 *                           type: string
 *                           example: rule
 *                         description:
 *                           type: string
 *                           example: A rule for detecting alerts
 *                         type:
 *                           type: string
 *                           example: CONDITION
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-05-01T12:34:56Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-05-01T12:34:56Z
 *                     scope:
 *                       type: string
 *                       example: AWS
 *                     source:
 *                       type: string
 *                       example: CloudTrail
 *                     mitre:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: T1078
 *                 message:
 *                   type: string
 *                   example: Alert retrieved successfully
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
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validationMiddleware({ params: getAlertValidation }), getAlertById);

/**
 * @swagger
 * /alerts/{id}:
 *   patch:
 *     summary: Update alert status (Acknowledge/Close/Escalate)
 *     tags: [Alerts]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER]
 *     responses:
 *       200:
 *         description: Alert status updated successfully
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
 *                   object:
 *                     id:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     name:
 *                       type: string
 *                       example: AWS root account used
 *                     description:
 *                       type: string
 *                       example: The AWS root account was used to perform an action. This is a high-severity alert because it indicates that the root account credentials may have been compromised or misused.
 *                     severity:
 *                       type: string
 *                       example: HIGH
 *                     status:
 *                       type: string
 *                       example: OPEN
 *                     deviceId:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     device:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                         name:
 *                           type: string
 *                           example: My Device
 *                     confidence:
 *                       type: float
 *                       example: 0.85
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-01T12:34:56Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-01T12:34:56Z
 *                     ruleId:
 *                       type: string
 *                       example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                     rule:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: f2152d1a-c967-4fcc-bcc3-308601d2cb27
 *                         name:
 *                           type: string
 *                           example: rule
 *                         description:
 *                           type: string
 *                           example: A rule for detecting alerts
 *                         type:
 *                           type: string
 *                           example: CONDITION
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-05-01T12:34:56Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-05-01T12:34:56Z
 *                     scope:
 *                       type: string
 *                       example: AWS
 *                     source:
 *                       type: string
 *                       example: CloudTrail
 *                     mitre:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: T1078
 *                 message:
 *                   type: string
 *                   example: Alert status updated successfully
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
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  '/:id',
  validationMiddleware({ params: getAlertValidation, body: updateAlertStatusValidation }),
  updateAlertStatus,
);

export default router;
