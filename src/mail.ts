import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import { Error } from "./common";

const email = __non_webpack_require__("/lib/xp/mail");

export interface EmailAttachment {
  fileName: string;
  data: any;
  mimeType: string;
  headers: { [key: string]: string };
}

export interface EmailParams {
  from: string;
  to: string|Array<string>;
  cc?: string|Array<string>;
  bcc?: string|Array<string>;
  replyTo?: string;
  subject: string;
  body: string;
  contentType?: string;
  headers?: string;
  attachments?: Array<EmailAttachment>;
}

export function send(params: EmailParams): E.Either<Error, void> {
  return pipe(
    E.tryCatch<Error, boolean>(
      (): boolean => email.send(params),
      (e) => ({
        cause: String(e),
        errorKey: "InternalServerError"
      })
    ),
    E.chain((success: boolean) => success
      ? E.right(undefined)
      : E.left({ errorKey: "InternalServerError" })
    )
  );
}
