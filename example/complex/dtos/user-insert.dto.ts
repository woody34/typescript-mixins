import { Mongo, MongoSchemaCreate } from "../entities/mongo.entity.ts";
import { User, UserSchema } from "../entities/user.entity.ts";

export const UserInsertDtoSchema = UserSchema.merge(MongoSchemaCreate).partial({
  _id: true,
});

export type UserCreateDto = Omit<User, keyof Mongo> & Partial<Mongo>;
