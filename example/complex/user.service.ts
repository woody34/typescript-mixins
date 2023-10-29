import { mixins } from "../../mod.ts";
import { UserInsertDtoSchema } from "./dtos/user-insert.dto.ts";
import { UserPaginationDtoSchema } from "./dtos/user-pagination.dto.ts";
import { UserPartialDtoSchema } from "./dtos/user-partial.dto.ts";
import { UserQueryResultDtoSchema } from "./dtos/user-query-results.dto.ts";
import { UserDtoSchema } from "./dtos/user.dto.ts";
import {
  UserArchivesCollection,
  UserCollection,
  UserSchema,
} from "./entities/user.entity.ts";
import { LoggerMixin } from "./mixins/logger.mixin.ts";
import { ArchiveServiceMixinFactory } from "./mixins/service/archive.service.mixin.ts";
import { DeleteMixinFactory } from "./mixins/service/delete.service.mixin.ts";
import { FindByIdServiceMixinFactory } from "./mixins/service/find-by-id.service.mixin.ts";
import { InsertServiceMixinFactory } from "./mixins/service/insert.service.mixin.ts";
import { QueryServiceMixinFactory } from "./mixins/service/query.service.mixin.ts";
import { SoftDeleteMixinFactory } from "./mixins/service/soft-delete.service.mixin.ts";
import { UpdateServiceMixinFactory } from "./mixins/service/update.service.mixin.ts";
import { userQueryFilterFactory } from "./utils/query.filter.ts";

const FindByIdMixin = FindByIdServiceMixinFactory(
  UserCollection,
  UserDtoSchema,
);

const QueryMixin = QueryServiceMixinFactory(
  {
    Collection: UserCollection,
    InSchema: UserPaginationDtoSchema,
    OutSchema: UserQueryResultDtoSchema,
    queryFilterFactory: userQueryFilterFactory,
  },
);

const InsertMixin = InsertServiceMixinFactory(
  UserCollection,
  UserInsertDtoSchema,
);

const UpdateMixin = UpdateServiceMixinFactory(
  UserCollection,
  UserPartialDtoSchema,
);

const SoftDeleteMixin = SoftDeleteMixinFactory(UserCollection);
const DeleteMixin = DeleteMixinFactory(UserCollection);
const ArchiveMixin = ArchiveServiceMixinFactory(
  UserCollection,
  UserArchivesCollection,
  UserSchema,
);

export default class UserService extends mixins(
  FindByIdMixin,
  QueryMixin,
  InsertMixin,
  UpdateMixin,
  SoftDeleteMixin,
  DeleteMixin,
  ArchiveMixin,
  LoggerMixin,
) {
}
