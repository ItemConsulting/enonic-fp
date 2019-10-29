import { chain, IOEither, left, right } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";
import { ByteSource } from "./content";

const email = __non_webpack_require__("/lib/xp/mail");

export interface EmailAttachment {
  readonly fileName: string;
  readonly data: ByteSource;
  readonly mimeType: string;
  readonly headers: { [key: string]: string };
}

export interface EmailParams {
  readonly from: string;
  readonly to: string | ReadonlyArray<string>;
  readonly cc?: string | ReadonlyArray<string>;
  readonly bcc?: string | ReadonlyArray<string>;
  readonly replyTo?: string;
  readonly subject: string;
  readonly body: string;
  readonly contentType?: string;
  readonly headers?: string;
  readonly attachments?: ReadonlyArray<EmailAttachment>;
}

export function send(params: EmailParams): IOEither<EnonicError, void> {
  return pipe(
    catchEnonicError<boolean>(
      () => email.send(params),
    ),
    chain((success: boolean) =>
      success
        ? right(undefined)
        : left({ errorKey: "InternalServerError" })
    )
  );
}
