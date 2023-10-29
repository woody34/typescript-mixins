import { Constructor } from "../../../mod.ts";

export function LoggerMixin<TBase extends Constructor>(Base: TBase) {
  return class Logger extends Base {
    static disableLogging = false;

    public static log(...messages: unknown[]): void {
      if (!this.disableLogging) {
        console.log(...messages);
      }
    }

    public static warn(...messages: unknown[]): void {
      if (!this.disableLogging) {
        console.warn(...messages);
      }
    }

    public static error(...messages: unknown[]): void {
      if (!this.disableLogging) {
        console.error(...messages);
      }
    }
  };
}
