import * as z from 'zod';
import { da } from 'zod/v4/locales';

export const createDeviceValidation = z.object({
  ip: z.ipv4().or(z.ipv6()),
  hostName: z.string().min(3).max(25),
  port: z.number().int().min(1).max(65535),
  userId: z.uuid(),
});

export type CreateDeviceInput = z.infer<typeof createDeviceValidation>;

export const updateDeviceValidation = z
  .object({
    ip: z.ipv4().or(z.ipv6()).optional(),
    hostName: z.string().min(5).max(25).optional(),
    port: z.number().int().min(1).max(65535).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Must provide at least one field to update device.',
  });

export type UpdateDeviceInput = z.infer<typeof updateDeviceValidation>;
