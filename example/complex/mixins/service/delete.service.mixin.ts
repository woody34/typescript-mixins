import { Collection, Filter, ObjectId } from "$mongo";
import { Constructor } from "../../../../mod.ts";
import { Mongo } from "../../entities/mongo.entity.ts";

export function DeleteMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
>(Collection: COL) {
  return function DeleteServiceMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class Delete extends Base {
      public static async delete(id: ObjectId): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
          return false;
        }
        const filter = { _id: new ObjectId(id) } as Filter<ENTITY>;
        const result = await Collection.deleteOne(filter);
        return result === 1;
      }
    };
  };
}
