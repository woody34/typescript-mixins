import z from "$zod";
import { UserDtoSchema } from "./user.dto.ts";

export const UserInsertResultDtoSchema = UserDtoSchema.pick({ _id: true });

export type UserInsertResultDto = z.infer<typeof UserInsertResultDtoSchema>;
