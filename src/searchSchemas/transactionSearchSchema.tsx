import { z } from 'zod';

export const transactionSearchSchema = z.object({
  sortBy: z.string().optional().catch('id'),
  sort: z.string().optional().catch('desc'),
  blockHeight: z.number().optional().catch(undefined),
  createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
});
