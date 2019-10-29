import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";
import { ByteSource, Content, Site } from "./content";
import { catchEnonicError, fromNullable } from "./utils";
import { pipe } from "fp-ts/lib/pipeable";
import { chain } from "fp-ts/es6/IOEither";

const portal = __non_webpack_require__("/lib/xp/portal");

export interface IdProviderUrlParams {
  readonly idProvider?: string;
  readonly contextPath?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface ImagePlaceHolderParams {
  readonly width: number;
  readonly height: number;
}

export interface AssetUrlParams {
  readonly path: string;
  readonly application?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface AttachmentUrlParams {
  readonly id?: string;
  readonly path?: string;
  readonly name?: string;
  readonly label?: string; // source
  readonly download?: boolean;
  readonly params?: { readonly [key: string]: string };
  readonly type?: "server" | "absolute";
}

export interface ComponentUrlParams {
  readonly id?: string;
  readonly path?: string;
  readonly component?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface ImageUrlParams {
  readonly id?: string;
  readonly path?: string;
  readonly scale: string;
  readonly quality?: number;
  readonly background?: string;
  readonly format?: string;
  readonly filter?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface PageUrlParams {
  readonly id?: string;
  readonly path?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface LoginUrlParams {
  readonly idProvider?: string;
  readonly redirect?: string;
  readonly contextPath?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface LogoutUrlParams {
  readonly redirect?: string;
  readonly contextPath?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface ServiceUrlParams {
  readonly service: string;
  readonly application?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface UrlParams {
  readonly path?: string;
  readonly type?: "server" | "absolute";
  readonly params?: { readonly [key: string]: string };
}

export interface ProcessHtmlParams {
  readonly value: string;
  readonly type?: "server" | "absolute";
}

export function getContent<A>(): IOEither<EnonicError, Content<A>> {
  return catchEnonicError<Content<A>>(
    () => portal.getContent()
  );
}

export function getIdProviderKey(): IOEither<EnonicError, string> {
  return fromNullable<EnonicError>({
    cause: "Missing id provider in context",
    errorKey: "InternalServerError"
  })(portal.getIdProviderKey());
}

export interface MultipartItem {
  readonly name: string;
  readonly fileName: string;
  readonly contentType: string;
  readonly size: number;
}

/**
 * This function returns a JSON containing multipart items.
 * If not a multipart request, then this function returns `BadRequestError`.
 */
export function getMultipartForm(): IOEither<EnonicError, ReadonlyArray<MultipartItem | ReadonlyArray<MultipartItem>>> {
  return catchEnonicError<ReadonlyArray<MultipartItem | ReadonlyArray<MultipartItem>>>(
    () => portal.getMultipartForm()
  );
}

/**
 * This function returns a JSON containing a named multipart item.
 * If the item does not exist it returns `BadRequestError`.
 */
export function getMultipartItem(name: string, index = 0, errorMessage = "portal.error.multipartItem"): IOEither<EnonicError, MultipartItem> {
  return pipe(
    catchEnonicError<MultipartItem | null>(
      () => portal.getMultipartItem(name, index)
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
      () => portal.getMultipartStream(name, index)
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
      () => portal.getMultipartText(name, index)
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
    () => portal.getSite()
  );
}

export function getSiteConfig<A>(): IOEither<EnonicError, A> {
  return catchEnonicError<A>(
    () => portal.getSiteConfig()
  );
}

export function idProviderUrl(params: IdProviderUrlParams): string {
  return portal.idProviderUrl(params);
}

export function imagePlaceholder(params: ImagePlaceHolderParams): string {
  return portal.imagePlaceholder(params);
}

export function assetUrl(params: AssetUrlParams): string {
  return portal.assetUrl(params);
}

export function attachmentUrl(params: AttachmentUrlParams): string {
  return portal.attachmentUrl(params);
}

export function componentUrl(params: ComponentUrlParams): string {
  return portal.componentUrl(params);
}

export function serviceUrl(params: ServiceUrlParams): string {
  return portal.serviceUrl(params);
}

export function imageUrl(params: ImageUrlParams): string {
  return portal.imageUrl(params);
}

export function loginUrl(params: LoginUrlParams): string {
  return portal.loginUrl(params);
}

export function logoutUrl(params: LogoutUrlParams): string {
  return portal.imageUrl(params);
}

export function pageUrl(params: PageUrlParams): string {
  return portal.pageUrl(params);
}

export function url(params: UrlParams): string {
  return portal.url(params);
}

export function processHtml(params: ProcessHtmlParams): string {
  return portal.processHtml(params);
}

export function sanitizeHtml(html: string): string {
  return portal.processHtml(html);
}
