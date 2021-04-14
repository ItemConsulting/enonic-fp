import {chain, IOEither, left, right} from "fp-ts/IOEither";
import {pipe} from "fp-ts/function";
import {EmailParams, MailLibrary} from "enonic-types/mail";
import {catchEnonicError, EnonicError, internalServerError} from "./errors";

let mailLib = __non_webpack_require__("/lib/xp/mail");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: MailLibrary): void {
  mailLib = library;
}

export function send(params: EmailParams): IOEither<EnonicError, void> {
  return pipe(
    catchEnonicError(
      () => mailLib.send(params),
    ),
    chain((success: boolean) =>
      success
        ? right(undefined)
        : left(internalServerError)
    )
  );
}
