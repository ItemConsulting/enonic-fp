import { pipe } from "fp-ts/es6/function";
import { filterOrElse, IOEither } from "fp-ts/es6/IOEither";
import { filter, Option, some } from "fp-ts/es6/Option";
import { badRequestError, catchEnonicError, type EnonicError } from "./errors";
import type { VerifyResponse } from "/lib/recaptcha";
import * as recaptchaLib from "/lib/recaptcha";

function notEmptyString(str: string): boolean {
  return str.length > 0;
}

export function getSiteKey(): Option<string> {
  return pipe(some(recaptchaLib.getSiteKey()), filter(notEmptyString));
}

export function getSecretKey(): Option<string> {
  return pipe(some(recaptchaLib.getSecretKey()), filter(notEmptyString));
}

export function verify(res: string): IOEither<EnonicError, VerifyResponse> {
  return pipe(
    catchEnonicError(() => recaptchaLib.verify(res)),
    filterOrElse<EnonicError, VerifyResponse>(
      (res) => res.success, // fails on false
      () => badRequestError
    )
  );
}

export function isConfigured(): boolean {
  return recaptchaLib.isConfigured();
}
