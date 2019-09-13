import { Either, tryCatch } from "fp-ts/lib/Either";
import { Error } from "./common";
const context = __non_webpack_require__("/lib/xp/context");

export interface Context {
  repository: string;
  branch: string;
  authInfo: AuthInfo;
}

interface AuthInfo {
  user: User;
}

interface User {
  type: string;
  key: string;
  displayName: string;
  disabled: boolean;
  email: string;
  login: string;
  idProvider: string;
}

export function get(): Either<Error, Context> {
  return tryCatch(
    () => context.get(),
    (e) => ({
      cause: String(e),
      errorKey: "InternalServerError"
    })
  );
}

interface RunContext {
  repository?: string;
  branch?: string;
  user?: {
    login: string
    idProvider?: string
  };
  principals?: Array<string>;
  attributes?: { [key: string]: string|boolean|number };
}

export function run<T>(runContext: RunContext, f: () => T): T {
  return context.run(runContext, f);
}
