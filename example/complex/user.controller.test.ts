import { assert } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { UserController } from "./user.controller.ts";

Deno.test(UserController.name, async (ctx) => {
  await ctx.step("has findById", () => {
    assert(UserController.findById != null);
  });

  await ctx.step("has insert", () => {
    assert(UserController.insert != null);
  });

  await ctx.step("has update", () => {
    assert(UserController.update != null);
  });

  await ctx.step("has query", () => {
    assert(UserController.query != null);
  });
});
