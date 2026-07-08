import * as z from 'zod';

const panelValidation = z.object({
  id: z.string().min(1),
  type: z.enum(['metric', 'histogram', 'breakdown']),
  title: z.string().min(1).max(150),
  spec: z.record(z.string(), z.any()),
});

export const createDashboardValidation = z.object({
  title: z.string().min(3).max(150).trim(),
  description: z.string().max(500).trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  panels: z.array(panelValidation).optional(),
});

export const updateDashboardValidation = createDashboardValidation.partial();

export const getDashboardValidation = z.object({
  id: z.uuid(),
});

export const deleteDashboardValidation = z.object({
  id: z.uuid(),
});

export const queryDashboardsValidation = z.object({
  search: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});
