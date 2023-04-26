import { chain, IOEither } from "fp-ts/es6/IOEither";
import { catchEnonicError, type EnonicError, notFoundError } from "./errors";
import { pipe } from "fp-ts/es6/function";
import { fromNullable, stringToById } from "./utils";
import type {
  AddProjectPermissionsParams,
  CreateProjectParams,
  DeleteProjectParams,
  GetProjectParams,
  ModifyProjectParams,
  Project,
  ProjectPermissions,
  RemoveProjectPermissionsParams,
} from "/lib/xp/project";
import * as projectLib from "/lib/xp/project";
import { ModifyProjectReadAccessParams, ProjectReadAccess } from "/lib/xp/project";

export function addPermissions(params: AddProjectPermissionsParams): IOEither<EnonicError, ProjectPermissions> {
  return pipe(
    catchEnonicError(() => projectLib.addPermissions(params)),
    chain(fromNullable(notFoundError))
  );
}

export function create<Config extends Record<string, unknown> = Record<string, unknown>>(
  params: CreateProjectParams<Config>
): IOEither<EnonicError, Project<Config>> {
  return catchEnonicError(() => projectLib.create<Config>(params));
}

function remove(params: DeleteProjectParams): IOEither<EnonicError, boolean>;
function remove(id: string): IOEither<EnonicError, boolean>;
function remove(paramsOrId: DeleteProjectParams | string): IOEither<EnonicError, boolean> {
  return pipe(stringToById(paramsOrId), (params: GetProjectParams) =>
    catchEnonicError(() => projectLib.delete(params))
  );
}

export { remove as delete };

export function get(params: GetProjectParams): IOEither<EnonicError, Project>;
export function get(id: string): IOEither<EnonicError, Project>;
export function get(paramsOrId: GetProjectParams | string): IOEither<EnonicError, Project> {
  return pipe(
    stringToById(paramsOrId),
    (params: GetProjectParams) => catchEnonicError(() => projectLib.get(params)),
    chain(fromNullable(notFoundError))
  );
}

export function list(): IOEither<EnonicError, ReadonlyArray<Project>> {
  return catchEnonicError(() => projectLib.list());
}

export function modify<Config extends Record<string, unknown> = Record<string, unknown>>(
  params: ModifyProjectParams<Config>
): IOEither<EnonicError, Project<Config>> {
  return catchEnonicError(() => projectLib.modify<Config>(params));
}

export function modifyReadAccess(params: ModifyProjectReadAccessParams): IOEither<EnonicError, ProjectReadAccess> {
  return pipe(
    catchEnonicError(() => projectLib.modifyReadAccess(params)),
    chain(fromNullable(notFoundError))
  );
}

export function removePermissions(params: RemoveProjectPermissionsParams): IOEither<EnonicError, ProjectPermissions> {
  return pipe(
    catchEnonicError(() => projectLib.removePermissions(params)),
    chain(fromNullable(notFoundError))
  );
}
