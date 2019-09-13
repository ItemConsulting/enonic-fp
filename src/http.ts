import { Either, tryCatch } from "fp-ts/lib/Either";
import { Error } from "./common";
const httpClient = __non_webpack_require__("/lib/http-client");

interface HttpRequestParamsProxy {
  /** Proxy host name to use. */
  host?: string;

  /** Proxy port to use. */
  port?: number;

  /** User name for proxy authentication. */
  user?: string;

  /** Password for proxy authentication. */
  password?: string;
}

interface HttpRequestParamsAuth {
  /** User name for basic authentication. */
  user?: string;

  /** Password for basic authentication. */
  password?: string;
}

export interface HttpRequestParams {
  /** URL to which the request is sent. */
  url: string;

  /** The HTTP method to use for the request (e.g. "POST", "GET", "HEAD", "PUT", "DELETE"). */
  method?: string;

  /** Query or form parameters to be sent with the request. */
  params?: { [key: string]: string };

  /** HTTP headers, an object where the keys are header names and the values the header values. */
  headers?: { [key: string]: string };

  /** The timeout on establishing the connection, in milliseconds. */
  connectionTimeout?: number;

  /** The timeout on waiting to receive data, in milliseconds. */
  readTimeout?: number;

  /** Body content to send with the request, usually for POST or PUT requests. It can be of type string or stream. */
  body?: string | any;

  /** Content type of the request. */
  contentType?: string;

  /**
   * Multipart form data to send with the request, an array of part objects. Each part object contains
   * 'name', 'value', and optionally 'fileName' and 'contentType' properties. Where 'value' can be either a string or a
   * Stream object.
   */
  multipart?: Array<object>;

  /** Settings for basic authentication. */
  auth?: HttpRequestParamsAuth;

  /** Proxy settings. */
  proxy?: HttpRequestParamsProxy;

  /**
   * If set to false redirect responses (status=3xx) will not trigger a new internal request, and the function will
   * return directly with the 3xx status.
   */
  followRedirects?: boolean;
}

export interface HttpResponse {
  /** HTTP status code returned. */
  status: number;

  /** HTTP status message returned. */
  message: string;

  /** HTTP headers of the response. */
  headers: { [key: string]: string | undefined };

  /** Content type of the response. */
  contentType: string;

  /** Body of the response as string. Null if the response content-type is not of type text. */
  body: string | null;

  /** Body of the response as a stream object. */
  bodyStream: any;
}

/**
 * Sends an HTTP request and returns the response received from the remote server.
 * The request is sent synchronously, the execution blocks until the response is received.
 */
export function request(params: HttpRequestParams): Either<Error, HttpResponse> {
  return tryCatch(
    () => httpClient.request(params),
    (e) => ({
      cause: String(e),
      errorKey: "BadGatewayError"
    })
  );
}
