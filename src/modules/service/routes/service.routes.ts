import express from 'express';
import {
  createService,
  updateService,
  getServiceById,
  listServices,
  streamService,
  deleteService,
  countServices,
  getServiceByUser,
  getServiceByDevice,
} from '../controllers/service.controller';
import {
  createServiceValidation,
  queryServicesValidation,
  updateServiceValidation,
  updateServiceStrictValidation,
  getServiceByUserValidation,
  getServiceByDeviceValidation,
  serviceIdValidation,
} from '../validations/service.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  checkDeviceExists,
  checkUserExists,
} from './../../../common/middlewares/checkExistence.middleware';
import { checkServiceExists } from '../middlewares/service.middleware';
import { Role } from '@prisma/client';

import { authenticate, authorize } from '../../../common/middlewares';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: List all services
 *     description: Retrieve a paginated list of services with optional filtering and sorting. Requires authentication.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by service type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: Filter by device ID
      - in: query
        name: port
        schema:
          type: string
        description: Filter by port (single value or range like 80-90)
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
 *       - in: query
 *         name: includeUserData
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated user data
 *       - in: query
 *         name: includeDeviceData
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated device data
 *     responses:
 *       200:
 *         description: List of services retrieved successfully
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
 *                       type:
 *                         type: string
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       deviceId:
 *                         type: string
 *                         format: uuid
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
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  listServices,
);

/**
 * @swagger
 * /api/v1/services/stream:
 *   get:
 *     summary: Stream all services
 *     description: Stream services as a JSON stream. Requires authentication. Useful for real-time data streaming.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by service type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: Filter by device ID
      - in: query
        name: port
        schema:
          type: string
        description: Filter by port (single value or range like 80-90)
 *     responses:
 *       200:
 *         description: Stream of service data
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
router.get(
  '/stream',
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  streamService,
);

/**
 * @swagger
 * /api/v1/services/count:
 *   get:
 *     summary: Count services
 *     description: Get the total count of services matching optional filters. Requires authentication.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by service type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: Filter by device ID
      - in: query
        name: port
        schema:
          type: string
        description: Filter by port (single value or range like 80-90)
 *     responses:
 *       200:
 *         description: Service count retrieved successfully
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
 *                     count:
 *                       type: integer
 *                       example: 42
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/count',
  validationMiddleware({ query: queryServicesValidation }) as unknown as express.RequestHandler,
  countServices,
);

/**
 * @swagger
 * /api/v1/services/user/{userId}:
 *   get:
 *     summary: Get services by User ID
 *     description: Retrieve all services associated with a specific user. Requires authentication.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: User services retrieved successfully
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
 *                       type:
 *                         type: string
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       deviceId:
 *                         type: string
 *                         format: uuid
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/user/:userId',
  validationMiddleware({
    params: getServiceByUserValidation,
    query: queryServicesValidation.omit({ userId: true, deviceId: true }),
  }) as unknown as express.RequestHandler,
  checkUserExists,
  getServiceByUser,
);

/**
 * @swagger
 * /api/v1/services/device/{deviceId}:
 *   get:
 *     summary: Get services by Device ID
 *     description: Retrieve all services associated with a specific device. Requires authentication.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the device
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Device services retrieved successfully
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
 *                       type:
 *                         type: string
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       deviceId:
 *                         type: string
 *                         format: uuid
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
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/device/:deviceId',
  validationMiddleware({
    params: getServiceByDeviceValidation,
    query: queryServicesValidation.omit({ userId: true, deviceId: true }),
  }) as unknown as express.RequestHandler,
  checkDeviceExists,
  getServiceByDevice,
);

/**
 * @swagger
 * /api/v1/services:
 *   post:
 *     summary: Create a new service
 *     description: Create a new service entry. Requires authentication.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - userId
 *               - deviceId
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of service
 *                 example: maintenance
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated user
 *               deviceId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated device
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                   example: Service created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     deviceId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - validation error or invalid foreign key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Referenced User or Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  validationMiddleware({ body: createServiceValidation }),
  checkUserExists,
  checkDeviceExists,
  createService,
);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     description: Retrieve a single service by its ID. Requires authentication.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *       - in: query
 *         name: includeUserData
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated user details
 *       - in: query
 *         name: includeDeviceData
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated device details
 *     responses:
 *       200:
 *         description: Service retrieved successfully
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
 *                     type:
 *                       type: string
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     deviceId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validationMiddleware({ params: serviceIdValidation }), getServiceById);

// Middleware for SOC_ADMIN routes
router.use(authorize(Role.SOC_ADMIN));

/**
 * @swagger
 * /api/v1/services/{id}:
 *   patch:
 *     summary: Partially update a service
 *     description: Update specific fields of a service. Requires SOC_ADMIN role.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               userId:
 *                 type: string
 *                 format: uuid
 *               deviceId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   example: Service updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     deviceId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - SOC_ADMIN required
 *       404:
 *         description: Service not found
 */
router.patch(
  '/:id',
  validationMiddleware({ body: updateServiceValidation, params: serviceIdValidation }),
  checkServiceExists,
  checkUserExists,
  checkDeviceExists,
  updateService,
);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   put:
 *     summary: Fully update a service
 *     description: Replace all fields of a service. Requires SOC_ADMIN role.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - userId
 *               - deviceId
 *             properties:
 *               type:
 *                 type: string
 *               userId:
 *                 type: string
 *                 format: uuid
 *               deviceId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   example: Service updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     deviceId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - SOC_ADMIN required
 *       404:
 *         description: Service not found
 */
router.put(
  '/:id',
  validationMiddleware({ body: updateServiceStrictValidation, params: serviceIdValidation }),
  checkServiceExists,
  checkUserExists,
  checkDeviceExists,
  updateService,
);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     description: Permanently remove a service by ID. Requires SOC_ADMIN role.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       204:
 *         description: Service deleted successfully
 *       403:
 *         description: Forbidden - SOC_ADMIN required
 *       404:
 *         description: Service not found
 */
router.delete('/:id', validationMiddleware({ params: serviceIdValidation }), deleteService);

export default router;
