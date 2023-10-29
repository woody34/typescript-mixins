import { z } from "$zod";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import database from "../utils/mongo.client.ts";
import { MongoSchema } from "./mongo.entity.ts";

export const UserSchema = MongoSchema.extend({
  _id: z.instanceof(ObjectId),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  orgName: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserCollection = database.collection<User>("user");
export const UserArchivesCollection = database.collection<User>(
  "user_archives",
);
