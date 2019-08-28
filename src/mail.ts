import * as E from "fp-ts/lib/Either";
import { Error } from "./common";
import {pipe} from "fp-ts/lib/pipeable";

const email = __non_webpack_require__('/lib/xp/mail');

export interface EmailAttachment {
  fileName: string,
  data: any,
  mimeType: string,
  headers: { [key:string]: string }
}

export interface EmailParams {
  from: string,
  to: string|Array<string>,
  cc?: string|Array<string>,
  bcc?: string|Array<string>,
  replyTo?: string,
  subject: string,
  body: string,
  contentType?: string,
  headers?: string,
  attachments?: Array<EmailAttachment>
}

export function send(params: EmailParams) : E.Either<Error, boolean> {
  return pipe(
    E.tryCatch<Error, boolean>(
      () : boolean => email.send(params),
      e => ({
        errorKey: "InternalServerError",
        cause: String(e)
      })
    ),
    E.chain((success) => success
      ? E.right(success)
      : E.left({ errorKey: "InternalServerError" })
    )
  );
}
