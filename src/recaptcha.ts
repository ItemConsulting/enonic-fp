import { pipe } from "fp-ts/function";
import { filterOrElse, IOEither } from "fp-ts/IOEither";
import { filter, Option, some } from "fp-ts/Option";
import { badRequestError, catchEnonicError, EnonicError } from "./errors";
import type { VerifyResponse } from "enonic-types/recaptcha";
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
