import {pipe} from "fp-ts/lib/pipeable";
import {chain, IOEither, left, right} from "fp-ts/lib/IOEither";
import {Semigroup} from "fp-ts/lib/Semigroup";
import {EnonicError} from "./errors";
import {catchEnonicError, fromNullable} from "./utils";
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
  PublishContentParams,
  PublishResponse,
  QueryContentParams,
  QueryResponse,
  RemoveAttachmentParams,
  SetPermissionsParams,
  Site,
  UnpublishContentParams
} from "enonic-types/lib/content";

const contentLib: ContentLibrary = __non_webpack_require__("/lib/xp/content");

export function get<A extends object>(
  params: GetContentParams
): IOEither<EnonicError, Content<A>> {
  return pipe(
    catchEnonicError(
      () => contentLib.get<A>(params)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function query<A extends object>(
  params: QueryContentParams
): IOEither<EnonicError, QueryResponse<A>> {
  return catchEnonicError(
    () => contentLib.query<A>(params)
  );
}

export function create<A extends object>(
  params: CreateContentParams<A>
): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(
    () => contentLib.create<A>(params)
  );
}

export function modify<A extends object>(
  params: ModifyContentParams<A>
): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(
    () => contentLib.modify<A>(params)
  );
}

type PartialContent<A extends object> = Partial<Content<A>> & Pick<Content<A>, '_id' | 'data'>

export interface ConcatContentParams<A extends object> {
  readonly semigroup: Semigroup<PartialContent<A>>;
  readonly key?: string;
  readonly requireValid?: boolean;
}

/**
 * Instead of taking an "editor" function like the original `modify()` this `modify()` takes a Semigroup
 * (or Monoid) to combine the old and new content.
 */
export function modifyWithSemigroup<A extends object>(
  params: ConcatContentParams<A>
): (newContent: PartialContent<A>) => IOEither<EnonicError, Content<A>> {
  return (newContent: PartialContent<A>): IOEither<EnonicError, Content<A>> => {
    return catchEnonicError(
      () => contentLib.modify<A>({
        key: params.key ?? newContent._id,
        requireValid: params.requireValid,
        editor: (oldContent: Content<A>) => params.semigroup.concat(oldContent, newContent) as Content<A>
      })
    );
  };
}

export function getContentSemigroup<A extends object>(dataMonoid: Semigroup<A>): Semigroup<PartialContent<A>> {
  return {
    concat: (x: PartialContent<A>, y: PartialContent<A>): PartialContent<A> => (
      {
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
        data: dataMonoid.concat(x.data, y.data),
        x: y.x ?? x.x,
        page: y.page ?? x.page,
        attachments: y.attachments ?? x.attachments,
        publish: y.publish ?? x.publish,
      }
    )
  }
}

export function remove(
  params: DeleteContentParams
): IOEither<EnonicError, void> {
  return pipe(
     catchEnonicError<boolean>(
      () => contentLib.delete(params),
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

export function exists(
  params: ExistsParams
): IOEither<EnonicError, boolean> {
  return catchEnonicError(
    () => contentLib.exists(params),
    "InternalServerError"
  );
}

export function publish(
  params: PublishContentParams
): IOEither<EnonicError, PublishResponse> {
  return catchEnonicError(
    () => contentLib.publish(params),
    "PublishError"
  );
}

export function unpublish(
  params: UnpublishContentParams
): IOEither<EnonicError, ReadonlyArray<string>> {
  return catchEnonicError(
    () => contentLib.unpublish(params),
    "PublishError"
  );
}

export function getChildren<A extends object>(
  params: GetChildrenParams
): IOEither<EnonicError, QueryResponse<A>> {
  return catchEnonicError(
    () => contentLib.getChildren<A>(params)
  );
}

export function getOutboundDependencies(
  params: GetOutboundDependenciesParams
): IOEither<EnonicError, ReadonlyArray<string>> {
  return catchEnonicError(
    () => contentLib.getOutboundDependencies(params)
  );
}

export function move<A extends object>(params: MoveParams): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(
    () => contentLib.move<A>(params)
  );
}

export function getSite<A extends object, PageConfig extends object = never>(
  params: GetSiteParams
): IOEither<EnonicError, Site<A, PageConfig>> {
  return catchEnonicError(
    () => contentLib.getSite<A, PageConfig>(params)
  );
}

export function getSiteConfig<A extends object>(
  params: GetSiteConfigParams
): IOEither<EnonicError, A> {
  return catchEnonicError(
    () => contentLib.getSiteConfig<A>(params)
  );
}

export function createMedia<A extends object>(
  params: CreateMediaParams
): IOEither<EnonicError, Content<A>> {
  return catchEnonicError(
    () => contentLib.createMedia<A>(params)
  );
}

export function addAttachment(
  params: AddAttachmentParams
): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => contentLib.addAttachment(params)
  );
}

export function getAttachments(
  key: string
): IOEither<EnonicError, Attachments> {
  return pipe(
    catchEnonicError(
      () => contentLib.getAttachments(key)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function getAttachmentStream(
  params: AttachmentStreamParams
): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(
      () => contentLib.getAttachmentStream(params)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function removeAttachment(
  params: RemoveAttachmentParams
): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => contentLib.removeAttachment(params)
  );
}

export function getPermissions(
  params: GetPermissionsParams
): IOEither<EnonicError, GetPermissionsResult> {
  return catchEnonicError(
    () => contentLib.getPermissions(params)
  );
}

export function setPermissions(
  params: SetPermissionsParams
): IOEither<EnonicError, GetPermissionsResult> {
  return catchEnonicError(
    () => contentLib.setPermissions(params)
  );
}

export function getType(name: string): IOEither<EnonicError, ContentType> {
  return pipe(
    catchEnonicError(
      () => contentLib.getType(name)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function getTypes(): IOEither<EnonicError, ReadonlyArray<ContentType>> {
  return catchEnonicError(
    () => contentLib.getTypes()
  );
}
