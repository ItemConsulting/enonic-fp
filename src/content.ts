import { chain, IOEither, left, right } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { fromNullable } from "./utils";
import { catchEnonicError } from "./utils";

const content = __non_webpack_require__("/lib/xp/content");

export interface Content<A> {
  readonly _id: string;
  readonly _name: string;
  readonly _path: string;
  readonly creator: string;
  readonly modifier: string;
  readonly createdTime: string;
  readonly modifiedTime: string;
  readonly owner: string;
  readonly type: string;
  readonly displayName: string;
  readonly hasChildren: boolean;
  readonly language: string;
  readonly valid: boolean;
  readonly childOrder: string;
  readonly data: A;
  readonly x: { readonly [key: string]: string };
  readonly page: any;
  readonly attachments: Attachments;
  readonly publish: any;
}

export interface Attachment {
  readonly name: string;
  readonly label?: string;
  readonly size: number;
  readonly mimeType: string;
}

export interface Attachments {
  readonly [key: string]: Attachment;
}

export interface QueryContentParams {
  readonly start?: number;
  readonly count: number;
  readonly query: string;
  readonly filters?: object;
  readonly sort?: string;
  readonly aggregations?: string;
  readonly contentTypes?: ReadonlyArray<string>;
}

export interface QueryResponse<A> {
  readonly aggregations: object;
  readonly count: number;
  readonly hits: ReadonlyArray<Content<A>>;
  readonly total: number;
}

export interface GetContentParams {
  readonly key: string;
}

export interface DeleteContentParams {
  readonly key: string;
}

export interface CreateContentParams<A> {
  readonly name: string;
  readonly parentPath: string;
  readonly displayName?: string;
  readonly requireValid?: boolean;
  readonly refresh?: boolean;
  readonly contentType: string;
  readonly language?: string;
  readonly childOrder?: string;
  readonly data: A;
  readonly x?: string;
}

export interface ModifyContentParams<A> {
  readonly key: string;
  readonly editor: (c: Content<A>) => Content<A>;
  readonly requireValid?: boolean;
}

export interface PublishContentParams {
  readonly keys: ReadonlyArray<string>;
  readonly sourceBranch: string;
  readonly targetBranch: string;
  readonly schedule?: ScheduleParams;
  readonly excludeChildrenIds?: ReadonlyArray<string>;
  readonly includeDependencies?: boolean;
}

export interface ScheduleParams {
  readonly from: string;
  readonly to: string;
}

export interface PublishResponse {
  readonly pushedContents: ReadonlyArray<string>;
  readonly deletedContents: ReadonlyArray<string>;
  readonly failedContents: ReadonlyArray<string>;
}

export interface UnpublishContentParams {
  readonly keys: ReadonlyArray<string>;
}

export interface GetChildrenParams {
  readonly key: string;
  readonly start?: number;
  readonly count?: number;
  readonly sort?: string;
}

export interface MoveParams {
  readonly source: string;
  readonly target: string;
}

export interface GetSiteParams {
  readonly key: string;
}

export interface Site<A> {
  readonly _id: string;
  readonly _name: string;
  readonly _path: string;
  readonly type: string;
  readonly hasChildren: boolean;
  readonly valid: boolean;
  readonly data: {
    readonly siteConfig: SiteConfig<A>;
  };
  readonly x: { readonly [key: string]: string };
  readonly page: any;
  readonly attachments: object;
  readonly publish: any;
}

export interface SiteConfig<A> {
  readonly applicationKey: string;
  readonly config: A;
}

export interface GetSiteConfigParams {
  readonly key: string;
  readonly applicationKey: string;
}

export interface AttachmentStreamParams {
  readonly key: string;
  readonly name: string;
}

export interface RemoveAttachmentParams {
  readonly key: string;
  readonly name: string | ReadonlyArray<string>;
}

export interface CreateMediaParams {
  readonly name?: string;
  readonly parentPath?: string;
  readonly mimeType?: string;
  readonly focalX?: number;
  readonly focalY?: number;
  readonly data: any; // stream
}

export interface GetPermissionsParams {
  readonly key: string;
}

export interface GetPermissionsResult {
  readonly inheritsPermissions: boolean;
  readonly permissions: ReadonlyArray<PermissionsParams>;
}

export interface PermissionsParams {
  readonly principal: string;
  readonly allow: ReadonlyArray<string>;
  readonly deny: ReadonlyArray<string>;
}

export interface SetPermissionsParams {
  readonly key: string;
  readonly inheritPermissions: boolean;
  readonly overwriteChildPermissions: boolean;
  readonly permissions: ReadonlyArray<PermissionsParams>;
}

export interface IconType {
  readonly data?: any;
  readonly mimeType?: string;
  readonly modifiedTime?: string;
}

export interface ContentType {
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly superType: string;
  readonly abstract: boolean;
  readonly final: boolean;
  readonly allowChildContent: boolean;
  readonly displayNameExpression: string;
  readonly icon: ReadonlyArray<IconType>;
  readonly form: ReadonlyArray<any>;
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
): IOEither<EnonicError, ReadonlyArray<string>> {
  return catchEnonicError<ReadonlyArray<string>>(
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

export function getTypes(): IOEither<EnonicError, ReadonlyArray<ContentType>> {
  return catchEnonicError<ReadonlyArray<ContentType>>(
    () => content.getTypes()
  );
}
