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

export function render(view: any, options?: ThymeleafRenderOptions): (model: any) => Either<Error, string> {
  return (model: any) => tryCatch<Error, string>(
    () => thymeleaf.render(view, model, options),
    (e) => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}
