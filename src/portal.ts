import { chain, IOEither } from "fp-ts/es6/IOEither";
import { catchEnonicError, type EnonicError, missingIdProviderError, notFoundError } from "./errors";
import { fromNullable, isString, stringToById, stringToByPath } from "./utils";
import { pipe } from "fp-ts/es6/function";
import type { ByteSource, Content, Site } from "/lib/xp/content";
import type {
  AssetUrlParams,
  AttachmentUrlParams,
  Component,
  ComponentUrlParams,
  IdProviderUrlParams,
  ImagePlaceHolderParams,
  ImageUrlParams,
  LoginUrlParams,
  LogoutUrlParams,
  MultipartItem,
  PageUrlParams,
  ProcessHtmlParams,
  ServiceUrlParams,
  UrlParams,
} from "/lib/xp/portal";
import * as portalLib from "/lib/xp/portal";

export function getContent<A extends object, PageConfig extends object = never>(): IOEither<
  EnonicError,
  Content<A, PageConfig>
> {
  return pipe(
    catchEnonicError(() => portalLib.getContent<A, PageConfig>()),
    chain(fromNullable(notFoundError))
  );
}

export function getComponent<Config extends object = never>(): IOEither<EnonicError, Component<Config>> {
  return pipe(
    catchEnonicError(() => portalLib.getComponent<Config>()),
    chain(fromNullable(notFoundError))
  );
}

export function getIdProviderKey(): IOEither<EnonicError, string> {
  return fromNullable(missingIdProviderError)(portalLib.getIdProviderKey());
}

/**
 * This function returns a JSON containing multipart items.
 * If not a multipart request, then this function returns `BadRequestError`.
 */
export function getMultipartForm(): IOEither<
  EnonicError,
  Record<string, MultipartItem | ReadonlyArray<MultipartItem>>
> {
  return catchEnonicError(() => portalLib.getMultipartForm());
}

/**
 * This function returns a JSON containing a named multipart item.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartItem(name: string, index = 0): IOEither<EnonicError, MultipartItem | undefined> {
  return catchEnonicError(() => portalLib.getMultipartItem(name, index));
}

/**
 * This function returns a data-stream for a named multipart item.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartStream(name: string, index = 0): IOEither<EnonicError, ByteSource | undefined> {
  return catchEnonicError(() => portalLib.getMultipartStream(name, index));
}

/**
 * This function returns the multipart item data as text.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartText(name: string, index = 0): IOEither<EnonicError, string | undefined> {
  return catchEnonicError(() => portalLib.getMultipartText(name, index));
}

export function getSite<A extends object>(): IOEither<EnonicError, Site<A>> {
  return catchEnonicError(() => portalLib.getSite<A>());
}

export function getSiteConfig<A extends object>(): IOEither<EnonicError, A> {
  return catchEnonicError(() => portalLib.getSiteConfig<A>());
}

export function idProviderUrl(params: IdProviderUrlParams): string {
  return portalLib.idProviderUrl(params);
}

export function imagePlaceholder(params: ImagePlaceHolderParams): string {
  return portalLib.imagePlaceholder(params);
}

export function assetUrl(params: AssetUrlParams): string;
export function assetUrl(path: string): string;
export function assetUrl(paramsOrPath: AssetUrlParams | string): string {
  return pipe(stringToByPath(paramsOrPath), portalLib.assetUrl);
}

export function attachmentUrl(params: AttachmentUrlParams): string;
export function attachmentUrl(id: string): string;
export function attachmentUrl(paramsOrId: AttachmentUrlParams | string): string {
  return pipe(stringToById<AttachmentUrlParams>(paramsOrId), portalLib.attachmentUrl);
}

export function componentUrl(params: ComponentUrlParams): string;
export function componentUrl(id: string): string;
export function componentUrl(paramsOrId: ComponentUrlParams | string): string {
  return pipe(stringToById<ComponentUrlParams>(paramsOrId), portalLib.componentUrl);
}

export function serviceUrl(params: ServiceUrlParams): string;
export function serviceUrl(serviceKey: string): string;
export function serviceUrl(paramsOrServiceKey: ServiceUrlParams | string): string {
  return pipe(
    isString(paramsOrServiceKey) ? { service: paramsOrServiceKey } : paramsOrServiceKey,
    portalLib.serviceUrl
  );
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

export function pageUrl(params: PageUrlParams): string;
export function pageUrl(id: string): string;
export function pageUrl(paramsOrId: PageUrlParams | string): string {
  return pipe(stringToById<PageUrlParams>(paramsOrId), portalLib.pageUrl);
}

export function url(params: UrlParams): string {
  return portalLib.url(params);
}

export function processHtml(params: ProcessHtmlParams): string;
export function processHtml(value: string): string;
export function processHtml(paramsOrValue: ProcessHtmlParams | string): string {
  return pipe(isString(paramsOrValue) ? { value: paramsOrValue } : paramsOrValue, portalLib.processHtml);
}

export function sanitizeHtml(html: string): string {
  return portalLib.sanitizeHtml(html);
}
