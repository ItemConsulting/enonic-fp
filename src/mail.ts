import { chain, IOEither, left, right } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";

const email = __non_webpack_require__("/lib/xp/mail");

export interface EmailAttachment {
  fileName: string;
  data: any;
  mimeType: string;
  headers: { [key: string]: string };
}

export interface EmailParams {
  from: string;
  to: string | Array<string>;
  cc?: string | Array<string>;
  bcc?: string | Array<string>;
  replyTo?: string;
  subject: string;
  body: string;
  contentType?: string;
  headers?: string;
  attachments?: Array<EmailAttachment>;
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
