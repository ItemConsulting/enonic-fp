import {RecaptchaLibrary} from "enonic-types/lib/recaptcha";
import {pipe} from "fp-ts/lib/pipeable";
import {catchEnonicError} from "./utils";
import {EnonicError} from "./errors";
import {filterOrElse, IOEither} from "fp-ts/lib/IOEither";
import {identity} from "fp-ts/lib/function";
import {Option, some, filter} from "fp-ts/lib/Option";

const recaptchaLib: RecaptchaLibrary = __non_webpack_require__('/lib/recaptcha');

function notEmptyString(str: string): boolean {
  return str.length > 0;
}

export function getSiteKey(): Option<string> {
  return pipe(
    some(recaptchaLib.getSiteKey()),
    filter(notEmptyString)
  );
}

export function getSecretKey(): Option<string> {
  return pipe(
    some(recaptchaLib.getSecretKey()),
    filter(notEmptyString)
  );
}

export function verify(res: string): IOEither<EnonicError, boolean> {
  return pipe(
    catchEnonicError(
      () => recaptchaLib.verify(res)
    ),
    filterOrElse<EnonicError, boolean>(
      identity,
      () => (
        {
          errorKey: "BadRequestError",
          errors: {
            recaptcha: [`Can not confirm that user is not a robot`]
          }
        }
      )
    )
  );
}

export function isConfigured(): boolean {
  return recaptchaLib.isConfigured();
}

