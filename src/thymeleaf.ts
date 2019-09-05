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

export function render(view: any, model?: any, options?: ThymeleafRenderOptions) : Either<Error, string> {
  return tryCatch<Error, string>(
    () => thymeleaf.render(view, model, options),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}
