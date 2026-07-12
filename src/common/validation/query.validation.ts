import * as z from 'zod';

export const runQueryValidation = z.object({
  query: z.string().min(1, 'Query string is required'),
  language: z.enum(['esql', 'kql'], {
    message: 'Language must be "esql" or "kql"',
  }),
});
