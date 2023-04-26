import { chain, IOEither } from "fp-ts/es6/IOEither";
import { fromNullable as optionFromNullable, Option } from "fp-ts/es6/Option";
import type {
  ChangePasswordParams,
  CreateGroupParams,
  CreateRoleParams,
  CreateUserParams,
  FindPrincipalsParams,
  FindPrincipalsResult,
  FindUsersParams,
  GetProfileParams,
  Group,
  LoginParams,
  LoginResult,
  ModifyGroupParams,
  ModifyProfileParams,
  ModifyRoleParams,
  ModifyUserParams,
  Principal,
  PrincipalKey,
  GroupKey,
  RoleKey,
  UserKey,
  Role,
  User,
  UserWithProfile,
} from "/lib/xp/auth";
import { fromNullable } from "./utils";
import { catchEnonicError, type EnonicError, notFoundError } from "./errors";
import * as authLib from "/lib/xp/auth";
import { pipe } from "fp-ts/es6/function";

/**
 * Login a user through the specified idProvider, with userName and password.
 */
export function login(params: LoginParams): IOEither<EnonicError, LoginResult> {
  return catchEnonicError(() => authLib.login(params));
}

/**
 * Logout the currently logged-in user.
 */
export function logout(): IOEither<EnonicError, void> {
  return catchEnonicError(() => authLib.logout());
}

/**
 * Changes password for specified user.
 */
export function changePassword(params: ChangePasswordParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => authLib.changePassword(params));
}

/**
 * Generates a random secure password that may be suggested to a user.
 */
export function generatePassword(): string {
  return authLib.generatePassword();
}

/**
 * Returns the logged-in user. If not logged-in, this will return undefined or null.
 */
export function getUser(): Option<User> {
  return optionFromNullable(authLib.getUser());
}

/**
 * Returns the profile of a user.
 */
export function getProfile<A extends Record<string, unknown>>(params: GetProfileParams): IOEither<EnonicError, A> {
  return pipe(
    catchEnonicError(() => authLib.getProfile<A>(params)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * This function retrieves the profile of a user and updates it.
 */
export function modifyProfile<Profile extends Record<string, unknown>>(
  params: ModifyProfileParams<Profile>
): IOEither<EnonicError, Profile> {
  return pipe(
    catchEnonicError(() => authLib.modifyProfile<Profile>(params)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * This function returns the ID provider configuration. It is meant to be called from an ID provider controller.
 */
export function getIdProviderConfig<
  IdProviderConfig extends Record<string, unknown> = Record<string, unknown>
>(): Option<IdProviderConfig> {
  return optionFromNullable(authLib.getIdProviderConfig<IdProviderConfig>());
}

/**
 * Search for users matching the specified query.
 */
export function findUsers<A extends Record<string, unknown> = Record<string, unknown>>(
  params: FindUsersParams & { includeProfile: true }
): IOEither<EnonicError, FindPrincipalsResult<UserWithProfile<A>>>;
export function findUsers(
  params: FindUsersParams & { includeProfile?: false }
): IOEither<EnonicError, FindPrincipalsResult<User>>;
export function findUsers<A extends Record<string, unknown> = Record<string, unknown>>(
  params: FindUsersParams & ({ includeProfile: true } | { includeProfile?: false })
): IOEither<EnonicError, FindPrincipalsResult<UserWithProfile<A>> | FindPrincipalsResult<User>> {
  return catchEnonicError(() => (params.includeProfile ? authLib.findUsers(params) : authLib.findUsers(params)));
}

/**
 * Retrieves the user specified and updates it with the changes applied through the editor.
 */
export function modifyUser(params: ModifyUserParams): IOEither<EnonicError, User> {
  return pipe(
    catchEnonicError(() => authLib.modifyUser(params)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * Creates a user.
 */
export function createUser(params: CreateUserParams): IOEither<EnonicError, User> {
  return catchEnonicError(() => authLib.createUser(params));
}

/**
 * Adds members to a principal (user or role).
 */
export function addMembers(
  principalKey: RoleKey | GroupKey,
  members: Array<GroupKey | UserKey>
): IOEither<EnonicError, void> {
  return catchEnonicError(() => authLib.addMembers(principalKey, members));
}

/**
 * Removes members from a principal (group or role).
 */
export function removeMembers(
  principalKey: RoleKey | GroupKey,
  members: Array<GroupKey | UserKey>
): IOEither<EnonicError, void> {
  return catchEnonicError(() => authLib.removeMembers(principalKey, members));
}

/**
 * Deletes the principal with the specifkey.
 */
export function deletePrincipal(principalKey: PrincipalKey): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => authLib.deletePrincipal(principalKey));
}

/**
 * Search for principals matching the specified criteria.
 */
export function findPrincipals(params: FindPrincipalsParams): IOEither<EnonicError, FindPrincipalsResult> {
  return catchEnonicError(() => authLib.findPrincipals(params));
}

/**
 * Returns the principal with the specified key.
 */
export function getPrincipal(principalKey: UserKey): Option<Principal> {
  return optionFromNullable(authLib.getPrincipal(principalKey));
}

/**
 * Creates a role.
 */
export function createRole(params: CreateRoleParams): IOEither<EnonicError, Role> {
  return catchEnonicError(() => authLib.createRole(params));
}

/**
 * Checks if the logged-in user has the specified role.
 */
export function hasRole(role: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => authLib.hasRole(role));
}

/**
 * Retrieves the role specified and updates it with the changes applied through an editor.
 */
export function modifyRole(params: ModifyRoleParams): IOEither<EnonicError, Role> {
  return pipe(
    catchEnonicError(() => authLib.modifyRole(params)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * Creates a group.
 */
export function createGroup(params: CreateGroupParams): IOEither<EnonicError, Group> {
  return catchEnonicError(() => authLib.createGroup(params));
}

/**
 * Retrieves the group specified and updates it with the changes applied.
 */
export function modifyGroup(params: ModifyGroupParams): IOEither<EnonicError, Group> {
  return pipe(
    catchEnonicError(() => authLib.modifyGroup(params)),
    chain(fromNullable(notFoundError))
  );
}

/**
 * Returns a list of principals that are members of the specified principal.
 */
export function getMembers(principalKey: RoleKey | GroupKey): IOEither<EnonicError, ReadonlyArray<User | Group>> {
  return catchEnonicError(() => authLib.getMembers(principalKey));
}

/**
 * Returns the list of principals which the specified principal is a member of.
 */
export function getMemberships(
  principalKey: UserKey | GroupKey,
  transitive?: boolean
): IOEither<EnonicError, ReadonlyArray<Principal>> {
  return catchEnonicError(() => authLib.getMemberships(principalKey, transitive));
}
