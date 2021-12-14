import { chain, IOEither } from "fp-ts/es6/IOEither";
import type { HttpRequestParams, HttpResponse } from "/lib/http-client";
import { badGatewayError, catchEnonicError, EnonicError } from "./errors";
import { fromNullable, isString, parseJSON } from "./utils";
import type { Json } from "fp-ts/es6/Json";
import { pipe } from "fp-ts/es6/function";
import * as httpLib from "/lib/http-client";

/**
 * Sends an HTTP request and returns the response received from the remote server.
 * The request is sent synchronously, the execution blocks until the response is received.
 */
export function request(url: string): IOEither<EnonicError, HttpResponse>;
export function request(params: HttpRequestParams): IOEither<EnonicError, HttpResponse>;
export function request(paramsOrUrl: HttpRequestParams | string): IOEither<EnonicError, HttpResponse> {
  return catchEnonicError(
    () => httpLib.request(isString(paramsOrUrl) ? { url: paramsOrUrl } : paramsOrUrl),
    badGatewayError
  );
}

export function bodyAsJson(res: HttpResponse): IOEither<EnonicError, Json> {
  return pipe(
    res.body,
    fromNullable(badGatewayError),
    chain((str) =>
      parseJSON<EnonicError>(str, (reason: unknown) => ({
        type: "https://itemconsulting.github.io/problems/bad-gateway",
        title: "Bad Gateway Error",
        status: 502,
        detail: String(reason),
      }))
    )
  );
}
