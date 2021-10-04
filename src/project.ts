import { chain, IOEither } from "fp-ts/IOEither";
import { catchEnonicError, EnonicError, notFoundError } from "./errors";
import { pipe } from "fp-ts/function";
import { fromNullable, stringToById } from "./utils";
import type {
  AddPermissionsParams,
  CreateProjectParams,
  DeleteProjectParams,
  GetProjectParams,
  ModifyProjectParams,
  ModifyReadAccessParams,
  ModifyReadAccessResult,
  Project,
  RemovePermissionsParams,
} from "/lib/xp/project";
import * as projectLib from "/lib/xp/project";

export function addPermissions(params: AddPermissionsParams): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => projectLib.addPermissions(params));
}

export function create(params: CreateProjectParams): IOEither<EnonicError, Project> {
  return catchEnonicError(() => projectLib.create(params));
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

export function modify(params: ModifyProjectParams): IOEither<EnonicError, Project> {
  return catchEnonicError(() => projectLib.modify(params));
}

export function modifyReadAccess(params: ModifyReadAccessParams): IOEither<EnonicError, ModifyReadAccessResult> {
  return catchEnonicError(() => projectLib.modifyReadAccess(params));
}

export function removePermissions(params: RemovePermissionsParams): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => projectLib.removePermissions(params));
}
