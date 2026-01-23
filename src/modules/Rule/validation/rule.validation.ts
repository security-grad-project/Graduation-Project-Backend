import * as z from 'zod';

export const createRuleValidation = z.object({
  name: z.string().min(3).max(100).trim(),
  description: z.string().min(10).max(500).trim(),
  type: z
    .enum(['threshold', 'anomaly', 'pattern', 'condition'])
    .transform((val) => val.toUpperCase()),
});

export const updateRuleValidation = createRuleValidation.partial();

export const getRuleValidation = z.object({
  id: z.uuid(),
});

export const deleteRuleValidation = z.object({
  id: z.uuid(),
});

export const queryRulesValidation = z.object({
  name: z.string().min(3).max(100).trim().optional(),
  type: z
    .enum(['threshold', 'anomaly', 'pattern', 'condition'])
    .transform((val) => val.toUpperCase())
    .optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'type', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
