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

export type EnonicErrorKey =
  | "BadRequestError"
  | "UnauthorizedError"
  | "ForbiddenError"
  | "NotFoundError"
  | "MethodNotAllowedError"
  | "InternalServerError"
  | "BadGatewayError"
  | "PublishError";

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

export interface EnonicError {
  errorKey: EnonicErrorKey;
  cause?: string;
}
