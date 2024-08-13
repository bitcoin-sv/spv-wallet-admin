import { z } from 'zod';

export const destinationSearchSchema = z.object({
  lockingScript: z.string().optional().catch(''),
  address: z.string().optional().catch(''),
  order_by_field: z.string().optional().catch('id'),
  sort_direction: z.string().optional().catch('desc'),
  createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
});
