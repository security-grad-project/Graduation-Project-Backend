import express from 'express';
import { createService } from '../controllers/service.controller';
import { createServiceValidation } from '../validations/service.validation';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { authenticate, authorize } from '../../../common/middlewares';
import { Service } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

router.post('/', validationMiddleware({ body: createServiceValidation }), createService);

export default router;
