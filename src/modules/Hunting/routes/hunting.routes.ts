import express from 'express';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import { runQueryValidation } from '../validation/hunting.validation';
import { executeQuery } from '../controllers/hunting.controller';

const router = express.Router();

router.use(authenticate);

router.post('/query', validationMiddleware({body: runQueryValidation}), executeQuery);

export default router;
