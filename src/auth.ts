import { IOEither } from "fp-ts/lib/IOEither";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";
import {
  AuthLibrary, CreateGroupParams, CreateRoleParams, CreateUserParams,
  FindUsersParams, Group,
  LoginParams,
  LoginResult,
  ModifyUserParams, Principal, Role,
  User,
  UserQueryResult
} from "enonic-types/lib/auth";

const auth: AuthLibrary = __non_webpack_require__("/lib/xp/auth");

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
