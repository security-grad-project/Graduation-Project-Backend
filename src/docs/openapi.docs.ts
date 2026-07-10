/**
 * @swagger
 * components:
 *   schemas:
 *     ApiError:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Error message
 *     PageMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         hasNextPage:
 *           type: boolean
 *         hasPreviousPage:
 *           type: boolean
 *     Analyst:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [SOC_ANALYST, SOC_ADMIN]
 *         phoneNumber:
 *           type: string
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         ip:
 *           type: string
 *         hostName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     DeviceInput:
 *       type: object
 *       required: [ip, hostName]
 *       properties:
 *         ip:
 *           type: string
 *           example: 192.168.1.10
 *         hostName:
 *           type: string
 *           minLength: 3
 *           maxLength: 25
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         port:
 *           type: integer
 *         userId:
 *           type: string
 *           format: uuid
 *         deviceId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ServiceInput:
 *       type: object
 *       required: [type, port, userId, deviceId]
 *       properties:
 *         type:
 *           type: string
 *         port:
 *           type: integer
 *           minimum: 1
 *           maximum: 65535
 *         userId:
 *           type: string
 *           format: uuid
 *         deviceId:
 *           type: string
 *           format: uuid
 *     Rule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RuleInput:
 *       type: object
 *       required: [name, description, type]
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *     Alert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         severity:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER]
 *         confidence:
 *           type: number
 *         ruleId:
 *           type: string
 *           format: uuid
 *         deviceId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         scope:
 *           type: string
 *           nullable: true
 *         source:
 *           type: string
 *           nullable: true
 *         mitre:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AlertStatusInput:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER]
 *   responses:
 *     Unauthorized:
 *       description: Authentication required.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     Forbidden:
 *       description: SOC_ADMIN role required.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     NotFound:
 *       description: Resource not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Create first analyst account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName, phoneNumber]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phoneNumber: { type: string }
 *     responses:
 *       201: { description: Analyst created }
 *       400: { description: Validation error or signup unavailable }
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 *       429: { description: Too many attempts }
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Token refreshed }
 *       401: { description: Invalid refresh token }
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current session
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Logged out }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 * /api/v1/auth/logout-all:
 *   post:
 *     tags: [Auth]
 *     summary: Logout all sessions
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: All sessions terminated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 * /api/v1/auth/sessions:
 *   get:
 *     tags: [Auth]
 *     summary: List active sessions
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Active sessions }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @swagger
 * /api/v1/system/status:
 *   get:
 *     tags: [System]
 *     summary: Get first-run system status
 *     responses:
 *       200: { description: System status }
 */

/**
 * @swagger
 * /api/v1/devices:
 *   get:
 *     tags: [Devices]
 *     summary: List devices
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: ip, schema: { type: string } }
 *       - { in: query, name: hostName, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: sortBy, schema: { type: string } }
 *       - { in: query, name: sortOrder, schema: { type: string, enum: [asc, desc] } }
 *     responses:
 *       200: { description: Paginated devices }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Devices]
 *     summary: Create device
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DeviceInput' }
 *     responses:
 *       201: { description: Device created }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/v1/devices/stream:
 *   get:
 *     tags: [Devices]
 *     summary: Stream devices
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: ip, schema: { type: string } }
 *       - { in: query, name: hostName, schema: { type: string } }
 *       - { in: query, name: createdAt, schema: { type: string } }
 *     responses:
 *       200: { description: JSON stream of devices }
 * /api/v1/devices/{id}:
 *   get:
 *     tags: [Devices]
 *     summary: Get device by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: includeServices, schema: { type: boolean } }
 *       - { in: query, name: includeAlerts, schema: { type: boolean } }
 *     responses:
 *       200: { description: Device details }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Devices]
 *     summary: Update device
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DeviceInput' }
 *     responses:
 *       200: { description: Device updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Devices]
 *     summary: Delete device
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Device deleted }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     tags: [Services]
 *     summary: List services
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: type, schema: { type: string } }
 *       - { in: query, name: userId, schema: { type: string, format: uuid } }
 *       - { in: query, name: deviceId, schema: { type: string, format: uuid } }
 *       - { in: query, name: port, schema: { type: integer, minimum: 1, maximum: 65535 } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: sortBy, schema: { type: string } }
 *       - { in: query, name: sortOrder, schema: { type: string, enum: [asc, desc] } }
 *       - { in: query, name: startDate, schema: { type: string, format: date-time } }
 *       - { in: query, name: endDate, schema: { type: string, format: date-time } }
 *       - { in: query, name: includeUserData, schema: { type: boolean } }
 *       - { in: query, name: includeDeviceData, schema: { type: boolean } }
 *     responses:
 *       200: { description: Paginated services }
 *   post:
 *     tags: [Services]
 *     summary: Create service
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ServiceInput' }
 *     responses:
 *       201: { description: Service created }
 * /api/v1/services/stream:
 *   get:
 *     tags: [Services]
 *     summary: Stream services
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: JSON stream of services }
 * /api/v1/services/count:
 *   get:
 *     tags: [Services]
 *     summary: Count services
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Service count }
 * /api/v1/services/user/{userId}:
 *   get:
 *     tags: [Services]
 *     summary: List services by user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *     responses:
 *       200: { description: User services }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /api/v1/services/device/{deviceId}:
 *   get:
 *     tags: [Services]
 *     summary: List services by device
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: deviceId, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *     responses:
 *       200: { description: Device services }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /api/v1/services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get service by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: includeUserData, schema: { type: boolean } }
 *       - { in: query, name: includeDeviceData, schema: { type: boolean } }
 *     responses:
 *       200: { description: Service details }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Services]
 *     summary: Partially update service
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ServiceInput' }
 *     responses:
 *       200: { description: Service updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   put:
 *     tags: [Services]
 *     summary: Fully update service
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ServiceInput' }
 *     responses:
 *       200: { description: Service updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Services]
 *     summary: Delete service
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Service deleted }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /api/v1/rules:
 *   get:
 *     tags: [Rules]
 *     summary: List rules
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: type, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: sortBy, schema: { type: string } }
 *       - { in: query, name: sortOrder, schema: { type: string, enum: [asc, desc] } }
 *       - { in: query, name: includeAlerts, schema: { type: boolean } }
 *       - { in: query, name: includeCount, schema: { type: boolean } }
 *     responses:
 *       200: { description: Paginated rules }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Rules]
 *     summary: Create rule
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RuleInput' }
 *     responses:
 *       201: { description: Rule created }
 * /api/v1/rules/stats:
 *   get:
 *     tags: [Rules]
 *     summary: Get rule statistics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Rule statistics }
 * /api/v1/rules/bulk:
 *   post:
 *     tags: [Rules]
 *     summary: Bulk create rules
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rules]
 *             properties:
 *               rules:
 *                 type: array
 *                 items: { $ref: '#/components/schemas/RuleInput' }
 *     responses:
 *       201: { description: Rules created }
 *   delete:
 *     tags: [Rules]
 *     summary: Bulk delete rules
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids:
 *                 type: array
 *                 items: { type: string, format: uuid }
 *     responses:
 *       200: { description: Rules deleted }
 * /api/v1/rules/type/{type}:
 *   get:
 *     tags: [Rules]
 *     summary: List rules by type
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: type, required: true, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *     responses:
 *       200: { description: Rules by type }
 * /api/v1/rules/{id}:
 *   get:
 *     tags: [Rules]
 *     summary: Get rule by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Rule details }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Rules]
 *     summary: Partially update rule
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RuleInput' }
 *     responses:
 *       200: { description: Rule updated }
 *   put:
 *     tags: [Rules]
 *     summary: Fully update rule
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RuleInput' }
 *     responses:
 *       200: { description: Rule updated }
 *   delete:
 *     tags: [Rules]
 *     summary: Delete rule
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Rule deleted }
 * /api/v1/rules/{id}/alerts:
 *   get:
 *     tags: [Rules]
 *     summary: Get rule with alerts
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Rule with alerts }
 * /api/v1/rules/{id}/duplicate:
 *   post:
 *     tags: [Rules]
 *     summary: Duplicate rule
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201: { description: Rule duplicated }
 */
/**
 * @swagger
 * /api/v1/alerts:
 *   get:
 *     tags: [Alerts]
 *     summary: List alerts
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: severity, schema: { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL] } }
 *       - { in: query, name: status, schema: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER] } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: deviceId, schema: { type: string, format: uuid } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: sortBy, schema: { type: string, enum: [severity, createdAt, updatedAt, name] } }
 *       - { in: query, name: sortOrder, schema: { type: string, enum: [asc, desc] } }
 *     responses:
 *       200: { description: Paginated alerts }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /api/v1/alerts/stats:
 *   get:
 *     tags: [Alerts]
 *     summary: Get alert statistics
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: severity, schema: { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL] } }
 *       - { in: query, name: status, schema: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, FALSE_POSITIVE, IGNORED, OTHER] } }
 *       - { in: query, name: search, schema: { type: string } }
 *     responses:
 *       200: { description: Alert statistics }
 * /api/v1/alerts/{id}:
 *   get:
 *     tags: [Alerts]
 *     summary: Get alert by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Alert details }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Alerts]
 *     summary: Update alert status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AlertStatusInput' }
 *     responses:
 *       200: { description: Alert status updated }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardPanel:
 *       type: object
 *       required: [id, type, title, spec]
 *       properties:
 *         id: { type: string, example: p1 }
 *         type: { type: string, enum: [metric, histogram, breakdown] }
 *         title: { type: string, example: Total events }
 *         spec:
 *           type: object
 *           description: "metric: { index, aggType: count|cardinality|ratio, field?, filter?, numeratorFilter? } | histogram: { index, interval?, filter? } | breakdown: { index, field, size?, filter? }"
 *           example: { index: "logs-auditbeat.auditd-*", aggType: cardinality, field: host.name }
 *     Dashboard:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         title: { type: string, example: Auditd Overview }
 *         description: { type: string, nullable: true, example: Kernel audit events }
 *         tags: { type: array, items: { type: string }, example: [auditd] }
 *         ownerId: { type: string, format: uuid }
 *         panels: { type: array, items: { $ref: '#/components/schemas/DashboardPanel' } }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     DashboardListItem:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         title: { type: string }
 *         desc: { type: string }
 *         tags: { type: array, items: { type: string } }
 *     DashboardInput:
 *       type: object
 *       required: [title]
 *       properties:
 *         title: { type: string, example: Auditd Overview }
 *         description: { type: string, example: Kernel audit events }
 *         tags: { type: array, items: { type: string }, example: [auditd] }
 *         panels: { type: array, items: { $ref: '#/components/schemas/DashboardPanel' } }
 */

/**
 * @swagger
 * /api/v1/dashboards:
 *   get:
 *     tags: [Dashboards]
 *     summary: List dashboards
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *     responses:
 *       200: { description: Paginated dashboard list }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Dashboards]
 *     summary: Create dashboard
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DashboardInput' }
 *     responses:
 *       201: { description: Dashboard created }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 * /api/v1/dashboards/{id}:
 *   get:
 *     tags: [Dashboards]
 *     summary: Get dashboard definition
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Dashboard details }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Dashboards]
 *     summary: Update dashboard
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DashboardInput' }
 *     responses:
 *       200: { description: Dashboard updated }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Dashboards]
 *     summary: Delete dashboard
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Dashboard deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /api/v1/dashboards/{id}/data:
 *   get:
 *     tags: [Dashboards]
 *     summary: Get live panel data over a time range
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: from, schema: { type: string, format: date-time } }
 *       - { in: query, name: to, schema: { type: string, format: date-time } }
 *     responses:
 *       200: { description: Dashboard panel data }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

export {};
