import z from "$zod";
import { UserDtoSchema } from "./user.dto.ts";

export const UserPartialDtoSchema = UserDtoSchema.partial();

export type UserPartialDto = z.infer<typeof UserPartialDtoSchema>;
