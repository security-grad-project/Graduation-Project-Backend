import * as z from 'zod';

const severityValues = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const statusValues = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'FALSE_POSITIVE',
  'IGNORED',
  'OTHER',
] as const;

export const queryAlertsValidation = z.object({
  severity: z.enum(severityValues).optional(),
  status: z.enum(statusValues).optional(),
  search: z.string().min(1).optional(),
  deviceId: z.uuid().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  sortBy: z.enum(['severity', 'createdAt', 'updatedAt', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
