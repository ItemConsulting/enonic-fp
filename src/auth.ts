import {IOEither} from "fp-ts/IOEither";
import {fromNullable, Option} from "fp-ts/Option";
import {
  AuthLibrary,
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
  Role,
  User,
  UserQueryResult, UserWithProfile
} from "enonic-types/auth";
import {catchEnonicError, EnonicError} from "./errors";


let authLib = __non_webpack_require__("/lib/xp/auth");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: AuthLibrary): void {
  authLib = library;
}

/**
 * Login a user through the specified idProvider, with userName and password.
 */
export function login(params: LoginParams): IOEither<EnonicError, LoginResult> {
  return catchEnonicError(
    () => authLib.login(params)
  );
}

/**
 * Logout the currently logged-in user.
 */
export function logout(): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => authLib.logout()
  );
}

/**
 * Changes password for specified user.
 */
export function changePassword(params: ChangePasswordParams): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => authLib.changePassword(params)
  );
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
  return fromNullable(authLib.getUser());
}

/**
 * Returns the profile of a user.
 */
export function getProfile<A>(
  params: GetProfileParams
): IOEither<EnonicError, A> {
  return catchEnonicError(
    () => authLib.getProfile<A>(params)
  );
}

/**
 * This function retrieves the profile of a user and updates it.
 */
export function modifyProfile<A>(
  params: ModifyProfileParams<A>
): IOEither<EnonicError, A> {
  return catchEnonicError(
    () => authLib.modifyProfile<A>(params)
  );
}

/**
 * This function returns the ID provider configuration. It is meant to be called from an ID provider controller.
 */
export function getIdProviderConfig<A>(): Option<A> {
  return fromNullable(authLib.getIdProviderConfig());
}

/*function findUsers2<A>(params: FindUsersParams & { includeProfile: true }): UserQueryResult<UserWithProfile<A>>;
function findUsers2(params: FindUsersParams  & { includeProfile?: false }): UserQueryResult<User>;
function findUsers2<A>(params: FindUsersParams  & { includeProfile?: boolean }): UserQueryResult<UserWithProfile<A> | User> {
  return null;
}*/


/**
 * Search for users matching the specified query.
 */
export function findUsers<A>(params: FindUsersParams & { includeProfile: true }): IOEither<EnonicError, UserQueryResult<UserWithProfile<A>>>;
export function findUsers(params: FindUsersParams  & { includeProfile?: false }): IOEither<EnonicError, UserQueryResult<User>>;
export function findUsers<A>(
  params: FindUsersParams & ({ includeProfile: true } | { includeProfile?: false } )
): IOEither<EnonicError, UserQueryResult<UserWithProfile<A>> | UserQueryResult<User>> {
  return catchEnonicError(
    () => params.includeProfile
       ? authLib.findUsers(params)
       : authLib.findUsers(params)
  );
}

/**
 * Retrieves the user specified and updates it with the changes applied through the editor.
 */
export function modifyUser(
  params: ModifyUserParams
): IOEither<EnonicError, User> {
  return catchEnonicError(
    () => authLib.modifyUser(params)
  );
}

/**
 * Creates a user.
 */
export function createUser(
  params: CreateUserParams
): IOEither<EnonicError, User> {
  return catchEnonicError(
    () => authLib.createUser(params)
  );
}

/**
 * Adds members to a principal (user or role).
 */
export function addMembers(
  principalKey: string,
  members: ReadonlyArray<string>
): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => authLib.addMembers(principalKey, members)
  );
}

/**
 * Removes members from a principal (group or role).
 */
export function removeMembers(
  principalKey: string,
  members: ReadonlyArray<string>
): IOEither<EnonicError, void> {
  return catchEnonicError(
    () => authLib.removeMembers(principalKey, members)
  );
}

/**
 * Deletes the principal with the specifkey.
 */
export function deletePrincipal(principalKey: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(
    () => authLib.deletePrincipal(principalKey)
  );
}

/**
 * Search for principals matching the specified criteria.
 */
export function findPrincipals(params: FindPrincipalsParams): IOEither<EnonicError, FindPrincipalsResult> {
  return catchEnonicError(
    () => authLib.findPrincipals(params)
  );
}

/**
 * Returns the principal with the specified key.
 */
export function getPrincipal(principalKey: string): Option<User> {
  return fromNullable(authLib.getPrincipal(principalKey));
}

/**
 * Creates a role.
 */
export function createRole(
  params: CreateRoleParams
): IOEither<EnonicError, Role> {
  return catchEnonicError(
    () => authLib.createRole(params)
  );
}

/**
 * Checks if the logged-in user has the specified role.
 */
export function hasRole(
  role: string
): IOEither<EnonicError, boolean> {
  return catchEnonicError(
    () => authLib.hasRole(role)
  );
}

/**
 * Retrieves the role specified and updates it with the changes applied through an editor.
 */
export function modifyRole(
  params: ModifyRoleParams
): IOEither<EnonicError, Role> {
  return catchEnonicError(
    () => authLib.modifyRole(params)
  );
}

/**
 * Creates a group.
 */
export function createGroup(
  params: CreateGroupParams
): IOEither<EnonicError, Group> {
  return catchEnonicError(
    () => authLib.createGroup(params)
  );
}

/**
 * Retrieves the group specified and updates it with the changes applied.
 */
export function modifyGroup(
  params: ModifyGroupParams
): IOEither<EnonicError, Group> {
  return catchEnonicError(
    () => authLib.modifyGroup(params)
  );
}

/**
 * Returns a list of principals that are members of the specified principal.
 */
export function getMembers(
  principalKey: string
): IOEither<EnonicError, ReadonlyArray<User>> {
  return catchEnonicError(
    () => authLib.getMembers(principalKey)
  );
}

/**
 * Returns the list of principals which the specified principal is a member of.
 */
export function getMemberships(
  principalKey: string,
  transitive?: boolean
): IOEither<EnonicError, ReadonlyArray<Principal>> {
  return catchEnonicError(
    () => authLib.getMemberships(principalKey, transitive)
  );
}
