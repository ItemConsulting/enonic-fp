import {BreadcrumbMenu, GetBreadcrumbMenuParams, MenuItem, MenuLibrary} from "enonic-types/lib/menu";
import {Content} from "enonic-types/lib/content";
import {catchEnonicError} from "./utils";
import {IOEither} from "fp-ts/lib/IOEither";
import {EnonicError} from "./errors";

const menuLib: MenuLibrary = __non_webpack_require__('/lib/menu');

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
