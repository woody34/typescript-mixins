import { Handler, Status } from "$fresh/server.ts";
import z, { ZodObject } from "$zod";
import { Constructor } from "../../../../mod.ts";
import { httpInvariant } from "../../utils/http-invariant.util.ts";
import { SafeParseJsonMixin } from "../safe-parse-json.mixin.ts";

export function QueryControllerMixinFactory<
  // deno-lint-ignore no-explicit-any
  IN extends ZodObject<any>,
  // deno-lint-ignore no-explicit-any
  OUT extends ZodObject<any>,
  // deno-lint-ignore no-explicit-any
  SERVICE extends { query: (data: any) => Promise<z.infer<OUT>> },
>(Service: SERVICE, InSchema: IN, OutSchema: OUT) {
  return function QueryControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class QueryController extends SafeParseJsonMixin(Base) {
      public static query: Handler<z.infer<OUT>> = async (req) => {
        const { pagination } = await this.safeParseJson<
          { pagination: z.infer<IN> }
        >(req);

        httpInvariant(
          pagination != null,
          "Missing pagination.",
          Status.BadRequest,
        );

        const { success } = InSchema.safeParse(pagination);
        httpInvariant(success, "Bad pagination inputs.", Status.NotAcceptable);

        const parsed = InSchema.parse(pagination);

        const results = await Service.query(parsed);

        const sanitized = OutSchema.parse(results);

        return new Response(JSON.stringify(sanitized));
      };
    };
  };
}
