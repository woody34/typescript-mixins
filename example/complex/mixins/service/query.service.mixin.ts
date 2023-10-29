import { AggregatePipeline, Collection, Filter } from "$mongo";
import z, { ZodObject } from "$zod";
import { Constructor } from "../../../../mod.ts";
import { Pagination } from "../../dtos/pagination.dto.ts";
import { Mongo } from "../../entities/mongo.entity.ts";
import { queryResultsPipelineFactory } from "../../utils/mongo.query.util.ts";

export type QueryFilterFactory = <T extends Mongo, P extends Pagination>(
  pagination: P,
) => QueryFilterFactoryResults<T, P>;

export type QueryFilterFactoryResults<T extends Mongo, P extends Pagination> = {
  filter: Filter<T>;
  skip: number;
  limit: number;
  sort: P["sort"];
};

export function QueryServiceMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
  // deno-lint-ignore no-explicit-any
  IN extends ZodObject<any>,
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
>(
  { Collection, InSchema, OutSchema, queryFilterFactory }: {
    Collection: COL;
    InSchema: IN;
    OutSchema: OUT;
    queryFilterFactory: QueryFilterFactory;
  },
) {
  return function QueryServiceMixin<TBase extends Constructor>(Base: TBase) {
    return class QueryService extends Base {
      public static query = async (
        pagination: z.infer<IN>,
      ): Promise<z.infer<OUT>> => {
        const parsed = InSchema.parse(pagination);
        const {
          filter,
          sort,
          skip,
          limit,
        } = queryFilterFactory(parsed);

        const pipeline: AggregatePipeline<ENTITY>[] =
          queryResultsPipelineFactory(
            filter,
            skip,
            limit,
            sort,
          );

        let [results] = await Collection.aggregate<z.infer<OUT>>(
          pipeline,
        ).toArray();

        // handle no results from db condition
        results = results == null ? { count: 0, results: [] } : results;

        return OutSchema.parse(results);
      };
    };
  };
}
