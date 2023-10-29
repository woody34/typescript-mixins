export class HttpError extends Error {
  name = "HttpError";

  constructor(
    public readonly message: string,
    public readonly code: number,
  ) {
    super(message);
  }
}
