import {BreadcrumbMenu, GetBreadcrumbMenuParams, MenuItem, MenuLibrary} from "enonic-types/menu";
import {Content} from "enonic-types/content";
import {IOEither} from "fp-ts/lib/IOEither";
import {catchEnonicError, EnonicError} from "./errors";

let menuLib = __non_webpack_require__('/lib/menu');

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: MenuLibrary) {
  menuLib = library;
}

export function getBreadcrumbMenu(params: GetBreadcrumbMenuParams): IOEither<EnonicError, BreadcrumbMenu> {
  return catchEnonicError(
    () => menuLib.getBreadcrumbMenu(params)
  );
}

export function getMenuTree(levels: number): IOEither<EnonicError, ReadonlyArray<MenuItem>> {
  return catchEnonicError(
    () => menuLib.getMenuTree(levels)
  );
}

export function getSubMenus(levels: number): (parentContent: Content<any>) =>
  IOEither<EnonicError, ReadonlyArray<MenuItem>> {
  return (parentContent: Content<any>): IOEither<EnonicError, ReadonlyArray<MenuItem>> => catchEnonicError(
    () => menuLib.getSubMenus(parentContent, levels)
  );
}
