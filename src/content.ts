import { chain, IOEither, left, right } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { fromNullable } from "./utils";
import { catchEnonicError } from "./utils";

const content = __non_webpack_require__("/lib/xp/content");

export interface Content<A> {
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
  data: A;
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

export interface QueryResponse<A> {
  aggregations: object;
  count: number;
  hits: Array<Content<A>>;
  total: number;
}

export interface GetContentParams {
  key: string;
}

export interface DeleteContentParams {
  key: string;
}

export interface CreateContentParams<A> {
  name: string;
  parentPath: string;
  displayName?: string;
  requireValid?: boolean;
  refresh?: boolean;
  contentType: string;
  language?: string;
  childOrder?: string;
  data: A;
  x?: string;
}

export interface ModifyContentParams<A> {
  key: string;
  editor: (c: Content<A>) => Content<A>;
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

export interface Site<A> {
  _id: string;
  _name: string;
  _path: string;
  type: string;
  hasChildren: boolean;
  valid: boolean;
  data: {
    siteConfig: SiteConfig<A>;
  };
  x: { [key: string]: string };
  page: any;
  attachments: object;
  publish: any;
}

export interface SiteConfig<A> {
  applicationKey: string;
  config: A;
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

export function get<A>(
  params: GetContentParams
): IOEither<EnonicError, Content<A>> {
  return pipe(
    catchEnonicError<Content<A>>(
      () => content.get(params)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function query<A>(
  params: QueryContentParams
): IOEither<EnonicError, QueryResponse<A>> {
  return catchEnonicError< QueryResponse<A>>(
    () => content.query(params)
  );
}

export function create<A>(
  params: CreateContentParams<A>
): IOEither<EnonicError, Content<A>> {
  return catchEnonicError<Content<A>>(
    () => content.create(params)
  );
}

export function modify<A>(
  params: ModifyContentParams<A>
): IOEither<EnonicError, Content<A>> {
  return catchEnonicError<Content<A>>(
    () => content.modify(params)
  );
}

export function remove(
  params: DeleteContentParams
): IOEither<EnonicError, void> {
  return pipe(
     catchEnonicError<boolean>(
      () => content.delete(params),
    ),
    chain((success: boolean) =>
      success
        ? right(undefined)
        : left({
          errorKey: "NotFoundError"
        })
    )
  );
}

export function publish(
  params: PublishContentParams
): IOEither<EnonicError, PublishResponse> {
  return catchEnonicError<PublishResponse>(
    () => content.publish(params),
    "PublishError"
  );
}

export function unpublish(
  params: UnpublishContentParams
): IOEither<EnonicError, Array<string>> {
  return catchEnonicError<Array<string>>(
    () => content.unpublish(params),
    "PublishError"
  );
}

export function getChildren<A>(
  params: GetChildrenParams
): IOEither<EnonicError, QueryResponse<A>> {
  return catchEnonicError<QueryResponse<A>>(
    () => content.getChildren(params)
  );
}

export function move<A>(params: MoveParams): IOEither<EnonicError, Content<A>> {
  return catchEnonicError<Content<A>>(
    () => content.move(params)
  );
}

export function getSite<A>(
  params: GetSiteParams
): IOEither<EnonicError, Site<A>> {
  return catchEnonicError<Site<A>>(
    () => content.getSite(params)
  );
}

export function getSiteConfig<A>(
  params: GetSiteConfigParams
): IOEither<EnonicError, A> {
  return catchEnonicError<A>(
    () => content.getSiteConfig(params)
  );
}

export function createMedia<A>(
  params: CreateMediaParams
): IOEither<EnonicError, Content<A>> {
  return catchEnonicError<Content<A>>(
    () => content.createMedia(params)
  );
}

export function getAttachments(
  key: string
): IOEither<EnonicError, Attachments> {
  return pipe(
    catchEnonicError<Attachments>(
      () => content.getAttachments(key)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

// The return type is Java: com.google.common.io.ByteSource
export function getAttachmentStream(
  params: AttachmentStreamParams
): IOEither<EnonicError, any> {
  return pipe(
    catchEnonicError<any>(
      () => content.getAttachmentStream(params)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function removeAttachment(
  params: RemoveAttachmentParams
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => content.removeAttachment(params)
  );
}

export function getPermissions(
  params: GetPermissionsParams
): IOEither<EnonicError, GetPermissionsResult> {
  return catchEnonicError<GetPermissionsResult>(
    () => content.getPermissions(params)
  );
}

export function setPermissions(
  params: SetPermissionsParams
): IOEither<EnonicError, GetPermissionsResult> {
  return catchEnonicError<GetPermissionsResult>(
    () => content.setPermissions(params)
  );
}

export function getType(name: string): IOEither<EnonicError, ContentType> {
  return catchEnonicError<ContentType>(
    () => content.getType(name)
  );
}

export function getTypes(): IOEither<EnonicError, Array<ContentType>> {
  return catchEnonicError<Array<ContentType>>(
    () => content.getTypes()
  );
}
