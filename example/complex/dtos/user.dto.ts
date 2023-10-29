import z from "$zod";
import { MongoOmissionWithId } from "../entities/mongo.entity.ts";
import { UserSchema } from "../entities/user.entity.ts";
import { MongoIdDtoSchema } from "./mongo-id.dto.ts";

export const UserDtoSchema = UserSchema.omit(MongoOmissionWithId).extend({
  _id: MongoIdDtoSchema,
});

export type UserDto = z.infer<typeof UserDtoSchema>;
