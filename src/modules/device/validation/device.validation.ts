import { hostname } from 'os';
import * as z from 'zod';
import { da } from 'zod/v4/locales';

export const createDeviceRequestValidation = z.object({
  ip: z.ipv4().or(z.ipv6()),
  hostName: z.string().min(3).max(25),
  port: z.number().int().min(1).max(65535),
  userId: z.uuid(),
});

export type CreateDeviceRequestInput = z.infer<typeof createDeviceRequestValidation>;

export const updateDeviceQueryValidation = z
  .object({
    ip: z.ipv4().or(z.ipv6()).optional(),
    hostName: z.string().min(5).max(25).optional(),
    port: z.number().int().min(1).max(65535).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Must provide at least one field to update device.',
  });

export type UpdateDeviceQueryInput = z.infer<typeof updateDeviceQueryValidation>;

export const listDevicesQueryValidation = z.object({
  ip: z.string().optional(),
  hostName: z.string().optional(),
  userId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type listDevicesQueryInput = z.infer<typeof listDevicesQueryValidation>;
