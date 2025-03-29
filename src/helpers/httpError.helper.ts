class HttpError extends Error {
  public status: number;
  public stack?: string;

  constructor(status: number, msg: string, stack?: string) {
    super(msg);
    this.status = status;
    this.name = "HttpError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.stack = stack;
  }
}

export default HttpError;
