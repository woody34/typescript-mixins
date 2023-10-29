// deno-lint-ignore no-explicit-any ban-types
export type Constructor = new (...args: any[]) => {};

export type MixinFunction<
  T extends Constructor = Constructor,
  R extends T = T & Constructor,
> = (Base: T) => R;
export type UnionToIntersection<T> =
  // deno-lint-ignore no-explicit-any
  (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
    : never;
// deno-lint-ignore no-explicit-any
export type MixinReturnValue<T extends MixinFunction<any, any>[]> =
  UnionToIntersection<
    {
      // deno-lint-ignore no-explicit-any
      [K in keyof T]: T[K] extends MixinFunction<any, infer U> ? U : never;
    }[number]
  >;

export class BaseMixin {}

// deno-lint-ignore no-explicit-any
export function mixins<M extends MixinFunction<Constructor, any>[]>(
  ...mixins: M
): MixinReturnValue<M> {
  return mixins.reduce(
    (mix, applyMixin) => applyMixin(mix),
    BaseMixin,
  ) as MixinReturnValue<M>;
}
