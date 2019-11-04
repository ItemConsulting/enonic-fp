import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";
import { catchEnonicError, fromNullable } from "./utils";
import { pipe } from "fp-ts/lib/pipeable";
import { chain } from "fp-ts/es6/IOEither";
import { ByteSource, Content, Site } from "enonic-types/lib/content";
import {
  AssetUrlParams,
  AttachmentUrlParams, ComponentUrlParams,
  IdProviderUrlParams,
  ImagePlaceHolderParams, ImageUrlParams, LoginUrlParams, LogoutUrlParams,
  MultipartItem, PageUrlParams, PortalLibrary, ProcessHtmlParams, ServiceUrlParams, UrlParams
} from "enonic-types/lib/portal";

const portalLib: PortalLibrary = __non_webpack_require__("/lib/xp/portal");

export function getContent<A>(): IOEither<EnonicError, Content<A>> {
  return pipe(
    catchEnonicError(
      () => portalLib.getContent<A>()
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function getIdProviderKey(): IOEither<EnonicError, string> {
  return fromNullable<EnonicError>({
    cause: "Missing id provider in context",
    errorKey: "InternalServerError"
  })(portalLib.getIdProviderKey());
}

/**
 * This function returns a JSON containing multipart items.
 * If not a multipart request, then this function returns `BadRequestError`.
 */
export function getMultipartForm(): IOEither<EnonicError, ReadonlyArray<MultipartItem | ReadonlyArray<MultipartItem>>> {
  return catchEnonicError(
    () => portalLib.getMultipartForm()
  );
}

/**
 * This function returns a JSON containing a named multipart item.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartItem(name: string, index = 0, errorMessage = "portal.error.multipartItem"): IOEither<EnonicError, MultipartItem> {
  return pipe(
    catchEnonicError(
      () => portalLib.getMultipartItem(name, index)
    ),
    chain(fromNullable<EnonicError>({
      errorKey: "BadRequestError",
      errors: {
        [name]: [errorMessage]
      }
    }))
  );
}

/**
 * This function returns a data-stream for a named multipart item.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartStream(name: string, index = 0, errorMessage = "portal.error.multipartItem"): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError<ByteSource | null>(
      () => portalLib.getMultipartStream(name, index)
    ),
    chain(fromNullable<EnonicError>({
      errorKey: "BadRequestError",
      errors: {
        [name]: [errorMessage]
      }
    }))
  );
}

/**
 * This function returns the multipart item data as text.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartText(name: string, index = 0, errorMessage = "portal.error.multipartItem"): IOEither<EnonicError, string> {
  return pipe(
    catchEnonicError<string | null>(
      () => portalLib.getMultipartText(name, index)
    ),
    chain(fromNullable<EnonicError>({
      errorKey: "BadRequestError",
      errors: {
        [name]: [errorMessage]
      }
    }))
  );
}

export function getSite<A>(): IOEither<EnonicError, Site<A>> {
  return catchEnonicError<Site<A>>(
    () => portalLib.getSite()
  );
}

export function getSiteConfig<A>(): IOEither<EnonicError, A> {
  return catchEnonicError<A>(
    () => portalLib.getSiteConfig()
  );
}

export function idProviderUrl(params: IdProviderUrlParams): string {
  return portalLib.idProviderUrl(params);
}

export function imagePlaceholder(params: ImagePlaceHolderParams): string {
  return portalLib.imagePlaceholder(params);
}

export function assetUrl(params: AssetUrlParams): string {
  return portalLib.assetUrl(params);
}

export function attachmentUrl(params: AttachmentUrlParams): string {
  return portalLib.attachmentUrl(params);
}

export function componentUrl(params: ComponentUrlParams): string {
  return portalLib.componentUrl(params);
}

export function serviceUrl(params: ServiceUrlParams): string {
  return portalLib.serviceUrl(params);
}

export function imageUrl(params: ImageUrlParams): string {
  return portalLib.imageUrl(params);
}

export function loginUrl(params: LoginUrlParams): string {
  return portalLib.loginUrl(params);
}

export function logoutUrl(params: LogoutUrlParams): string {
  return portalLib.logoutUrl(params);
}

export function pageUrl(params: PageUrlParams): string {
  return portalLib.pageUrl(params);
}

export function url(params: UrlParams): string {
  return portalLib.url(params);
}

export function processHtml(params: ProcessHtmlParams): string {
  return portalLib.processHtml(params);
}

export function sanitizeHtml(html: string): string {
  return portalLib.sanitizeHtml(html);
}
