import { chain, IOEither, left, right } from "fp-ts/IOEither";
import { pipe } from "fp-ts/function";
import type { EmailParams } from "enonic-types/mail";
import { catchEnonicError, EnonicError, internalServerError } from "./errors";
import * as mailLib from "/lib/xp/mail";

export function send(params: EmailParams): IOEither<EnonicError, void> {
  return pipe(
    catchEnonicError(() => mailLib.send(params)),
    chain((success: boolean) => (success ? right(undefined) : left(internalServerError)))
  );
}
