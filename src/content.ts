import { Either, tryCatch, chain, fromNullable, right, left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Error } from "./common";
const content = __non_webpack_require__('/lib/xp/content');

export interface Content {
  _id: string,
  name: string,
  _path: string,
  creator: string,
  modifier: string,
  createdTime: string,
  modifiedTime: string,
  owner: string,
  type: string,
  displayName: string,
  hasChildren: Boolean,
  language: string,
  valid: Boolean,
  childOrder: String,
  data: any,
  x: { [key:string]: string },
  page: any,
  attachments: object,
  publish: any
}

interface QueryContentParams {
  start?: number,
  count?: number,
  query: string,
  filters?: object,
  sort?: string,
  aggregations?: string,
  contentTypes?: Array<string>
}

export interface QueryResponse {
  aggregations: object,
  count: number,
  hits: Array<Content>,
  total: number
}

export interface GetContentParams {
  key: string
}

export interface DeleteContentParams {
  key: string
}

export interface CreateContentParams {
  name: string,
  parentPath: string,
  displayName?: string,
  requireValid?: boolean,
  refresh?: boolean,
  contentType: string,
  language?: string,
  childOrder?: string,
  data: any,
  x?: string
}

export interface ModifyContentParams {
  key: string,
  editor: (c?: Content) => Content,
  requireValid?: boolean
}

export interface PublishContentParams {
  keys: Array<string>,
  sourceBranch: string,
  targetBranch: string,
  schedule?: ScheduleParams,
  excludeChildrenIds?: Array<string>,
  includeDependencies?: boolean
}

interface ScheduleParams {
  from: string,
  to: string
}


interface PublishResponse {
  pushedContents: Array<string>,
  deletedContents: Array<string>,
  failedContents: Array<string>
}

export function get(params: GetContentParams) :Either<Error, Content> {
  return pipe(
    tryCatch<Error, Content>(
      () => content.get(params),
      (e) => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<Error>({ errorKey: "InternalServerError" }))
  );
}

export function query(params: QueryContentParams) :Either<Error, QueryResponse> {
  return tryCatch(
    () => content.query(params),
    (e) =>({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function create(params: CreateContentParams) :Either<Error, Content> {
  return tryCatch(
    () => content.create(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function modify(params: ModifyContentParams) :Either<Error, Content> {
  return tryCatch(
    () => content.modify(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function remove(params: DeleteContentParams) :Either<Error, boolean> {
  return pipe(
    tryCatch<Error, boolean>(
      () : boolean => content.delete(params),
      (e) => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain((success) => success
      ? right(success)
      : left({ errorKey: "NotFoundError" })
    )
  );
}

export function publish(params: PublishContentParams) :Either<Error, PublishResponse> {
  return tryCatch<Error, PublishResponse>(
    () => content.publish(params),
    (e) => ({ errorKey: "PublishError", cause: String(e) })
  )
}
