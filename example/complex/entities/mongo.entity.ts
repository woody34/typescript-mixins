import { ObjectId } from "$mongo";
import { z } from "$zod";

export const MongoIdSchema = z.instanceof(ObjectId);

export const MongoSchema = z.object({
  _id: MongoIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  inactive: z.boolean(),
});

export const MongoSchemaCreate = z.object({
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  inactive: z.boolean().default(false),
});

export type Mongo = z.infer<typeof MongoSchema>;

export const MongoOmissionWithId: Record<
  keyof Pick<Mongo, "createdAt" | "inactive" | "updatedAt">,
  true
> = {
  createdAt: true,
  updatedAt: true,
  inactive: true,
} as const;

export const MongoOmission: Record<
  keyof Mongo,
  true
> = {
  createdAt: true,
  updatedAt: true,
  inactive: true,
  _id: true,
} as const;
