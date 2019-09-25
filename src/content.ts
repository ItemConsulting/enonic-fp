import { chain, IOEither, left, right, tryCatch } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { fromNullable } from "./utils";
const content = __non_webpack_require__("/lib/xp/content");

export interface Content<T> {
  _id: string;
  _name: string;
  _path: string;
  creator: string;
  modifier: string;
  createdTime: string;
  modifiedTime: string;
  owner: string;
  type: string;
  displayName: string;
  hasChildren: boolean;
  language: string;
  valid: boolean;
  childOrder: string;
  data: T;
  x: { [key: string]: string };
  page: any;
  attachments: Attachments;
  publish: any;
}

export interface Attachment {
  name: string;
  label?: string;
  size: number;
  mimeType: string;
}

export interface Attachments {
  [key: string]: Attachment;
}

export interface QueryContentParams {
  start?: number;
  count: number;
  query: string;
  filters?: object;
  sort?: string;
  aggregations?: string;
  contentTypes?: Array<string>;
}

export interface QueryResponse<T> {
  aggregations: object;
  count: number;
  hits: Array<Content<T>>;
  total: number;
}

export interface GetContentParams {
  key: string;
}

export interface DeleteContentParams {
  key: string;
}

export interface CreateContentParams<T> {
  name: string;
  parentPath: string;
  displayName?: string;
  requireValid?: boolean;
  refresh?: boolean;
  contentType: string;
  language?: string;
  childOrder?: string;
  data: T;
  x?: string;
}

export interface ModifyContentParams<T> {
  key: string;
  editor: (c: Content<T>) => Content<T>;
  requireValid?: boolean;
}

export interface PublishContentParams {
  keys: Array<string>;
  sourceBranch: string;
  targetBranch: string;
  schedule?: ScheduleParams;
  excludeChildrenIds?: Array<string>;
  includeDependencies?: boolean;
}

export interface ScheduleParams {
  from: string;
  to: string;
}

export interface PublishResponse {
  pushedContents: Array<string>;
  deletedContents: Array<string>;
  failedContents: Array<string>;
}

export interface UnpublishContentParams {
  keys: Array<string>;
}

export interface GetChildrenParams {
  key: string;
  start?: number;
  count?: number;
  sort?: string;
}

export interface MoveParams {
  source: string;
  target: string;
}

export interface GetSiteParams {
  key: string;
}

export interface Site<T> {
  _id: string;
  _name: string;
  _path: string;
  type: string;
  hasChildren: boolean;
  valid: boolean;
  data: {
    siteConfig: SiteConfig<T>;
  };
  x: { [key: string]: string };
  page: any;
  attachments: object;
  publish: any;
}

export interface SiteConfig<T> {
  applicationKey: string;
  config: T;
}

export interface GetSiteConfigParams {
  key: string;
  applicationKey: string;
}

export interface AttachmentStreamParams {
  key: string;
  name: string;
}

export interface RemoveAttachmentParams {
  key: string;
  name: string | Array<string>;
}

export interface CreateMediaParams {
  name?: string;
  parentPath?: string;
  mimeType?: string;
  focalX?: number;
  focalY?: number;
  data: any; // stream
}

export interface GetPermissionsParams {
  key: string;
}

export interface GetPermissionsResult {
  inheritsPermissions: boolean;
  permissions: Array<PermissionsParams>;
}

export interface PermissionsParams {
  principal: string;
  allow: Array<string>;
  deny: Array<string>;
}

export interface SetPermissionsParams {
  key: string;
  inheritPermissions: boolean;
  overwriteChildPermissions: boolean;
  permissions: Array<PermissionsParams>;
}

export interface IconType {
  data?: any;
  mimeType?: string;
  modifiedTime?: string;
}

export interface ContentType {
  name: string;
  displayName: string;
  description: string;
  superType: string;
  abstract: boolean;
  final: boolean;
  allowChildContent: boolean;
  displayNameExpression: string;
  icon: Array<IconType>;
  form: Array<any>;
}

export function get<T>(
  params: GetContentParams
): IOEither<EnonicError, Content<T>> {
  return pipe(
    tryCatch<EnonicError, Content<T>>(
      () => content.get(params),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function query<T>(
  params: QueryContentParams
): IOEither<EnonicError, QueryResponse<T>> {
  return tryCatch(
    () => content.query(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function create<T>(
  params: CreateContentParams<T>
): IOEither<EnonicError, Content<T>> {
  return tryCatch(
    () => content.create(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function modify<T>(
  params: ModifyContentParams<T>
): IOEither<EnonicError, Content<T>> {
  return tryCatch(
    () => content.modify(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function remove(
  params: DeleteContentParams
): IOEither<EnonicError, void> {
  return pipe(
    tryCatch<EnonicError, boolean>(
      (): boolean => content.delete(params),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain((success: boolean) =>
      success ? right(undefined) : left({ errorKey: "NotFoundError" })
    )
  );
}

export function publish(
  params: PublishContentParams
): IOEither<EnonicError, PublishResponse> {
  return tryCatch<EnonicError, PublishResponse>(
    () => content.publish(params),
    e => ({ errorKey: "PublishError", cause: String(e) })
  );
}

export function unpublish(
  params: UnpublishContentParams
): IOEither<EnonicError, Array<string>> {
  return tryCatch<EnonicError, Array<string>>(
    () => content.unpublish(params),
    e => ({ errorKey: "PublishError", cause: String(e) })
  );
}

export function getChildren<T>(
  params: GetChildrenParams
): IOEither<EnonicError, QueryResponse<T>> {
  return tryCatch<EnonicError, QueryResponse<T>>(
    () => content.getChildren(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function move<T>(params: MoveParams): IOEither<EnonicError, Content<T>> {
  return tryCatch<EnonicError, Content<T>>(
    () => content.move(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getSite<T>(
  params: GetSiteParams
): IOEither<EnonicError, Site<T>> {
  return tryCatch<EnonicError, Site<T>>(
    () => content.getSite(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getSiteConfig<T>(
  params: GetSiteConfigParams
): IOEither<EnonicError, T> {
  return tryCatch<EnonicError, T>(
    () => content.getSiteConfig(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function createMedia<T>(
  params: CreateMediaParams
): IOEither<EnonicError, Content<T>> {
  return tryCatch<EnonicError, Content<T>>(
    () => content.createMedia(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getAttachments(
  key: string
): IOEither<EnonicError, Attachments> {
  return pipe(
    tryCatch<EnonicError, Attachments>(
      () => content.getAttachments(key),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

// The return type is Java: com.google.common.io.ByteSource
export function getAttachmentStream(
  params: AttachmentStreamParams
): IOEither<EnonicError, any> {
  return pipe(
    tryCatch<EnonicError, any>(
      () => content.getAttachmentStream(params),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function removeAttachment(
  params: RemoveAttachmentParams
): IOEither<EnonicError, void> {
  return tryCatch<EnonicError, void>(
    () => content.removeAttachment(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getPermissions(
  params: GetPermissionsParams
): IOEither<EnonicError, GetPermissionsResult> {
  return tryCatch<EnonicError, GetPermissionsResult>(
    () => content.getPermissions(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function setPermissions(
  params: SetPermissionsParams
): IOEither<EnonicError, GetPermissionsResult> {
  return tryCatch<EnonicError, GetPermissionsResult>(
    () => content.setPermissions(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getType(name: string): IOEither<EnonicError, ContentType> {
  return tryCatch<EnonicError, ContentType>(
    () => content.getType(name),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getTypes(): IOEither<EnonicError, Array<ContentType>> {
  return tryCatch<EnonicError, Array<ContentType>>(
    () => content.getTypes(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}
