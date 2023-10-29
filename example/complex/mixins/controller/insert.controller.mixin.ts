import { Handler, Status } from "$fresh/server.ts";
import { ObjectId } from "$mongo";
import z, { ZodObject } from "$zod";
import { Constructor } from "../../../../mod.ts";
import { httpInvariant } from "../../utils/http-invariant.util.ts";
import { SafeParseJsonMixin } from "../safe-parse-json.mixin.ts";

export function InsertControllerMixinFactory<
  // deno-lint-ignore no-explicit-any
  IN extends ZodObject<any>,
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
  // deno-lint-ignore no-explicit-any
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
