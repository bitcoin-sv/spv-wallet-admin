import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, DEFAULT_API_PAGE } from '@/constants/pagination';

export const transactionSearchSchema = z.object({
  sortBy: z.string().optional().catch('id'),
  sort: z.string().optional().catch('desc'),
  blockHeight: z.number().optional().catch(undefined),
  createdRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  updatedRange: z.object({ from: z.string(), to: z.string() }).optional().catch(undefined),
  status: z.string().nullable().optional().catch(undefined),
  page: z.coerce.number().optional().default(DEFAULT_API_PAGE).catch(DEFAULT_API_PAGE),
  size: z.coerce.number().optional().default(DEFAULT_PAGE_SIZE).catch(DEFAULT_PAGE_SIZE),
});
