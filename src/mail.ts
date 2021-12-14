import { chain, IOEither, left, right } from "fp-ts/es6/IOEither";
import { pipe } from "fp-ts/es6/function";
import type { EmailParams } from "/lib/xp/mail";
import { catchEnonicError, EnonicError, internalServerError } from "./errors";
import * as mailLib from "/lib/xp/mail";

export function send(params: EmailParams): IOEither<EnonicError, void> {
  return pipe(
    catchEnonicError(() => mailLib.send(params)),
    chain((success: boolean) => (success ? right(undefined) : left(internalServerError)))
  );
}
