import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";
import { Content, Site } from "./content";
import { fromNullable } from "./utils";

const portal = __non_webpack_require__("/lib/xp/portal");

export interface IdProviderUrlParams {
  idProvider?: string;
  contextPath?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface ImagePlaceHolderParams {
  width: number;
  height: number;
}

export interface AssetUrlParams {
  path: string;
  application?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface AttachmentUrlParams {
  id?: string;
  path?: string;
  name?: string;
  label?: string; // source
  download?: boolean;
  params?: { [key: string]: string };
  type?: "server" | "absolute";
}

export interface ComponentUrlParams {
  id?: string;
  path?: string;
  component?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface ImageUrlParams {
  id?: string;
  path?: string;
  scale: string;
  quality?: number;
  background?: string;
  format?: string;
  filter?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface PageUrlParams {
  id?: string;
  path?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface LoginUrlParams {
  idProvider?: string;
  redirect?: string;
  contextPath?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface LogoutUrlParams {
  redirect?: string;
  contextPath?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface ServiceUrlParams {
  service: string;
  application?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface UrlParams {
  path?: string;
  type?: "server" | "absolute";
  params?: { [key: string]: string };
}

export interface ProcessHtmlParams {
  value: string;
  type?: "server" | "absolute";
}

export function getContent<A>(): IOEither<EnonicError, Content<A>> {
  return tryCatch<EnonicError, Content<A>>(
    () => portal.getContent(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getIdProviderKey(): IOEither<EnonicError, string> {
  return fromNullable<EnonicError>({
    cause: "Missing id provider in context",
    errorKey: "InternalServerError"
  })(portal.getIdProviderKey());
}

export function getSite<A>(): IOEither<EnonicError, Site<A>> {
  return tryCatch<EnonicError, Site<A>>(
    () => portal.getSite(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getSiteConfig<A>(): IOEither<EnonicError, A> {
  return tryCatch<EnonicError, A>(
    () => portal.getSiteConfig(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
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
