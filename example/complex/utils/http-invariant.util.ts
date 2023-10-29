import { Status } from "$fresh/server.ts";
import $invariant from "$invariant";
import { HttpError } from "./http-error.util.ts";

/**
 * @description used in combo with safeHttp to bubble up errors as http responses to the client
 * @param condition Boolean
 * @param message String
 * @param status Status
 * @returns
 */
export function httpInvariant(
  condition: boolean,
  message: string,
  status: Status,
): asserts condition {
  try {
    $invariant(condition, message);
  } catch {
    throw new HttpError(message, status);
  }
}
