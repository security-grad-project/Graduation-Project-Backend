import * as z from 'zod';


const categorySchema = z.enum([
  "endpoint",
  "windows",
  "network",
  "cloud",
  "application"
]);

const indexSchema = z
  .string()
  .trim()                 
  .toLowerCase()          
  .regex(
    /^[a-z0-9_\.\-]+$/,        
    "Index must be lowercase, contain no spaces, and only contain alphanumeric characters, underscores, dots, or hyphens."
  );

const statusSchema = z.enum([
  "active",
  "stale",
  "error"
]);

export const createLogSourceRequestValidation = z.object({
    name: z.string().min(3).max(100),
    category: categorySchema,
    vendor: z.string().min(3),
    product: z.string().min(3),
    description: z.string().min(1),
    dataset: z.string().min(1),
    agent: z.string().min(3),
    pipeline: z.string().min(3),
    index: indexSchema,
    retentionDays: z.number().int().positive().optional(),
    shards: z.number().int().positive().optional(),
    enabled: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export const updateLogSourceRequestValidation = createLogSourceRequestValidation.partial();

export const listLogSourceRequestValidation = z.object({
  category: categorySchema.optional(),
  status: statusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const logSourceIdValidation = z.object({
  id: z.uuid("Invalid ID format. Must be a valid UUID"),
})
