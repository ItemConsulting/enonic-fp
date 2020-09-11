import {chain, IOEither, left, right} from "fp-ts/lib/IOEither";
import {pipe} from "fp-ts/lib/pipeable";
import {EmailParams, MailLibrary} from "enonic-types/mail";
import {catchEnonicError, EnonicError, internalServerError} from "./errors";

let mailLib = __non_webpack_require__("/lib/xp/mail");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: MailLibrary) {
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
