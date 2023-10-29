import { assert } from "https://deno.land/std@0.204.0/assert/assert.ts";
import { Constructor, mixins } from "../../mod.ts";

// Simple static typescript mixin
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

class TRex extends mixins(LegsMixin) {
}

Deno.test(function mixinTest() {
  assert(TRex.legs === 2);
});

// Simple static typescript mixin factory
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

class Triceratops extends mixins(QuadrupedLegsMixin) {
}

Deno.test(function mixinFactoryTest() {
  assert(Triceratops.legs === 4);
});
