import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { Constructor } from "../../../mod.ts";
import { httpInvariant } from "../utils/http-invariant.util.ts";

export function SafeParseJsonMixin<TBase extends Constructor>(Base: TBase) {
  return class SafeParseJson extends Base {
    // deno-lint-ignore no-explicit-any
    public static async safeParseJson<T = any>(
      req: Request,
    ): Promise<T> {
      let body: null | T = null;
      try {
        body = await req.json();
      } catch {
        httpInvariant(false, "Malformed body.", Status.BadRequest);
      }

      httpInvariant(
        body != null,
        "Body must not be null.",
        Status.BadRequest,
      );

      return body;
    }
  };
}
