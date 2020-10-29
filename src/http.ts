import {chain, IOEither} from "fp-ts/IOEither";
import {HttpLibrary, HttpRequestParams, HttpResponse} from "enonic-types/http";
import {badGatewayError, catchEnonicError, EnonicError} from "./errors";
import {fromNullable, isString, parseJSON} from "./utils";
import {Json} from "fp-ts/Either";
import {pipe} from "fp-ts/pipeable";

let httpLib = __non_webpack_require__("/lib/http-client");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: HttpLibrary): void {
  httpLib = library;
}

/**
 * Sends an HTTP request and returns the response received from the remote server.
 * The request is sent synchronously, the execution blocks until the response is received.
 */
export function request(url: string): IOEither<EnonicError, HttpResponse>;
export function request(params: HttpRequestParams): IOEither<EnonicError, HttpResponse>;
export function request(paramsOrUrl: HttpRequestParams | string): IOEither<EnonicError, HttpResponse> {
  return catchEnonicError(
    () => httpLib.request(
      isString(paramsOrUrl)
        ? {url: paramsOrUrl}
        : paramsOrUrl,
    ),
    badGatewayError
  );
}

export function bodyAsJson(res: HttpResponse): IOEither<EnonicError, Json> {
  return pipe(
    res.body,
    fromNullable(badGatewayError),
    chain((str) => parseJSON<EnonicError>(str, (reason: unknown) =>
      (
        {
          type: "https://itemconsulting.github.io/problems/bad-gateway",
          title: "Bad Gateway Error",
          status: 502,
          detail: String(reason),
        }
      )
    ))
  );
}
