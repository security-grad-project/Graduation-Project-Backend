import * as z from 'zod';

export const createServiceValidation = z.object({
  type: z.string().min(2).max(100).trim(),
  userId: z.uuid(),
  deviceId: z.uuid(),
});

export const updateServiceValidation = createServiceValidation.partial();
export const updateServiceStrictValidation = createServiceValidation;

export const serviceIdValidation = z.object({ id: z.uuid() });
export const getServiceByUserValidation = z.object({
  userId: z.uuid(),
});
export const getServiceByDeviceValidation = z.object({
  deviceId: z.uuid(),
});

export const queryServicesValidation = z.object({
  type: z.string().optional(),
  userId: z.uuid().optional(),
  deviceId: z.uuid().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdAt: z.string().optional(),
  includeUserData: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  includeDeviceData: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});
