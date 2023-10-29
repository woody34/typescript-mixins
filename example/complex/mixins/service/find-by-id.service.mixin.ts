import { Collection, Filter, ObjectId } from "$mongo";
import z, { ZodObject } from "$zod";
import { Constructor } from "../../../../mod.ts";
import { Mongo } from "../../entities/mongo.entity.ts";

export function FindByIdServiceMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
>(Collection: COL, OutSchema: OUT) {
  return function FindByIdServiceMixin<TBase extends Constructor>(Base: TBase) {
    return class FindByIdService extends Base {
      public static findById = async (
        id: ObjectId,
      ): Promise<z.infer<typeof OutSchema> | undefined> => {
        const filter: Filter<ENTITY> = {
          _id: new ObjectId(id),
        } as Filter<ENTITY>;
        const result = await Collection.findOne(filter);

        return OutSchema.parse(result);
      };
    };
  };
}
