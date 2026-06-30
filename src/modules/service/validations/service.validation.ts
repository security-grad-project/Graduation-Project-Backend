import * as z from 'zod';

const emptyToUndefined = z
  .string()
  .transform((val) => (val === '' ? undefined : val))
  .optional();

export const createServiceValidation = z.object({
  type: z.string().min(2).max(100).trim(),
  port: z.number().int().min(1).max(65535),
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
  type: emptyToUndefined,
  userId: z.uuid().optional(),
  deviceId: z.uuid().optional(),
  port: z
    .string()
    .regex(/^\d{1,5}(-\d{1,5})?$/, {
      message: 'Port must be a single port or a range like 80-90',
    })
    .optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  sortBy: emptyToUndefined,
  sortOrder: z.enum(['asc', 'desc']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdAt: emptyToUndefined,
  includeUserData: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  includeDeviceData: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});
