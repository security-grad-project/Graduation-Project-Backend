import * as z from 'zod';

const filterValidation = z.record(z.string(), z.string()).optional();

const metricPanelValidation = z.object({
  id: z.string().min(1),
  type: z.literal('metric'),
  title: z.string().min(1).max(150),
  spec: z.object({
    index: z.string().min(1),
    aggType: z.enum(['count', 'cardinality', 'ratio']),
    field: z.string().optional(),
    filter: filterValidation,
    numeratorFilter: filterValidation,
  }),
});

const histogramPanelValidation = z.object({
  id: z.string().min(1),
  type: z.literal('histogram'),
  title: z.string().min(1).max(150),
  spec: z.object({
    index: z.string().min(1),
    interval: z.string().optional(),
    filter: filterValidation,
  }),
});

const breakdownPanelValidation = z.object({
  id: z.string().min(1),
  type: z.literal('breakdown'),
  title: z.string().min(1).max(150),
  spec: z.object({
    index: z.string().min(1),
    field: z.string().min(1),
    size: z.number().int().min(1).max(50).optional(),
    filter: filterValidation,
  }),
});

const panelValidation = z.discriminatedUnion('type', [
  metricPanelValidation,
  histogramPanelValidation,
  breakdownPanelValidation,
]);

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

export const dashboardDataQueryValidation = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
