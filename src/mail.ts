import {chain, IOEither, left, right} from "fp-ts/lib/IOEither";
import {pipe} from "fp-ts/lib/pipeable";
import {EnonicError} from "./errors";
import {catchEnonicError} from "./utils";
import {EmailParams} from "enonic-types/lib/mail";

const mailLib = __non_webpack_require__("/lib/xp/mail");

export function send(params: EmailParams): IOEither<EnonicError, void> {
  return pipe(
    catchEnonicError<boolean>(
      () => mailLib.send(params),
    ),
    chain((success: boolean) =>
      success
        ? right(undefined)
        : left({errorKey: "InternalServerError"})
    )
  );
}
