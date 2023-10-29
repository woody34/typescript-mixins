import { z } from "$zod";
import {
  PaginationFilterSchema,
  PaginationSchema,
  PaginationSortSchema,
} from "./pagination.dto.ts";

export const UserPaginationDtoSortSchema = PaginationSortSchema;

export const UserPaginationDtoFilterSchema = PaginationFilterSchema;

export const UserPaginationDtoSchema = PaginationSchema.extend({
  sort: UserPaginationDtoSortSchema.partial().optional(),
  filter: UserPaginationDtoFilterSchema.partial().optional(),
});

export type UserPaginationDtoSort = z.infer<typeof UserPaginationDtoSortSchema>;
export type UserPaginationDtoFilter = z.infer<
  typeof UserPaginationDtoFilterSchema
>;
export type UserPaginationDto = z.infer<typeof UserPaginationDtoSchema>;
