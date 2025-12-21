import * as z from 'zod';

export const createDeviceRequestValidation = z.object({
  ip: z.ipv4().or(z.ipv6()),
  hostName: z.string().min(3).max(25),
  port: z.number().int().min(1).max(65535),
  userId: z.uuid(),
});

export const updateDeviceRequestValidation = createDeviceRequestValidation.partial();

export const listDevicesQueryValidation = z.object({
  ip: z.union([z.ipv4(), z.ipv6()]).optional(),
  hostName: z.string().optional(),
  userId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
