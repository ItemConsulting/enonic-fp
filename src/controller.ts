import {Request, Response, ResponseType} from "enonic-types/controller";
import {localizeFirst} from "./i18n";
import {getOrElse} from 'fp-ts/lib/Option'
import {IO, io} from "fp-ts/lib/IO";
import {getUnsafeRenderer} from "./thymeleaf";
import {ResourceKey} from "enonic-types/thymeleaf";
import {EnonicError, isEnonicError} from "./errors";
import {pipe} from "fp-ts/lib/function";
import {substringAfter} from "./utils";

export type AsResponse = (body: ResponseType, extras?: Partial<Response>) => IO<Response>;
export type AsErrorResponse = (err: EnonicError, extras?: Partial<Response>) => IO<Response>;

export const ok: AsResponse = asResponseFromStatus(200);

export const created: AsResponse = asResponseFromStatus(201);

export const noContent: AsResponse = (body: ResponseType, extras: Partial<Response> = {}): IO<Response> => io.of<Response>({
  ...extras,
  status: 204,
  body: ''
});

export const redirect = (redirect: string): IO<Response> => io.of<Response>({
  applyFilters: false,
  postProcess: false,
  redirect,
  status: 303,
  body: ''
});

export const badRequest: AsResponse = asResponseFromStatus(400);

export const unauthorized: AsResponse = asResponseFromStatus(401);

export const forbidden: AsResponse = asResponseFromStatus(403);

export const notFound: AsResponse = asResponseFromStatus(404);

export const methodNotAllowed: AsResponse = asResponseFromStatus(405);

export const internalServerError: AsResponse = asResponseFromStatus(500);

export const badGateway: AsResponse = asResponseFromStatus(502);

/**
 * Returns an error response where the "title"-field is translated with i18nLib.localize()
 */
export function errorResponse(req?: Request): AsErrorResponse;
export function errorResponse(params: ErrorResponseParams): AsErrorResponse;
export function errorResponse(paramsOrReq?: Request | ErrorResponseParams): AsErrorResponse {
  const params = isRequest(paramsOrReq)
    ? {req: paramsOrReq}
    : paramsOrReq;

  return (err: EnonicError, extras: Partial<Response> = {}): IO<Response> => {
    const result: EnonicError = {
      type: err.type,
      title: translateField("title", err, params?.i18nPrefix),
      instance: params?.req?.path,
      status: err.status,
      detail: translateField("detail", err, params?.i18nPrefix),

      // don't expose server internals on live site
      errors: (err.status >= 500 && params?.req?.mode !== 'live')
        ? err.errors
        : undefined
    }

    return status(result.status, result, extras);
  };
}

function isRequest(value: unknown): value is Request {
  const req = value as Request;
  return req.method !== undefined && req.url !== undefined;
}

export interface ErrorResponseParams {
  readonly req?: Request;
  readonly i18nPrefix?: string;
}

function translateField<FieldName extends ('title' | 'detail')>(
  fieldName: FieldName,
  err: EnonicError,
  i18nPrefix = "errors"
): EnonicError[FieldName] {
  const typeString = substringAfter(err.type, "/");

  // keys to try to look up in order
  const titleKeys = [
    `${i18nPrefix}.${fieldName}.${typeString}`,  // myError.title.not-found
    `${i18nPrefix}.${fieldName}.${err.status}`,  // myError.title.404
    `${i18nPrefix}.${typeString}`,               // myError.not-found
    `${i18nPrefix}.${err.status}`,               // myError.404
    `errors.${fieldName}.${typeString}`,         // errors.title.not-found
    `errors.${fieldName}.${err.status}`,         // errors.title.404
    `errors.${typeString}`,                      // errors.not-found
    `errors.${err.status}`,                      // errors.404
  ];

  return pipe(
    titleKeys,
    localizeFirst,
    getOrElse(() => err[fieldName])
  );
}

/**
 * Creates a Response based on a thymeleaf view, and an EnonicError
 */
export function unsafeRenderErrorPage(view: ResourceKey): AsErrorResponse {
  return (err: EnonicError, extras: Partial<Response> = {}): IO<Response> => status(err, getUnsafeRenderer<EnonicError>(view)(err), extras);
}

/**
 * Resolves the content-type based on the body content
 */
function contentType(body: ResponseType): string {
  return (typeof body === "string")
    ? 'text/html'
    : isEnonicError(body)
      ? 'application/problem+json'
      : 'application/json';
}

/**
 * Create a Response based on a http-status/ErrorMessage, body, and extra parameters
 */
export function status(httpStatus: number, body?: ResponseType, extras?: Partial<Response>): IO<Response>;
export function status(error: EnonicError, body?: ResponseType, extras?: Partial<Response>): IO<Response>;
export function status(httpStatusOrError: number | EnonicError, body: ResponseType = '', extras: Partial<Response> = {}): IO<Response> {
  const httpStatus = (typeof httpStatusOrError == 'number')
    ? httpStatusOrError
    : httpStatusOrError.status;

  return io.of({
    contentType: contentType(body),
    ...extras,
    status: httpStatus,
    body
  });
}

function asResponseFromStatus(httpStatus: number): AsResponse {
  return (body: ResponseType, extras: Partial<Response> = {}) => status(httpStatus, body, extras);
}