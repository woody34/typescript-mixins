import { ObjectId } from "$mongo";
import z from "$zod";

export const MongoIdDtoSchema = z.union([
  z.string().regex(/^[0-9a-f]{24}$/),
  z.instanceof(ObjectId),
]).transform(
  (str: string | ObjectId) => new ObjectId(str),
);
