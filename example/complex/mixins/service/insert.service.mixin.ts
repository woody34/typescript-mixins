import $invariant from "$invariant";
import { Collection, InsertDocument, ObjectId } from "$mongo";
import z, { ZodObject } from "$zod";
import { Constructor } from "../../../../mod.ts";
import { Mongo } from "../../entities/mongo.entity.ts";

export function InsertServiceMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
  // deno-lint-ignore no-explicit-any
  IN extends ZodObject<any>,
>(Collection: COL, InSchema: IN) {
  return function InsertServiceMixin<TBase extends Constructor>(Base: TBase) {
    return class InsertService extends Base {
      public static async insert(data: z.infer<IN>): Promise<ObjectId> {
        const parsed = InSchema.parse(data) as InsertDocument<ENTITY>;
        const id = await Collection.insertOne(
          parsed,
        );

        $invariant(
          ObjectId.isValid(id),
          `Insert failed for collection ${Collection.name}`,
        );

        return id;
      }
    };
  };
}
