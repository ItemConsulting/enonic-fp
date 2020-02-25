interface BaseError {
  readonly errorKey: EnonicErrorKey;
}

export type GeneralEnonicErrorKey =
  | "UnauthorizedError"
  | "ForbiddenError"
  | "NotFoundError"
  | "MethodNotAllowedError"
  | "InternalServerError"
  | "TooManyRequestsError"
  | "BadGatewayError"
  | "PublishError";

export type EnonicErrorKey = GeneralEnonicErrorKey | "BadRequestError";

export interface BadRequestErrorsByKey {
  readonly [key: string]: ReadonlyArray<string>;
}

export interface GenericError extends BaseError {
  readonly errorKey: GeneralEnonicErrorKey;
  readonly cause?: string;
  readonly stackTrace?: string;
}

export interface BadRequestError extends BaseError {
  readonly errorKey: "BadRequestError";
  readonly errors: BadRequestErrorsByKey;
}

export function isBadRequestError(err: EnonicError): err is BadRequestError {
  return err.errorKey === "BadRequestError";
}

export type EnonicError = GenericError | BadRequestError;
