# What is typescript-mixins?

This is a library that can be used create typescript mixins. The `mixins` util
allows you to extend multiple mixin classes without losing types. It gives you
the ability compose classes while preventing class explosion.

# Examples

## Simple

This simple set of examples will show you 2 ways you can use this library to
compose a class.

### Static Mixin

```ts
function LegsMixin<TBase extends Constructor>(Base: TBase) {
  return class Legs extends Base {
    private static _legs = 2;

    public static get legs() {
      return this._legs;
    }

    public static set legs(legs: number) {
      this._legs = legs;
    }
  };
}

class TRex extends mixins(LegsMixin) {}
console.log(TRex.legs); // 2
```

### Static Mixin Factory

```ts
export function LegsMixinFactory(legCount: number) {
  return function LegsMixin<TBase extends Constructor>(Base: TBase) {
    return class Legs extends Base {
      static _legs = legCount;

      public static get legs() {
        return this._legs;
      }

      public static set legs(legs: number) {
        this._legs = legs;
      }
    };
  };
}

const QuadrupedLegsMixin = LegsMixinFactory(4);

class Triceratops extends mixins(QuadrupedLegsMixin) {}
console.log(Triceratops.legs); // 4
```

## Advanced

This set of examples were created for the Fresh framework to make basic CRUD
operations reusable. Conceptually I designed this application using a
[three layer architecture](https://ctrly.blog/nodejs-layered-architecture/). I
am using mongodb for persistance, and zod for schema validation. The full code
[examples](./example/) are available in the src.

### Mixin Inputs

```ts
// Entities / Types
const MongoIdSchema = z.instanceof(ObjectId);

const MongoSchema = z.object({
  _id: MongoIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  inactive: z.boolean(),
});

const UserSchema = MongoSchema.extend({
  _id: z.instanceof(ObjectId),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  orgName: z.string().optional(),
});

type User = z.infer<typeof UserSchema>;

// Mongo Collections
const UserCollection = database.collection<User>("user");
const UserArchivesCollection = database.collection<User>(
  "user_archives",
);

// DTOs
const MongoSchemaCreate = z.object({
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  inactive: z.boolean().default(false),
});

const UserInsertDtoSchema = UserSchema.merge(MongoSchemaCreate).partial({
  _id: true,
});

type UserCreateDto = Omit<User, keyof Mongo> & Partial<Mongo>;

const UserInsertResultDtoSchema = UserDtoSchema.pick({ _id: true });

type UserInsertResultDto = z.infer<typeof UserInsertResultDtoSchema>;
```

### Mixins

```ts
// Service
function InsertServiceMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
  IN extends ZodObject<any>,
>(Collection: COL, InSchema: IN) {
  return function InsertServiceMixin<TBase extends Constructor>(Base: TBase) {
    return class InsertService extends Base {
      public static async insert(data: z.infer<IN>): Promise<ObjectId> {
        const parsed = InSchema.parse(data) as InsertDocument<ENTITY>;
        const id = await Collection.insertOne(
          parsed,
        );

        invariant(
          ObjectId.isValid(id),
          `Insert failed for collection ${Collection.name}`,
        );

        return id;
      }
    };
  };
}

// Controller
function InsertControllerMixinFactory<
  IN extends ZodObject<any>,
  OUT extends ZodObject<any>,
  SERVICE extends { insert: (data: any) => Promise<ObjectId> },
>(Service: SERVICE, InSchema: IN, OutSchema: OUT) {
  return function InsertControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class InsertController extends SafeParseJsonMixin(Base) {
      public static insert: Handler<{ _id: string }> = async (req) => {
        const { data } = await this.safeParseJson<{ data: z.infer<IN> }>(req);

        const { success } = InSchema.safeParse(data);
        httpInvariant(
          success,
          "Bad data shape.",
          Status.BadRequest,
        );

        const dto: z.infer<IN> = InSchema.parse(data);

        const id = await Service.insert(dto);
        const parsed = OutSchema.parse({ _id: id });

        return new Response(JSON.stringify(parsed));
      };
    };
  };
}
```

### Class Extension

```ts
// Service
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

export default class UserService extends mixins(
  FindByIdMixin,
  QueryMixin,
  InsertMixin,
) {}

// Controller
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
```
