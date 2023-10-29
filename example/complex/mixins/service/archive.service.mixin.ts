import $invariant from "$invariant";
import { Collection, Filter, ObjectId } from "$mongo";
import { ZodObject } from "$zod";
import { Constructor } from "../../../../mod.ts";
import { Mongo } from "../../entities/mongo.entity.ts";

export function ArchiveServiceMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
>(Collection: COL, ArchiveCollection: COL, OutSchema: OUT) {
  return function ArchiveServiceMixin<TBase extends Constructor>(Base: TBase) {
    return class ArchiveService extends Base {
      public static async archive(id: ObjectId): Promise<boolean> {
        $invariant(
          ObjectId.isValid(id),
          `Unable to archive ${Collection.name} to ${ArchiveCollection.name} due to invalid id "${
            String(id)
          }".`,
        );
        const filter = { _id: new ObjectId(id) } as Filter<ENTITY>;
        const document = await Collection.findOne(filter);

        $invariant(
          document != null,
          `Unable to archive ${Collection.name} to ${ArchiveCollection.name}, doc with id "${
            String(id)
          }" not found.`,
        );

        const parsed = OutSchema.parse(document) as ENTITY;
        const archiveId = await ArchiveCollection.insertOne(parsed);
        $invariant(
          ObjectId.isValid(archiveId),
          `Inserting doc with id "${
            String(id)
          }" into collection ${ArchiveCollection.name} has failed.`,
        );

        const result = await Collection.deleteOne(filter);
        $invariant(
          result === 1,
          `Deleting doc with id "${
            String(id)
          }" from collection ${Collection.name} has failed.`,
        );

        return result === 1 && ObjectId.isValid(archiveId);
      }
    };
  };
}
