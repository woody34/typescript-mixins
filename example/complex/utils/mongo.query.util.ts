import { AggregatePipeline, Filter } from "$mongo";
import { Mongo } from "../entities/mongo.entity.ts";

export function queryResultsPipelineFactory<
  T extends Mongo,
>(
  filter: Filter<T>,
  skip = 0,
  limit = 100,
  sort?: Partial<Record<keyof T, number>>,
): AggregatePipeline<T>[] {
  const results = [];
  if (sort != null) {
    results.push({ $sort: sort });
  }
  results.push({ $skip: skip }, { $limit: limit });
  return [
    {
      $match: filter,
    },
    {
      $facet: {
        count: [{ $count: "value" }],
        results,
      },
    },
    {
      $unwind: "$count",
    },
    {
      $set: {
        count: "$count.value",
      },
    },
  ];
}
