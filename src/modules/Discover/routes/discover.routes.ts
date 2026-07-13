import express from 'express';
import discoverController from '../controllers/discover.controller';
import { authenticate } from '../../../common/middlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discover
 *   description: Discover endpoints for log analysis
 */

/**
 * @swagger
 * /api/v1/discover/fields:
 *   get:
 *     summary: Get available log fields
 *     description: Retrieve all available fields from active log source indices configured in the system.
 *     tags: [Discover]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 popular:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: event.outcome
 *                       type:
 *                         type: string
 *                         example: keyword
 *                       count:
 *                         type: integer
 *                         example: 176
 *                 available:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: source.ip
 *                       type:
 *                         type: string
 *                         example: ip
 *                       count:
 *                         type: integer
 *                         example: 154
 *                 empty:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: destination.ip
 *                       type:
 *                         type: string
 *                         example: ip
 *                 meta:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: _id
 *                       type:
 *                         type: string
 *                         example: _id
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/fields', authenticate, discoverController.getFields);

/**
 * @swagger
 * /api/v1/discover/field-stats:
 *   get:
 *     summary: Get statistics for a specific field
 *     description: Retrieve statistics for a single field. Returns top values for keyword-like fields and summary statistics for numeric or date fields.
 *     tags: [Discover]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: field
 *         required: true
 *         description: Field name (e.g. event.outcome, process.pid, @timestamp)
 *         schema:
 *           type: string
 *           example: event.outcome
 *     responses:
 *       200:
 *         description: Successfully retrieved field statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 field:
 *                   type: string
 *                   example: event.outcome
 *                 type:
 *                   type: string
 *                   example: keyword
 *                 documents:
 *                   type: integer
 *                   example: 176
 *                 values:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                         example: success
 *                       count:
 *                         type: integer
 *                         example: 59
 *                       percentage:
 *                         type: number
 *                         format: float
 *                         example: 33.52
 *                 stats:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 176
 *                     min:
 *                       type: number
 *                       example: 12
 *                     max:
 *                       type: number
 *                       example: 9823
 *                     avg:
 *                       type: number
 *                       format: float
 *                       example: 510.4
 *                     sum:
 *                       type: number
 *                       example: 89760
 *       400:
 *         description: Missing or invalid field parameter
 *       404:
 *         description: Field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/field-stats', authenticate, discoverController.getFieldStats);

export default router;
