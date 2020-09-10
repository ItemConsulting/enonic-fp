import {IOEither} from "fp-ts/lib/IOEither";
import {EnonicError} from "./errors";
import {catchEnonicError} from "./utils";
import {HttpRequestParams, HttpResponse} from "enonic-types/http";

const httpLib = __non_webpack_require__("/lib/http-client");

/**
 * Sends an HTTP request and returns the response received from the remote server.
 * The request is sent synchronously, the execution blocks until the response is received.
 */
export function request(
  params: HttpRequestParams
): IOEither<EnonicError, HttpResponse> {
  return catchEnonicError(
    () => httpLib.request(params),
    "BadGatewayError"
  );
}
