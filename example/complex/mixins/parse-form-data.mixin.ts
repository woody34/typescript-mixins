import z from "$zod";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { ZodObject } from "https://deno.land/x/zod@v3.22.2/types.ts";
import { Constructor } from "../../mod.ts";
import { httpInvariant } from "../utils/http-invariant.util.ts";

export function ParseFormDataMixin<TBase extends Constructor>(Base: TBase) {
  return class ParseFormData extends Base {
    // deno-lint-ignore no-explicit-any
    public static async parseFormData<S extends ZodObject<any>>(
      req: Request,
      schema: S,
    ): Promise<{ data: z.infer<S>; formData: FormData }> {
      let body: null | { [k: string]: FormDataEntryValue } = null;
      let formData: null | FormData = null;
      try {
        formData = await req.formData();
        body = Object.fromEntries(formData);
      } catch {
        httpInvariant(false, "Malformed body.", Status.BadRequest);
      }

      httpInvariant(
        body != null,
        "Body must not be null.",
        Status.BadRequest,
      );

      const { success } = schema.safeParse(body);

      httpInvariant(success, "Bad form data.", Status.BadRequest);

      const data = schema.parse(body);

      return { data, formData };
    }
  };
}
