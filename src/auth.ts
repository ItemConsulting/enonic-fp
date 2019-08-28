import { Either, tryCatch } from "fp-ts/lib/Either";
import { Option, fromNullable } from "fp-ts/lib/Option";
import { Error } from "./common";

const auth = __non_webpack_require__('/lib/xp/auth');

export interface LoginParams {
  user: string
  password: string
  idProvider?: string
  skipAuth?: boolean
  sessionTimeout?: number
}

export interface LoginResult {
  authenticated: boolean,
  user: LoginResultUser
}

export interface LoginResultUser {
  type: string
  key: string
  displayName: string
  disabled: boolean
  email: string
  login: string
  idProvider: string
}

export function login(params: LoginParams) : Either<Error, LoginResult> {
  return tryCatch<Error, LoginResult>(
    () => auth.login(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function logout() : Either<Error, boolean> {
  return tryCatch<Error, boolean>(
    () => {
      auth.logout();
      return true;
    },
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  )
}

export function getUser() : Option<LoginResultUser> {
  return fromNullable(auth.getUser());
}
