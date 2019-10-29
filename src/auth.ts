import { IOEither } from "fp-ts/lib/IOEither";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";

const auth = __non_webpack_require__("/lib/xp/auth");

export interface LoginParams {
  readonly user: string;
  readonly password?: string;
  readonly idProvider?: string;
  readonly skipAuth?: boolean;
  readonly sessionTimeout?: number;
}

export interface LoginResult {
  readonly authenticated: boolean;
  readonly user: User;
}

export interface Principal {
  readonly type: string;
  readonly key: string;
  readonly displayName: string;
  readonly modifiedTime: string;
}

export interface User extends Principal {
  readonly disabled: boolean;
  readonly email: string;
  readonly login: string;
  readonly idProvider: string;
}

export interface WithProfile<A> {
  readonly profile?: A;
}

export interface Role extends Principal {
  readonly description?: string;
}

export interface Group extends Principal {
  readonly description?: string;
}

export interface FindUsersParams {
  readonly start?: number;
  readonly count: number;
  readonly query: string;
  readonly sort?: string;
  readonly includeProfile?: boolean;
}

export interface UserQueryResult<A> {
  readonly total: number;
  readonly count: number;
  readonly hits: ReadonlyArray<User & WithProfile<A>>;
}

export interface ModifyUserParams {
  readonly key: string;
  readonly editor: (c: User) => User;
}

export interface CreateUserParams {
  readonly idProvider: string;
  readonly name: string;
  readonly displayName: string;
  readonly email?: string;
}

export interface CreateRoleParams {
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
}

export interface CreateGroupParams {
  readonly idProvider: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
}

export function login(params: LoginParams): IOEither<EnonicError, LoginResult> {
  return catchEnonicError<LoginResult>(
    () => auth.login(params)
  );
}

export function logout(): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.logout()
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
  return catchEnonicError<UserQueryResult<A>>(
    () => auth.findUsers(params)
  );
}

export function modifyUser(
  params: ModifyUserParams
): IOEither<EnonicError, User> {
  return catchEnonicError<User>(
    () => auth.modifyUser(params)
  );
}

export function createUser(
  params: CreateUserParams
): IOEither<EnonicError, User> {
  return catchEnonicError<User>(
    () => auth.createUser(params)
  );
}

export function addMembers(
  principalKey: string,
  members: ReadonlyArray<string>
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.addMembers(principalKey, members)
  );
}

export function removeMembers(
  principalKey: string,
  members: ReadonlyArray<string>
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.removeMembers(principalKey, members)
  );
}

export function getPrincipal(principalKey: string): Option<User> {
  return fromNullable(auth.getPrincipal(principalKey));
}

export function createRole(
  params: CreateRoleParams
): IOEither<EnonicError, Role> {
  return catchEnonicError<Role>(
    () => auth.createRole(params)
  );
}

export function createGroup(
  params: CreateGroupParams
): IOEither<EnonicError, Group> {
  return catchEnonicError<Group>(
    () => auth.createGroup(params)
  );
}

export function getMemberships(
  principalKey: string,
  transitive?: boolean
): IOEither<EnonicError, ReadonlyArray<Principal>> {
  return catchEnonicError<ReadonlyArray<Principal>>(
    () => auth.getMemberships(principalKey, transitive)
  );
}
