import {chain, IOEither, left, right} from "fp-ts/lib/IOEither";
import {pipe} from "fp-ts/lib/pipeable";
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
