import express from 'express';
import {
  createDevice,
  deleteDevice,
  getDeviceById,
  listDevices,
  streamDevices,
  updateDevice,
} from '../controllers/device.controller';
import {
  createDeviceRequestValidation,
  updateDeviceRequestValidation,
  listDevicesQueryValidation,
} from '../validation/device.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import protect from '../../../common/middlewares/protect.middleware';
import { restrictedTo } from '../../../common/middlewares/restrictedTo.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/v1/devices:
 *   get:
 *     summary: List all devices
 *     description: Retrieve a paginated list of devices with optional filtering and sorting. Requires authentication.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: Filter by IP address
 *       - in: query
 *         name: hostName
 *         schema:
 *           type: string
 *         description: Filter by hostname
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
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
 *         description: List of devices retrieved successfully
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
 *                       ip:
 *                         type: string
 *                       hostName:
 *                         type: string
 *                       port:
 *                         type: integer
 *                       userId:
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
 */
router.get(
  '/',
  validationMiddleware({ query: listDevicesQueryValidation }) as express.RequestHandler,
  listDevices,
);

/**
 * @swagger
 * /api/v1/devices/stream:
 *   get:
 *     summary: Stream all devices
 *     description: Stream devices as a JSON stream. Requires authentication. Useful for real-time data streaming.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: Filter by IP address
 *       - in: query
 *         name: hostName
 *         schema:
 *           type: string
 *         description: Filter by hostname
 *       - in: query
 *         name: port
 *         schema:
 *           type: string
 *         description: Filter by port
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *         description: Filter by creation date
 *     responses:
 *       200:
 *         description: Stream of device data
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stream', streamDevices);

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     description: Retrieve a single device by its ID. Requires authentication.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *       - in: query
 *         name: includeServices
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated services in response
 *       - in: query
 *         name: includeAlerts
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated alerts in response
 *     responses:
 *       200:
 *         description: Device retrieved successfully
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
 *                     ip:
 *                       type: string
 *                     hostName:
 *                       type: string
 *                     port:
 *                       type: integer
 *                     userId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getDeviceById);

router.use(restrictedTo(Role.SOC_ADMIN));

/**
 * @swagger
 * /api/v1/devices:
 *   post:
 *     summary: Create a new device
 *     description: Create a new device. Requires authentication and SOC_ADMIN role.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ip
 *               - hostName
 *               - port
 *               - userId
 *             properties:
 *               ip:
 *                 type: string
 *                 example: 192.168.1.100
 *               hostName:
 *                 type: string
 *                 example: server-01
 *               port:
 *                 type: integer
 *                 example: 8080
 *               userId:
 *                 type: string
 *                 example: user-uuid-here
 *     responses:
 *       201:
 *         description: Device created successfully
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
 *                   example: Device created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ip:
 *                       type: string
 *                     hostName:
 *                       type: string
 *                     port:
 *                       type: integer
 *                     userId:
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
router.post('/', validationMiddleware({ body: createDeviceRequestValidation }), createDevice);

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   patch:
 *     summary: Update a device
 *     description: Update an existing device. Requires authentication and SOC_ADMIN role.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip:
 *                 type: string
 *                 example: 192.168.1.100
 *               hostName:
 *                 type: string
 *                 example: server-01-updated
 *               port:
 *                 type: integer
 *                 example: 8080
 *               userId:
 *                 type: string
 *                 example: user-uuid-here
 *     responses:
 *       200:
 *         description: Device updated successfully
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
 *                   example: Device updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ip:
 *                       type: string
 *                     hostName:
 *                       type: string
 *                     port:
 *                       type: integer
 *                     userId:
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
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', validationMiddleware({ body: updateDeviceRequestValidation }), updateDevice);

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   delete:
 *     summary: Delete a device
 *     description: Delete a device by ID. Requires authentication and SOC_ADMIN role.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     responses:
 *       204:
 *         description: Device deleted successfully
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
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteDevice);

export default router;
