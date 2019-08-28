export interface Request {
  method: "GET" | "PUT" | "POST" | "DELETE",
  scheme: string,
  host: string,
  port: string,
  path: string,
  url: string,
  remoteAddress: string,
  mode: string,
  branch: string,
  body: string,
  params: { [key: string]: string; }
  headers: { [key: string]: string; }
  cookies: { [key: string]: string; }
}

export interface PageContributions {
  headBegin?: string | Array<string>
  headEnd?: string | Array<string>
  bodyBegin?: string | Array<string>
  bodyEnd?: string | Array<string>
}

export interface Response {
  status: number,
  body?: string|object,
  contentType?: string,
  headers?: object,
  cookies?: { [key: string]: string; },
  redirect?: string,
  postProcess?: boolean,
  pageContributions?: PageContributions,
  applyFilters?: boolean
}

export interface Error {
  errorKey: "InternalServerError" | "NotFoundError" | "PublishError",
  cause?: string
}
