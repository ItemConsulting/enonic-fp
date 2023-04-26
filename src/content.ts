import { pipe } from "fp-ts/es6/function";
import { chain, IOEither, left, right } from "fp-ts/es6/IOEither";
import { last, Semigroup } from "fp-ts/es6/Semigroup";
import { fromNullable, isString, stringToByKey } from "./utils";
import type {
  ByteSource,
  Content,
  ContentType,
  CreateContentParams,
  CreateMediaParams,
  DeleteContentParams,
  GetContentParams,
  GetOutboundDependenciesParams,
  GetPermissionsParams,
  GetSiteConfigParams,
  GetSiteParams,
  ModifyContentParams,
  PublishContentParams,
  QueryContentParams,
  RemoveAttachmentParams,
  SetPermissionsParams,
  Site,
  UnpublishContentParams,
  AddAttachmentParam,
  ContentExistsParams,
  ContentsResult,
  GetAttachmentStreamParams,
  GetChildContentParams,
  MoveContentParams,
  Permissions,
  PublishContentResult,
} from "/lib/xp/content";
import {
  catchEnonicError,
  EnonicError,
  internalServerError,
  notFoundError,
  publishError,
  unPublishError,
} from "./errors";
import * as contentLib from "/lib/xp/content";
import { Aggregations, AggregationsResult, AggregationsToAggregationResults } from "@enonic-types/core";

export function get<Hit extends Content<unknown> = Content>(params: GetContentParams): IOEither<EnonicError, Hit>;
export function get<Hit extends Content<unknown> = Content>(key: string): IOEither<EnonicError, Hit>;
export function get<Hit extends Content<unknown> = Content>(
  paramsOrKey: GetContentParams | string
): IOEither<EnonicError, Hit>;
export function get<Hit extends Content<unknown> = Content>(
  paramsOrKey: GetContentParams | string
): IOEither<EnonicError, Hit> {
  return pipe(
    stringToByKey(paramsOrKey),
    (params: GetContentParams) => catchEnonicError(() => contentLib.get<Hit>(params)),
    chain(fromNullable(notFoundError))
  );
}

export function query<Hit extends Content<unknown> = Content, AggregationInput extends Aggregations = never>(
  params: QueryContentParams<AggregationInput>
): IOEither<EnonicError, ContentsResult<Hit, AggregationsToAggregationResults<AggregationInput>>> {
  return catchEnonicError(() => contentLib.query<Hit, AggregationInput>(params));
}

export function create<Data = Record<string, unknown>, Type extends string = string>(
  params: CreateContentParams<Data, Type>
): IOEither<EnonicError, Content<Data, Type>> {
  return catchEnonicError(() => contentLib.create<Data, Type>(params));
}

export function modify<Data = Record<string, unknown>, Type extends string = string>(
  params: ModifyContentParams<Data, Type>
): IOEither<EnonicError, Content<Data, Type>> {
  return pipe(
    catchEnonicError(() => contentLib.modify<Data, Type>(params)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * Require only Content._id and Content.data
 */
type PartialContent<Data, Type extends string = string> = Partial<Content<Data, Type>> &
  Pick<Content<Data, Type>, "_id" | "data">;

export interface ConcatContentParams<Data, Type extends string = string> {
  readonly semigroup: Semigroup<PartialContent<Data, Type>>;
  readonly key?: string;
  readonly requireValid?: boolean;
}

/**
 * Instead of taking an "editor" function like the original `modify()` this `modify()` takes a Semigroup
 * (or Monoid) to combine the old and new content.
 */
export function modifyWithSemigroup<Data, Type extends string>(
  params: ConcatContentParams<Data, Type>
): (newContent: PartialContent<Data, Type>) => IOEither<EnonicError, Content<Data, Type>> {
  return (newContent: PartialContent<Data, Type>): IOEither<EnonicError, Content<Data, Type>> => {
    return pipe(
      catchEnonicError(() => {
        return contentLib.modify<Data, Type>({
          key: params.key ?? newContent._id,
          requireValid: params.requireValid,
          editor: (oldContent: Content<Data, Type>) =>
            params.semigroup.concat(oldContent, newContent) as Content<Data, Type>,
        });
      }),
      chain(fromNullable(notFoundError))
    );
  };
}

export function getContentSemigroup<Data, Type extends string = string>(
  dataSemigroup: Semigroup<Data>,
  pageConfigSemigroup: Semigroup<Content["page"] | undefined> = last(),
  xDataSemigroup: Semigroup<Content["x"] | undefined> = last()
): Semigroup<PartialContent<Data, Type>> {
  return {
    concat: (x: PartialContent<Data, Type>, y: PartialContent<Data, Type>): PartialContent<Data, Type> => ({
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

export function exists(params: ContentExistsParams): IOEither<EnonicError, boolean>;
export function exists(key: string): IOEither<EnonicError, boolean>;
export function exists(paramsOrKey: ContentExistsParams | string): IOEither<EnonicError, boolean> {
  return pipe(stringToByKey<ContentExistsParams>(paramsOrKey), (params: ContentExistsParams) =>
    catchEnonicError(() => contentLib.exists(params), internalServerError)
  );
}

export function publish(key: string): IOEither<EnonicError, PublishContentResult>;
export function publish(content: Content): IOEither<EnonicError, PublishContentResult>;
export function publish(params: PublishContentParams): IOEither<EnonicError, PublishContentResult>;
export function publish(
  paramsOrKey: PublishContentParams | Content | string
): IOEither<EnonicError, PublishContentResult> {
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

export function getChildren<
  Hit extends Content<unknown> = Content,
  AggregationOutput extends Record<string, AggregationsResult> = never
>(params: GetChildContentParams): IOEither<EnonicError, ContentsResult<Hit, AggregationOutput>> {
  return catchEnonicError(() => contentLib.getChildren<Hit, AggregationOutput>(params));
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

export function move<Data = Record<string, unknown>, Type extends string = string>(
  params: MoveContentParams
): IOEither<EnonicError, Content<Data, Type>> {
  return catchEnonicError(() => contentLib.move<Data, Type>(params));
}

export function getSite<Config = Record<string, unknown>>(params: GetSiteParams): IOEither<EnonicError, Site<Config>>;
export function getSite<Config = Record<string, unknown>>(key: string): IOEither<EnonicError, Site<Config>>;
export function getSite<Config = Record<string, unknown>>(
  paramsOrKey: GetSiteParams | string
): IOEither<EnonicError, Site<Config>> {
  return pipe(
    stringToByKey<GetSiteParams>(paramsOrKey),
    (params: GetSiteParams) => catchEnonicError(() => contentLib.getSite<Config>(params)),
    chain(fromNullable(notFoundError))
  );
}

export function getSiteConfig<Config = Record<string, unknown>>(
  params: GetSiteConfigParams
): IOEither<EnonicError, Config> {
  return pipe(
    catchEnonicError(() => contentLib.getSiteConfig<Config>(params)),
    chain(fromNullable(notFoundError))
  );
}

export function createMedia<A extends object>(params: CreateMediaParams): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(() => contentLib.createMedia<A>(params));
}

export function addAttachment(params: AddAttachmentParam): IOEither<EnonicError, void> {
  return catchEnonicError(() => contentLib.addAttachment(params));
}

export function getAttachments(key: string): IOEither<EnonicError, Content["attachments"]> {
  return pipe(
    catchEnonicError(() => contentLib.getAttachments(key)),
    chain(fromNullable(notFoundError))
  );
}

export function getAttachmentStream(params: GetAttachmentStreamParams): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(() => contentLib.getAttachmentStream(params)),
    chain(fromNullable(notFoundError))
  );
}

export function removeAttachment(params: RemoveAttachmentParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => contentLib.removeAttachment(params));
}

export function getPermissions(params: GetPermissionsParams): IOEither<EnonicError, Permissions> {
  return pipe(
    catchEnonicError(() => contentLib.getPermissions(params)),
    chain(fromNullable(notFoundError))
  );
}

export function setPermissions(params: SetPermissionsParams): IOEither<EnonicError, boolean> {
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
