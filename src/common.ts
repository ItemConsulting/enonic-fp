export declare interface Request {
  readonly method: "GET" | "PUT" | "POST" | "DELETE";
  readonly scheme: string;
  readonly host: string;
  readonly port: string;
  readonly path: string;
  readonly url: string;
  readonly remoteAddress: string;
  readonly mode: string;
  readonly branch: string;
  readonly body: string;
  readonly params: { readonly [key: string]: string | undefined };
  readonly headers: { readonly [key: string]: string | undefined };
  readonly cookies: { readonly [key: string]: string | undefined };
}

export interface PageContributions {
  readonly headBegin?: string | ReadonlyArray<string>;
  readonly headEnd?: string | ReadonlyArray<string>;
  readonly bodyBegin?: string | ReadonlyArray<string>;
  readonly bodyEnd?: string | ReadonlyArray<string>;
}

interface BaseError {
  readonly errorKey: EnonicErrorKey;
}

export type GeneralEnonicErrorKey =
  | "UnauthorizedError"
  | "ForbiddenError"
  | "NotFoundError"
  | "MethodNotAllowedError"
  | "InternalServerError"
  | "BadGatewayError"
  | "PublishError";

export type EnonicErrorKey = GeneralEnonicErrorKey | "BadRequestError";

export declare interface Response {
  readonly status: number;
  readonly body?: string | object;
  readonly contentType?: string;
  readonly headers?: { readonly [key: string]: string };
  readonly cookies?: { readonly [key: string]: string };
  readonly redirect?: string;
  readonly postProcess?: boolean;
  readonly pageContributions?: PageContributions;
  readonly applyFilters?: boolean;
}

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
