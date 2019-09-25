import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { EnonicError } from "./common";

const auth = __non_webpack_require__("/lib/xp/auth");

export interface LoginParams {
  user: string;
  password: string;
  idProvider?: string;
  skipAuth?: boolean;
  sessionTimeout?: number;
}

export interface LoginResult {
  authenticated: boolean;
  user: LoginResultUser;
}

export interface LoginResultUser {
  type: string;
  key: string;
  displayName: string;
  disabled: boolean;
  email: string;
  login: string;
  idProvider: string;
}

export function login(params: LoginParams): IOEither<EnonicError, LoginResult> {
  return tryCatch<EnonicError, LoginResult>(
    () => auth.login(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function logout(): IOEither<EnonicError, void> {
  return tryCatch<EnonicError, void>(
    () => {
      auth.logout();
      return undefined;
    },
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getUser(): Option<LoginResultUser> {
  return fromNullable(auth.getUser());
}
