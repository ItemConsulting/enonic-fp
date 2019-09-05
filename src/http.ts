import { Either, tryCatch } from "fp-ts/lib/Either";
import { Error } from "./common";
const httpClient = __non_webpack_require__('/lib/http-client');

interface HttpRequestParamsProxy {
  host?: string
  port?: number
  user?: string
  password?: string
}

interface HttpRequestParamsAuth {
  user?: string
  password?: string
}

export interface HttpRequestParams {
  url: string
  method?: string
  params?: { [key: string]: string }
  headers?: { [key: string]: string }
  connectionTimeout?: number
  readTimeout?: number
  body?: string | any
  contentType?: string
  multipart?: Array<object>
  auth?: HttpRequestParamsAuth
  proxy?: HttpRequestParamsProxy,
  followRedirects?: boolean
}

export interface HttpResponse {
  status: number
  message: string
  headers: { [key: string]: string | undefined }
  contentType: string
  body: string | null
  bodyStream: any
}

export function request(params: HttpRequestParams) : Either<Error, HttpResponse> {
  return tryCatch(
    () => httpClient.request(params),
    (e) => ({
      errorKey: "BadGatewayError",
      cause: String(e)
    })
  )
}
