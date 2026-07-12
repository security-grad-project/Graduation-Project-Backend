import express from 'express';
import { authenticate } from '../../../common/middlewares';
import validationMiddleware from '../../../common/middlewares/validation.middleware';
import {
  runQueryValidation,
  createSavedQueryValidation,
  updateSavedQueryValidation,
  savedQueryIdValidation,
} from '../validation/hunting.validation';
import {
  executeQuery,
  getSavedQueries,
  createSavedQuery,
  updateSavedQuery,
  deleteSavedQuery,
} from '../controllers/hunting.controller';

const router = express.Router();

router.use(authenticate);

router.post('/query', validationMiddleware({ body: runQueryValidation }), executeQuery);

router
  .route('/queries')
  .get(getSavedQueries)
  .post(validationMiddleware({ body: createSavedQueryValidation }), createSavedQuery);

router
  .route('/queries/:id')
  .put(
    validationMiddleware({ params: savedQueryIdValidation, body: updateSavedQueryValidation }),
    updateSavedQuery,
  )
  .delete(validationMiddleware({ params: savedQueryIdValidation }), deleteSavedQuery);

export default router;
