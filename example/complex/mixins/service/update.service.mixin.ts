import $invariant from "$invariant";
import { Collection, Filter, UpdateFilter } from "$mongo";
import z, { ZodObject } from "$zod";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import { Constructor } from "../../../../mod.ts";
import { Mongo } from "../../entities/mongo.entity.ts";

export function UpdateServiceMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
  // deno-lint-ignore no-explicit-any
  IN extends ZodObject<any>,
>(Collection: COL, InSchema: IN) {
  return function UpdateServiceMixin<TBase extends Constructor>(Base: TBase) {
    return class UpdateService extends Base {
      public static async update(
        id: ObjectId,
        data: z.infer<IN>,
      ): Promise<boolean> {
        const parsed = InSchema.parse(data);
        const { _id, ...partial } = parsed;
        const filterId = new ObjectId(id);

        $invariant(
          _id == null || filterId.equals(_id),
          `Update on ${Collection.name} attempted with mismatching ids`,
        );

        const filter = { _id: filterId } as Filter<ENTITY>;
        const result = await Collection.updateOne(
          filter,
          { $set: partial } as UpdateFilter<ENTITY>,
        );

        const success = result.matchedCount === 1 && result.modifiedCount === 1;

        $invariant(
          success,
          `Update for doc "${id}" in collection ${Collection.name} failed.`,
        );

        return success;
      }
    };
  };
}
