import type {
  BreadcrumbMenu,
  GetBreadcrumbMenuParams,
  GetMenuParams,
  GetMenuTreeParams,
  MenuItem,
  MenuTree,
} from "enonic-types/menu";
import type { Content, Site } from "enonic-types/content";
import { IOEither } from "fp-ts/IOEither";
import { catchEnonicError, EnonicError } from "./errors";
import * as menuLib from "/lib/menu";

export function getBreadcrumbMenu(params: GetBreadcrumbMenuParams): IOEither<EnonicError, BreadcrumbMenu> {
  return catchEnonicError(() => menuLib.getBreadcrumbMenu(params));
}

export function getMenuTree(levels: number, params?: GetMenuTreeParams): IOEither<EnonicError, MenuTree> {
  return catchEnonicError(() => menuLib.getMenuTree(levels, params));
}

export function getSubMenus(
  levels?: number,
  params?: GetMenuParams
): (parentContent: Content) => IOEither<EnonicError, ReadonlyArray<MenuItem>> {
  return (parentContent: Content<any> | Site<any>): IOEither<EnonicError, ReadonlyArray<MenuItem>> =>
    catchEnonicError(() => menuLib.getSubMenus(parentContent, levels, params));
}
