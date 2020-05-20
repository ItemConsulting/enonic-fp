import {IOEither} from "fp-ts/lib/IOEither";
import {fromNullable, Option} from "fp-ts/lib/Option";
import {EnonicError} from "./errors";
import {catchEnonicError} from "./utils";
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
  UserQueryResult
} from "enonic-types/lib/auth";


const auth: AuthLibrary = __non_webpack_require__("/lib/xp/auth");

/**
 * Login a user through the specified idProvider, with userName and password.
 */
export function login(params: LoginParams): IOEither<EnonicError, LoginResult> {
  return catchEnonicError<LoginResult>(
    () => auth.login(params)
  );
}

/**
 * Logout the currently logged-in user.
 */
export function logout(): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.logout()
  );
}

/**
 * Changes password for specified user.
 */
export function changePassword(params: ChangePasswordParams): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.changePassword(params)
  );
}

/**
 * Generates a random secure password that may be suggested to a user.
 */
export function generatePassword(): string{
  return auth.generatePassword();
}

/**
 * Returns the logged-in user. If not logged-in, this will return undefined or null.
 */
export function getUser(): Option<User> {
  return fromNullable(auth.getUser());
}

/**
 * Returns the profile of a user.
 */
export function getProfile<A>(
  params: GetProfileParams
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.getProfile<A>(params)
  );
}

/**
 * This function retrieves the profile of a user and updates it.
 */
export function modifyProfile<A>(
  params: ModifyProfileParams<A>
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.modifyProfile<A>(params)
  );
}

/**
 * This function returns the ID provider configuration. It is meant to be called from an ID provider controller.
 */
export function getIdProviderConfig<A>(): Option<A> {
  return fromNullable(auth.getIdProviderConfig());
}

/**
 * Search for users matching the specified query.
 */
export function findUsers<A>(
  params: FindUsersParams
): IOEither<EnonicError, UserQueryResult<A>> {
  return catchEnonicError<UserQueryResult<A>>(
    () => auth.findUsers(params)
  );
}

/**
 * Retrieves the user specified and updates it with the changes applied through the editor.
 */
export function modifyUser(
  params: ModifyUserParams
): IOEither<EnonicError, User> {
  return catchEnonicError<User>(
    () => auth.modifyUser(params)
  );
}

/**
 * Creates a user.
 */
export function createUser(
  params: CreateUserParams
): IOEither<EnonicError, User> {
  return catchEnonicError<User>(
    () => auth.createUser(params)
  );
}

/**
 * Adds members to a principal (user or role).
 */
export function addMembers(
  principalKey: string,
  members: ReadonlyArray<string>
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.addMembers(principalKey, members)
  );
}

/**
 * Removes members from a principal (group or role).
 */
export function removeMembers(
  principalKey: string,
  members: ReadonlyArray<string>
): IOEither<EnonicError, void> {
  return catchEnonicError<void>(
    () => auth.removeMembers(principalKey, members)
  );
}

/**
 * Deletes the principal with the specifkey.
 */
export function deletePrincipal(principalKey: string): IOEither<EnonicError, boolean> {
  return catchEnonicError<boolean>(
    () => auth.deletePrincipal(principalKey)
  );
}

/**
 * Search for principals matching the specified criteria.
 */
export function findPrincipals(params: FindPrincipalsParams): IOEither<EnonicError, FindPrincipalsResult> {
  return catchEnonicError<FindPrincipalsResult>(
    () => auth.findPrincipals(params)
  );
}

/**
 * Returns the principal with the specified key.
 */
export function getPrincipal(principalKey: string): Option<User> {
  return fromNullable(auth.getPrincipal(principalKey));
}

/**
 * Creates a role.
 */
export function createRole(
  params: CreateRoleParams
): IOEither<EnonicError, Role> {
  return catchEnonicError<Role>(
    () => auth.createRole(params)
  );
}

/**
 * Checks if the logged-in user has the specified role.
 */
export function hasRole(
  role: string
): IOEither<EnonicError, boolean> {
  return catchEnonicError<boolean>(
    () => auth.hasRole(role)
  );
}

/**
 * Retrieves the role specified and updates it with the changes applied through an editor.
 */
export function modifyRole(
  params: ModifyRoleParams
): IOEither<EnonicError, Role> {
  return catchEnonicError<Role>(
    () => auth.modifyRole(params)
  );
}

/**
 * Creates a group.
 */
export function createGroup(
  params: CreateGroupParams
): IOEither<EnonicError, Group> {
  return catchEnonicError<Group>(
    () => auth.createGroup(params)
  );
}

/**
 * Retrieves the group specified and updates it with the changes applied.
 */
export function modifyGroup(
  params: ModifyGroupParams
): IOEither<EnonicError, Group> {
  return catchEnonicError<Group>(
    () => auth.modifyGroup(params)
  );
}

/**
 * Returns a list of principals that are members of the specified principal.
 */
export function getMembers(
  principalKey: string
): IOEither<EnonicError, ReadonlyArray<User>> {
  return catchEnonicError<ReadonlyArray<User>>(
    () => auth.getMembers(principalKey)
  );
}

/**
 * Returns the list of principals which the specified principal is a member of.
 */
export function getMemberships(
  principalKey: string,
  transitive?: boolean
): IOEither<EnonicError, ReadonlyArray<Principal>> {
  return catchEnonicError<ReadonlyArray<Principal>>(
    () => auth.getMemberships(principalKey, transitive)
  );
}
