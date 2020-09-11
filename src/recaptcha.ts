import {pipe} from "fp-ts/lib/pipeable";
import {filterOrElse, IOEither} from "fp-ts/lib/IOEither";
import {identity} from "fp-ts/lib/function";
import {filter, Option, some} from "fp-ts/lib/Option";
import {badRequestError, catchEnonicError, EnonicError} from "./errors";
import {RecaptchaLibrary} from "enonic-types/recaptcha";

let recaptchaLib = __non_webpack_require__('/lib/recaptcha');

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: RecaptchaLibrary) {
  recaptchaLib = library;
}

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
      identity, // fails on false
      () => badRequestError
    )
  );
}

export function isConfigured(): boolean {
  return recaptchaLib.isConfigured();
}

