import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";

const thymeleaf = __non_webpack_require__("/lib/thymeleaf");

export interface ThymeleafRenderOptions {
  mode: "HTML" | "XML" | "TEXT" | "JAVASCRIPT" | "CSS" | "RAW";
}

export function render<A>(
  view: any,
  model?: A,
  options?: ThymeleafRenderOptions
): IOEither<EnonicError, string> {
  return tryCatch<EnonicError, string>(
    () => thymeleaf.render(view, model, options),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getRenderer<A>(
  view: any,
  options?: ThymeleafRenderOptions
): (model: A) => IOEither<EnonicError, string> {
  return (model: A): IOEither<EnonicError, string> => render(view, model, options);
}
