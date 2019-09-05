import {Either, tryCatch} from "fp-ts/lib/Either";
import {Error} from "./common";

const thymeleaf = __non_webpack_require__('/lib/thymeleaf');

export interface ThymeleafRenderOptions {
  mode: 'HTML'
    | 'XML'
    | 'TEXT'
    | 'JAVASCRIPT'
    | 'CSS'
    | 'RAW'
}

export function render<A>(view: any, model?: A, options?: ThymeleafRenderOptions) : Either<Error, string> {
  return tryCatch<Error, string>(
    () => thymeleaf.render(view, model, options),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function getRenderer<A>(view: any, options?: ThymeleafRenderOptions): (model: A) => Either<Error, string> {
  return (model: A) => render(view, model, options);
}
