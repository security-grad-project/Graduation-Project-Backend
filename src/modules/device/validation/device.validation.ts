import * as z from 'zod';

export const createDeviceValidation = z.object({
  ip: z.ipv4().or(z.ipv6()),
  hostName: z.string().min(5).max(25),
  port: z.number().int().min(1).max(65535),
  userId: z.uuid(),
});

export type CreateDeviceInput = z.infer<typeof createDeviceValidation>;
