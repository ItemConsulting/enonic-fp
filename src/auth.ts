import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { EnonicError } from "./common";

const auth = __non_webpack_require__("/lib/xp/auth");

export interface LoginParams {
  user: string;
  password?: string; // don't need password if skipAuth = true
  idProvider?: string;
  skipAuth?: boolean;
  sessionTimeout?: number;
}

export interface LoginResult {
  authenticated: boolean;
  user: User;
}

export interface Principal {
  type: string;
  key: string;
  displayName: string;
  modifiedTime: string;
}

export interface User extends Principal {
  disabled: boolean;
  email: string;
  login: string;
  idProvider: string;
}

export interface WithProfile<A> {
  profile?: A;
}

export interface Role extends Principal {
  description?: string;
}

export interface Group extends Principal {
  description?: string;
}

export interface FindUsersParams {
  start?: number;
  count: number;
  query: string;
  sort?: string;
  includeProfile?: boolean;
}

export interface UserQueryResult<A> {
  total: number;
  count: number;
  hits: Array<User & WithProfile<A>>;
}

export interface ModifyUserParams {
  key: string;
  editor: (c: User) => User;
}

export interface CreateUserParams {
  idProvider: string;
  name: string;
  displayName: string;
  email?: string;
}

export interface CreateRoleParams {
  name: string;
  displayName: string;
  description?: string;
}

export interface CreateGroupParams {
  idProvider: string;
  name: string;
  displayName: string;
  description: string;
}

export function login(params: LoginParams): IOEither<EnonicError, LoginResult> {
  return tryCatch<EnonicError, LoginResult>(
    () => auth.login(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function logout(): IOEither<EnonicError, void> {
  return tryCatch<EnonicError, void>(
    () => auth.logout(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getUser(): Option<User> {
  return fromNullable(auth.getUser());
}

export function getIdProviderConfig<A>(): Option<A> {
  return fromNullable(auth.getIdProviderConfig());
}

export function findUsers<A>(
  params: FindUsersParams
): IOEither<EnonicError, UserQueryResult<A>> {
  return tryCatch<EnonicError, UserQueryResult<A>>(
    () => auth.findUsers(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function modifyUser(
  params: ModifyUserParams
): IOEither<EnonicError, User> {
  return tryCatch<EnonicError, User>(
    () => auth.modifyUser(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function createUser(
  params: CreateUserParams
): IOEither<EnonicError, User> {
  return tryCatch<EnonicError, User>(
    () => auth.createUser(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function addMembers(
  principalKey: string,
  members: Array<string>
): IOEither<EnonicError, void> {
  return tryCatch<EnonicError, void>(
    () => auth.addMembers(principalKey, members),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function removeMembers(
  principalKey: string,
  members: Array<string>
): IOEither<EnonicError, void> {
  return tryCatch<EnonicError, void>(
    () => auth.removeMembers(principalKey, members),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getPrincipal(principalKey: string): Option<User> {
  return fromNullable(auth.getPrincipal(principalKey));
}

export function createRole(
  params: CreateRoleParams
): IOEither<EnonicError, Role> {
  return tryCatch<EnonicError, Role>(
    () => auth.createRole(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function createGroup(
  params: CreateGroupParams
): IOEither<EnonicError, Group> {
  return tryCatch<EnonicError, Group>(
    () => auth.createGroup(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function getMemberships(
  principalKey: string,
  transitive?: boolean
): IOEither<EnonicError, Array<Principal>> {
  return tryCatch<EnonicError, Array<Principal>>(
    () => auth.getMemberships(principalKey, transitive),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}
