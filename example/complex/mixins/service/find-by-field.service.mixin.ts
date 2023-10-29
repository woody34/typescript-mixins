import { set } from "$lodash";
import { Collection, Filter } from "$mongo";
import z, { ZodObject } from "$zod";
import { Constructor } from "../../../mod.ts";

export function FindByFieldServiceMixinFactory<
  ENTITY extends z.infer<OUT>,
  COL extends Collection<ENTITY>,
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
>(Collection: COL, OutSchema: OUT) {
  return function FindByFieldServiceMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class FindByFieldService extends Base {
      public static async findByField<T extends keyof ENTITY>(
        field: T,
        value: ENTITY[T],
      ): Promise<z.infer<OUT> | null> {
        const filter: Filter<ENTITY> = {};
        set(filter, field, value);

        const authUser = await Collection.findOne(filter);

        return authUser == null ? null : OutSchema.parse(authUser);
      }
    };
  };
}
