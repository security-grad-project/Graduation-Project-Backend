import { Router } from 'express';
import { status } from '../controllers/System.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/system/status:
 *   get:
 *     summary: Get system status
 *     description: Check if this is the first run of the system (no analysts exist)
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 isFirstRun:
 *                   type: boolean
 *                   description: true if no analysts exist in the system
 *                   example: true
 */
router.get('/status', status);

export default router;
