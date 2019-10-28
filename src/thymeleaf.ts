import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";

const thymeleaf = __non_webpack_require__("/lib/thymeleaf");

export interface ThymeleafRenderOptions {
  mode: "HTML" | "XML" | "TEXT" | "JAVASCRIPT" | "CSS" | "RAW";
}

export function renderUnsafe<A>(
  view: any,
  model?: A,
  options?: ThymeleafRenderOptions
): string {
  return thymeleaf.render(view, model, options);
}

export function render<A>(
  view: any,
  model?: A,
  options?: ThymeleafRenderOptions
): IOEither<EnonicError, string> {
  return catchEnonicError<string>(
    () => renderUnsafe(view, model, options)
  );
}

export function getUnsafeRenderer<A>(
  view: any,
  options?: ThymeleafRenderOptions
): (model: A) => string {
  return (model: A): string => renderUnsafe(view, model, options);
}

export function getRenderer<A>(
  view: any,
  options?: ThymeleafRenderOptions
): (model: A) => IOEither<EnonicError, string> {
  return (model: A): IOEither<EnonicError, string> => render(view, model, options);
}
