import { pipe } from "fp-ts/function";
import { chain, IOEither, left, right } from "fp-ts/IOEither";
import { last, Semigroup } from "fp-ts/Semigroup";
import { fromNullable, isString, stringToByKey } from "./utils";
import {
  AddAttachmentParams,
  Attachments,
  AttachmentStreamParams,
  ByteSource,
  Content,
  ContentLibrary,
  ContentType,
  CreateContentParams,
  CreateMediaParams,
  DeleteContentParams,
  ExistsParams,
  GetChildrenParams,
  GetContentParams,
  GetOutboundDependenciesParams,
  GetPermissionsParams,
  GetPermissionsResult,
  GetSiteConfigParams,
  GetSiteParams,
  ModifyContentParams,
  MoveParams,
  Page,
  PublishContentParams,
  PublishResponse,
  QueryContentParams,
  QueryContentParamsWithSort,
  QueryResponse,
  QueryResponseMetaDataScore,
  QueryResponseMetaDataSort,
  RemoveAttachmentParams,
  SetPermissionsParams,
  Site,
  UnpublishContentParams,
} from "enonic-types/content";
import {
  catchEnonicError,
  EnonicError,
  internalServerError,
  notFoundError,
  publishError,
  unPublishError,
} from "./errors";

let contentLib = __non_webpack_require__("/lib/xp/content");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: ContentLibrary): void {
  contentLib = library;
}

export function get<A extends object>(params: GetContentParams): IOEither<EnonicError, Content<A>>;
export function get<A extends object>(key: string): IOEither<EnonicError, Content<A>>;
export function get<A extends object>(paramsOrKey: GetContentParams | string): IOEither<EnonicError, Content<A>>;
export function get<A extends object>(paramsOrKey: GetContentParams | string): IOEither<EnonicError, Content<A>> {
  return pipe(
    stringToByKey(paramsOrKey),
    (params: GetContentParams) => catchEnonicError(() => contentLib.get<A>(params)),
    chain(fromNullable(notFoundError))
  );
}

export function query<Data extends object, AggregationKeys extends string = never>(
  params: QueryContentParams<AggregationKeys>
): IOEither<EnonicError, QueryResponse<Data, AggregationKeys, QueryResponseMetaDataScore>>;
export function query<Data extends object, AggregationKeys extends string = never>(
  params: QueryContentParamsWithSort<AggregationKeys>
): IOEither<EnonicError, QueryResponse<Data, AggregationKeys, QueryResponseMetaDataSort>>;
export function query<Data extends object, AggregationKeys extends string = never>(
  params: QueryContentParams<AggregationKeys> | QueryContentParamsWithSort<AggregationKeys>
): IOEither<EnonicError, QueryResponse<Data, AggregationKeys, QueryResponseMetaDataScore | QueryResponseMetaDataSort>> {
  return catchEnonicError(() => contentLib.query<Data, AggregationKeys>(params));
}

export function create<A extends object>(params: CreateContentParams<A>): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(() => contentLib.create<A>(params));
}

export function modify<A extends object, PageConfig extends object = object, XData extends object = object>(
  params: ModifyContentParams<A, PageConfig, XData>
): IOEither<EnonicError, Content<A, PageConfig, XData>> {
  return catchEnonicError(() => contentLib.modify<A, PageConfig, XData>(params));
}

/**
 * Require only Content._id and Content.data
 */
type PartialContent<A extends object, PageConfig extends object = object, XData extends object = object> = Partial<
  Content<A, PageConfig, XData>
> &
  Pick<Content<A, PageConfig, XData>, "_id" | "data">;

export interface ConcatContentParams<
  A extends object,
  PageConfig extends object = object,
  XData extends object = object
> {
  readonly semigroup: Semigroup<PartialContent<A, PageConfig, XData>>;
  readonly key?: string;
  readonly requireValid?: boolean;
}

/**
 * Instead of taking an "editor" function like the original `modify()` this `modify()` takes a Semigroup
 * (or Monoid) to combine the old and new content.
 */
export function modifyWithSemigroup<
  A extends object,
  PageConfig extends object = object,
  XData extends object = object
>(
  params: ConcatContentParams<A, PageConfig, XData>
): (newContent: PartialContent<A, PageConfig, XData>) => IOEither<EnonicError, Content<A, PageConfig, XData>> {
  return (newContent: PartialContent<A, PageConfig, XData>): IOEither<EnonicError, Content<A, PageConfig, XData>> => {
    return catchEnonicError(() =>
      contentLib.modify<A, PageConfig, XData>({
        key: params.key ?? newContent._id,
        requireValid: params.requireValid,
        editor: (oldContent: Content<A, PageConfig, XData>) =>
          params.semigroup.concat(oldContent, newContent) as Content<A, PageConfig, XData>,
      })
    );
  };
}

export function getContentSemigroup<A extends object, PageConfig extends object, XData extends object>(
  dataSemigroup: Semigroup<A>,
  pageConfigSemigroup: Semigroup<Page<PageConfig> | undefined> = last(),
  xDataSemigroup: Semigroup<Record<string, Record<string, XData>> | undefined> = last()
): Semigroup<PartialContent<A, PageConfig, XData>> {
  return {
    concat: (
      x: PartialContent<A, PageConfig, XData>,
      y: PartialContent<A, PageConfig, XData>
    ): PartialContent<A, PageConfig, XData> => ({
      _id: x._id,
      _name: x._name,
      _path: x._path,
      creator: y.creator ?? x.creator,
      modifier: y.modifier ?? x.modifier,
      createdTime: y.createdTime ?? x.createdTime,
      modifiedTime: y.modifiedTime ?? x.modifiedTime,
      owner: y.owner ?? x.owner,
      type: y.type ?? x.type,
      displayName: y.displayName ?? x.displayName,
      hasChildren: y.hasChildren ?? x.hasChildren,
      language: y.language ?? x.language,
      valid: y.valid ?? x.valid,
      childOrder: y.childOrder ?? x.childOrder,
      data: dataSemigroup.concat(x.data, y.data),
      x: xDataSemigroup.concat(y.x, x.x),
      page: pageConfigSemigroup.concat(y.page, x.page),
      attachments: y.attachments ?? x.attachments,
      publish: y.publish ?? x.publish,
    }),
  };
}

export function remove(params: DeleteContentParams): IOEither<EnonicError, void>;
export function remove(key: string): IOEither<EnonicError, void>;
export function remove(paramsOrKey: DeleteContentParams | string): IOEither<EnonicError, void> {
  return pipe(
    stringToByKey<DeleteContentParams>(paramsOrKey),
    (params: DeleteContentParams) => catchEnonicError(() => contentLib.delete(params)),
    chain((success: boolean) => (success ? right(undefined) : left(notFoundError)))
  );
}

export function exists(params: ExistsParams): IOEither<EnonicError, boolean>;
export function exists(key: string): IOEither<EnonicError, boolean>;
export function exists(paramsOrKey: ExistsParams | string): IOEither<EnonicError, boolean> {
  return pipe(stringToByKey<ExistsParams>(paramsOrKey), (params: ExistsParams) =>
    catchEnonicError(() => contentLib.exists(params), internalServerError)
  );
}

export function publish(key: string): IOEither<EnonicError, PublishResponse>;
export function publish(content: Content): IOEither<EnonicError, PublishResponse>;
export function publish(params: PublishContentParams): IOEither<EnonicError, PublishResponse>;
export function publish(paramsOrKey: PublishContentParams | Content | string): IOEither<EnonicError, PublishResponse> {
  const params = isString(paramsOrKey)
    ? {
        keys: [paramsOrKey],
        sourceBranch: "draft",
        targetBranch: "master",
      }
    : isContent(paramsOrKey)
    ? {
        keys: [paramsOrKey._id],
        sourceBranch: "draft",
        targetBranch: "master",
      }
    : paramsOrKey;

  return catchEnonicError(() => contentLib.publish(params), publishError);
}

export function unpublish(key: string): IOEither<EnonicError, ReadonlyArray<string>>;
export function unpublish(params: UnpublishContentParams): IOEither<EnonicError, ReadonlyArray<string>>;
export function unpublish(paramsOrKey: UnpublishContentParams | string): IOEither<EnonicError, ReadonlyArray<string>> {
  const params = isString(paramsOrKey) ? { keys: [paramsOrKey] } : paramsOrKey;

  return catchEnonicError(() => contentLib.unpublish(params), unPublishError);
}

export function getChildren<A extends object>(params: GetChildrenParams): IOEither<EnonicError, QueryResponse<A>> {
  return catchEnonicError(() => contentLib.getChildren<A>(params));
}

export function getOutboundDependencies(
  params: GetOutboundDependenciesParams
): IOEither<EnonicError, ReadonlyArray<string>>;
export function getOutboundDependencies(key: string): IOEither<EnonicError, ReadonlyArray<string>>;
export function getOutboundDependencies(
  paramsOrKey: GetOutboundDependenciesParams | string
): IOEither<EnonicError, ReadonlyArray<string>> {
  return pipe(stringToByKey<GetOutboundDependenciesParams>(paramsOrKey), (params: GetOutboundDependenciesParams) =>
    catchEnonicError(() => contentLib.getOutboundDependencies(params))
  );
}

export function move<A extends object>(params: MoveParams): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(() => contentLib.move<A>(params));
}

export function getSite<A extends object, PageConfig extends object = never>(
  params: GetSiteParams
): IOEither<EnonicError, Site<A, PageConfig>>;
export function getSite<A extends object, PageConfig extends object = never>(
  key: string
): IOEither<EnonicError, Site<A, PageConfig>>;
export function getSite<A extends object, PageConfig extends object = never>(
  paramsOrKey: GetSiteParams | string
): IOEither<EnonicError, Site<A, PageConfig>> {
  return pipe(stringToByKey<GetOutboundDependenciesParams>(paramsOrKey), (params: GetOutboundDependenciesParams) =>
    catchEnonicError(() => contentLib.getSite<A, PageConfig>(params))
  );
}

export function getSiteConfig<A extends object>(params: GetSiteConfigParams): IOEither<EnonicError, A> {
  return catchEnonicError(() => contentLib.getSiteConfig<A>(params));
}

export function createMedia<A extends object>(params: CreateMediaParams): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(() => contentLib.createMedia<A>(params));
}

export function addAttachment(params: AddAttachmentParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => contentLib.addAttachment(params));
}

export function getAttachments(key: string): IOEither<EnonicError, Attachments> {
  return pipe(
    catchEnonicError(() => contentLib.getAttachments(key)),
    chain(fromNullable(notFoundError))
  );
}

export function getAttachmentStream(params: AttachmentStreamParams): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(() => contentLib.getAttachmentStream(params)),
    chain(fromNullable(notFoundError))
  );
}

export function removeAttachment(params: RemoveAttachmentParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => contentLib.removeAttachment(params));
}

export function getPermissions(params: GetPermissionsParams): IOEither<EnonicError, GetPermissionsResult> {
  return catchEnonicError(() => contentLib.getPermissions(params));
}

export function setPermissions(params: SetPermissionsParams): IOEither<EnonicError, GetPermissionsResult> {
  return catchEnonicError(() => contentLib.setPermissions(params));
}

export function getType(name: string): IOEither<EnonicError, ContentType> {
  return pipe(
    catchEnonicError(() => contentLib.getType(name)),
    chain(fromNullable(notFoundError))
  );
}

export function getTypes(): IOEither<EnonicError, ReadonlyArray<ContentType>> {
  return catchEnonicError(() => contentLib.getTypes());
}

export function isContent(value: unknown): value is Content {
  const content = value as Content;
  return content._id !== undefined && content.data !== undefined;
}
