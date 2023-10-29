import { Handler, Status } from "$fresh/server.ts";
import { ObjectId } from "$mongo";
import z, { ZodObject } from "$zod";

import { Constructor } from "../../../../mod.ts";
import { MongoIdDtoSchema } from "../../dtos/mongo-id.dto.ts";
import { httpInvariant } from "../../utils/http-invariant.util.ts";
import { SafeParseJsonMixin } from "../safe-parse-json.mixin.ts";

export function FindByIdControllerMixinFactory<
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
  SERVICE extends {
    findById: (id: ObjectId) => Promise<z.infer<OUT> | undefined>;
  },
>(Service: SERVICE, OutSchema: OUT) {
  return function FindByIdControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class FindByIdController extends SafeParseJsonMixin(Base) {
      // deno-lint-ignore no-explicit-any
      public static findById: Handler<any> = async (_req, ctx) => {
        const { success } = MongoIdDtoSchema.safeParse(ctx.params.id);

        httpInvariant(
          success,
          `Invalid id: "${ctx.params.id}".`,
          Status.BadRequest,
        );

        const id = MongoIdDtoSchema.parse(ctx.params.id);
        const result = await Service.findById(new ObjectId(id));

        httpInvariant(
          result != null,
          `Record with id: "${id}" was not found.`,
          Status.NotFound,
        );

        const parsed = OutSchema.parse(result);

        return new Response(JSON.stringify(parsed));
      };
    };
  };
}
