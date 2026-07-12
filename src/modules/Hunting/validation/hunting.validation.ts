import * as z from 'zod';
import { runQueryValidation } from '../../../common/validation/query.validation';
export { runQueryValidation };

export const createSavedQueryValidation = z.object({
  category: z.string().min(1, 'Category is required').trim(),
  name: z.string().min(1, 'Name is required').trim(),
  esql: z.string().min(1, 'ES|QL query text is required').trim(),
  kql: z.string().trim().optional(),
});

export const updateSavedQueryValidation = z.object({
  category: z.string().min(1).trim().optional(),
  name: z.string().min(1).trim().optional(),
  esql: z.string().min(1).trim().optional(),
  kql: z.string().trim().optional(),
});

export const savedQueryIdValidation = z.object({
  id: z.uuid('Invalid ID format. Must be a valid UUID'),
});
