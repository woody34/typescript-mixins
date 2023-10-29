import { z } from "$zod";
import { MongoIdDtoSchema } from "./mongo-id.dto.ts";

export const PaginationSortSchema = z.object({
  updatedAt: z.number().optional(),
});

export const PaginationFilterSchema = z.object({
  ids: z.array(MongoIdDtoSchema.optional()).optional(),
  search: z.string().optional(),
});

export const PaginationSchema = z.object({
  sort: PaginationSortSchema.partial().optional(),
  filter: PaginationFilterSchema.partial().optional(),
  skip: z.number().optional(),
  limit: z.number().optional(),
  inactive: z.boolean().optional(),
});

export type PaginationSort = z.infer<typeof PaginationSortSchema>;
export type PaginationFilter = z.infer<typeof PaginationFilterSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
