import z from "$zod";
import { UserDtoSchema } from "./user.dto.ts";

export const UserQueryResultDtoSchema = z.object({
  count: z.number(),
  results: z.array(UserDtoSchema).default([]),
});

export type UserQueryResultDto = z.infer<typeof UserQueryResultDtoSchema>;
