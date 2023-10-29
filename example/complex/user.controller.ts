import { mixins } from "../../mod.ts";
import { UserInsertResultDtoSchema } from "./dtos/user-insert-results.dto.ts";
import { UserInsertDtoSchema } from "./dtos/user-insert.dto.ts";
import { UserPaginationDtoSchema } from "./dtos/user-pagination.dto.ts";
import { UserPartialDtoSchema } from "./dtos/user-partial.dto.ts";
import { UserQueryResultDtoSchema } from "./dtos/user-query-results.dto.ts";
import { UserDtoSchema } from "./dtos/user.dto.ts";
import { FindByIdControllerMixinFactory } from "./mixins/controller/find-by-id.controller.mixin.ts";
import { InsertControllerMixinFactory } from "./mixins/controller/insert.controller.mixin.ts";
import { QueryControllerMixinFactory } from "./mixins/controller/query.controller.mixin.ts";
import { UpdateControllerMixinFactory } from "./mixins/controller/update.controller.mixin.ts";
import { SafeParseJsonMixin } from "./mixins/safe-parse-json.mixin.ts";
import UserService from "./user.service.ts";

const InsertControllerMixin = InsertControllerMixinFactory(
  UserService,
  UserInsertDtoSchema,
  UserInsertResultDtoSchema,
);

const UpdateControllerMixin = UpdateControllerMixinFactory(
  UserService,
  UserPartialDtoSchema,
);

const FindByIdControllerMixin = FindByIdControllerMixinFactory(
  UserService,
  UserDtoSchema,
);

const QueryControllerMixin = QueryControllerMixinFactory(
  UserService,
  UserPaginationDtoSchema,
  UserQueryResultDtoSchema,
);

export class UserController extends mixins(
  InsertControllerMixin,
  SafeParseJsonMixin,
  UpdateControllerMixin,
  FindByIdControllerMixin,
  QueryControllerMixin,
) {}
