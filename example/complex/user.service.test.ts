import { assert } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import UserService from "./user.service.ts";

Deno.test(UserService.name, async (ctx) => {
  await ctx.step("has findById", () => {
    assert(UserService.findById != null);
  });

  await ctx.step("has insert", () => {
    assert(UserService.insert != null);
  });

  await ctx.step("has update", () => {
    assert(UserService.update != null);
  });

  await ctx.step("has delete", () => {
    assert(UserService.delete != null);
  });

  await ctx.step("has archive", () => {
    assert(UserService.archive != null);
  });

  await ctx.step("has softDelete", () => {
    assert(UserService.softDelete != null);
  });

  await ctx.step("has query", () => {
    assert(UserService.query != null);
  });
});
