import {IOEither} from "fp-ts/lib/IOEither";
import {ResourceKey, ThymeleafLibrary, ThymeleafRenderOptions} from "enonic-types/thymeleaf";
import {catchEnonicError, EnonicError} from "./errors";

let thymeleafLib = __non_webpack_require__("/lib/thymeleaf");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: ThymeleafLibrary) {
  thymeleafLib = library;
}

export function renderUnsafe<A extends object>(
  view: ResourceKey,
  model?: A,
  options?: ThymeleafRenderOptions
): string {
  return thymeleafLib.render(view, model, options);
}

export function render<A extends object>(
  view: ResourceKey,
  model?: A,
  options?: ThymeleafRenderOptions
): IOEither<EnonicError, string> {
  return catchEnonicError(
    () => renderUnsafe(view, model, options)
  );
}

export function getUnsafeRenderer<A extends object>(
  view: ResourceKey,
  options?: ThymeleafRenderOptions
): (model: A) => string {
  return (model: A): string => renderUnsafe(view, model, options);
}

export function getRenderer<A extends object>(
  view: ResourceKey,
  options?: ThymeleafRenderOptions
): (model: A) => IOEither<EnonicError, string> {
  return (model: A): IOEither<EnonicError, string> => render(view, model, options);
}
