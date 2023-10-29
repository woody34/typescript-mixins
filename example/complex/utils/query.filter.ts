import { Filter } from "$mongo";
import { ObjectId } from "https://deno.land/x/web_bson@v0.3.0/mod.js";
import { UserPaginationDto } from "../dtos/user-pagination.dto.ts";
import { User } from "../entities/user.entity.ts";
import { QueryFilterFactory } from "../mixins/service/query.service.mixin.ts";

export const userQueryFilterFactory: QueryFilterFactory = (
  pagination: UserPaginationDto,
) => {
  const {
    filter,
    sort = { updatedAt: 1 },
    inactive = false,
    skip = 0,
    limit = 100,
  } = pagination;

  const findFilter: Filter<User> = {
    inactive,
  };

  if (filter?.search != null) {
    const $regex = new RegExp(filter.search ?? "", "i"); // FIXME: Not efficient, use atlas search later for perf
    findFilter.$or = [
      { firstName: { $regex } },
      { lastName: { $regex } },
      { email: { $regex } },
    ];
  }

  if (filter?.ids != null && Array.isArray(filter.ids)) {
    findFilter._id = { $in: filter.ids.map((id) => new ObjectId(id)) };
  }

  return {
    filter: findFilter,
    skip,
    limit,
    sort,
  };
};
