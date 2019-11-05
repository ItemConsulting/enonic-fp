import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./errors";
import { catchEnonicError } from "./utils";
import { HttpLibrary, HttpRequestParams, HttpResponse } from "enonic-types/lib/http";
const httpLib: HttpLibrary = __non_webpack_require__("/lib/http-client");

/**
 * Sends an HTTP request and returns the response received from the remote server.
 * The request is sent synchronously, the execution blocks until the response is received.
 */
export function request(
  params: HttpRequestParams
): IOEither<EnonicError, HttpResponse> {
  return catchEnonicError<HttpResponse>(
    () =>  httpLib.request(params),
    "BadGatewayError"
  );
}
