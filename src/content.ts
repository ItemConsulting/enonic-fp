import { Either, tryCatch, chain, fromNullable, right, left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Error } from "./common";
const content = __non_webpack_require__('/lib/xp/content');

export interface Content<T> {
  _id: string,
  _name: string,
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
  data: T,
  x: { [key:string]: string },
  page: any,
  attachments: Attachments,
  publish: any
}

export interface Attachment {
  name: string,
  label?: string,
  size: number,
  mimeType: string
}

export type Attachments = { [key: string]: Attachment }

export interface QueryContentParams {
  start?: number,
  count?: number,
  query: string,
  filters?: object,
  sort?: string,
  aggregations?: string,
  contentTypes?: Array<string>
}

export interface QueryResponse<T> {
  aggregations: object,
  count: number,
  hits: Array<Content<T>>,
  total: number
}

export interface GetContentParams {
  key: string
}

export interface DeleteContentParams {
  key: string
}

export interface CreateContentParams<T> {
  name: string,
  parentPath: string,
  displayName?: string,
  requireValid?: boolean,
  refresh?: boolean,
  contentType: string,
  language?: string,
  childOrder?: string,
  data: T,
  x?: string
}

export interface ModifyContentParams<T> {
  key: string,
  editor: (c: Content<T>) => Content<T>,
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

export interface ScheduleParams {
  from: string,
  to: string
}

export interface PublishResponse {
  pushedContents: Array<string>,
  deletedContents: Array<string>,
  failedContents: Array<string>
}

export interface UnpublishContentParams {
  keys: string[]
}

export interface GetChildrenParams {
  key: string
  start?: number
  count?: number
  sort?: string
}

export interface MoveParams {
  source: string
  target: string
}

export interface GetSiteParams {
  key: string
}

export interface Site<T> {
  _id: string,
  _name: string,
  _path: string,
  type: string,
  hasChildren: Boolean,
  valid: Boolean,
  data: {
    siteConfig: SiteConfig<T>
  },
  x: { [key:string]: string },
  page: any,
  attachments: object,
  publish: any
}

export interface SiteConfig<T> {
  applicationKey: string,
  config: T,
}

export interface GetSiteConfigParams {
  key: string,
  applicationKey: string
}

export interface AttachmentStreamParams {
  key: string
  name: string
}

export interface RemoveAttachmentParams {
  key: string
  name: string | string[]
}

export interface CreateMediaParams {
  name?: string
  parentPath?: string
  mimeType?: string
  focalX?: number
  focalY?: number
  data: any // stream
}

export interface GetPermissionsParams {
  key: string
}

export interface GetPermissionsResult {
  inheritsPermissions: boolean
  permissions: PermissionsParams[]
}

export interface PermissionsParams {
  principal: string
  allow: string[]
  deny: string[]
}

export interface SetPermissionsParams {
  key: string,
  inheritPermissions: boolean
  overwriteChildPermissions: boolean
  permissions: PermissionsParams[]
}

export interface IconType {
  data?: any,
  mimeType?: string
  modifiedTime?: string
}

export interface ContentType {
  "name": string,
  "displayName": string
  "description": string
  "superType": string
  "abstract": boolean
  "final": boolean
  "allowChildContent": boolean
  "displayNameExpression": string
  "icon": IconType[]
  "form": any[]
}

export function get<T>(params: GetContentParams) :Either<Error, Content<T>> {
  return pipe(
    tryCatch<Error, Content<T>>(
      () => content.get(params),
      (e) => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<Error>({ errorKey: "NotFoundError" }))
  );
}

export function query<T>(params: QueryContentParams) :Either<Error, QueryResponse<T>> {
  return tryCatch(
    () => content.query(params),
    (e) =>({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function create<T>(params: CreateContentParams<T>) :Either<Error, Content<T>> {
  return tryCatch(
    () => content.create(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function modify<T>(params: ModifyContentParams<T>) :Either<Error, Content<T>> {
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

export function unpublish(params: UnpublishContentParams) :Either<Error, string[]> {
  return tryCatch<Error, string[]>(
    () => content.unpublish(params),
    (e) => ({ errorKey: "PublishError", cause: String(e) })
  )
}

export function getChildren<T>(params: GetChildrenParams) :Either<Error, QueryResponse<T>> {
  return tryCatch<Error, QueryResponse<T>>(
    () => content.getChildren(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function move<T>(params: MoveParams) :Either<Error, Content<T>> {
  return tryCatch<Error, Content<T>>(
    () => content.move(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function getSite<T>(params: GetSiteParams) :Either<Error, Site<T>> {
  return tryCatch<Error, Site<T>>(
    () => content.getSite(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function getSiteConfig<T>(params: GetSiteConfigParams) :Either<Error, T> {
  return tryCatch<Error, T>(
    () => content.getSiteConfig(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function createMedia<T>(params: CreateMediaParams) :Either<Error, Content<T>> {
  return tryCatch<Error, Content<T>>(
    () => content.createMedia(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function getAttachments(key: string) :Either<Error, Attachments> {
  return pipe(
    tryCatch<Error, Attachments>(
      () => content.getAttachments(key),
      (e) => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<Error>({ errorKey: "NotFoundError" }))
  );
}

// The return type is Java: com.google.common.io.ByteSource
export function getAttachmentStream(params: AttachmentStreamParams) : Either<Error, any> {
  return pipe(
    tryCatch<Error, any>(
      () => content.getAttachmentStream(params),
      (e) => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<Error>({ errorKey: "NotFoundError" }))
  );
}

export function removeAttachment(params: RemoveAttachmentParams) : Either<Error, void> {
  return tryCatch<Error, void>(
    () => content.removeAttachment(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getPermissions(params: GetPermissionsParams) : Either<Error, GetPermissionsResult> {
  return tryCatch<Error, GetPermissionsResult>(
    () => content.getPermissions(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function setPermissions(params: SetPermissionsParams) : Either<Error, GetPermissionsResult> {
  return tryCatch<Error, GetPermissionsResult>(
    () => content.setPermissions(params),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getType(name: string) : Either<Error, ContentType> {
  return tryCatch<Error, ContentType>(
    () => content.getType(name),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getTypes() : Either<Error, ContentType[]> {
  return tryCatch<Error, ContentType[]>(
    () => content.getTypes(),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}
