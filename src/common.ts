export declare interface Request {
  method: "GET" | "PUT" | "POST" | "DELETE";
  scheme: string;
  host: string;
  port: string;
  path: string;
  url: string;
  remoteAddress: string;
  mode: string;
  branch: string;
  body: string;
  params: { [key: string]: string | undefined };
  headers: { [key: string]: string | undefined };
  cookies: { [key: string]: string | undefined };
}

export interface PageContributions {
  headBegin?: string | Array<string>;
  headEnd?: string | Array<string>;
  bodyBegin?: string | Array<string>;
  bodyEnd?: string | Array<string>;
}

interface BaseError {
  errorKey: EnonicErrorKey;
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
  status: number;
  body?: string | object;
  contentType?: string;
  headers?: { [key: string]: string };
  cookies?: { [key: string]: string };
  redirect?: string;
  postProcess?: boolean;
  pageContributions?: PageContributions;
  applyFilters?: boolean;
}

export interface BadRequestErrorsByKey {
  [key: string]: Array<string>;
}

export interface GenericError extends BaseError {
  errorKey: GeneralEnonicErrorKey;
  cause?: string;
  stackTrace?: string;
}

export interface BadRequestError extends BaseError {
  errorKey: "BadRequestError";
  errors: BadRequestErrorsByKey;
}

export function isBadRequestError(err: EnonicError): err is BadRequestError {
  return err.errorKey === "BadRequestError";
}

export type EnonicError = GenericError | BadRequestError;
