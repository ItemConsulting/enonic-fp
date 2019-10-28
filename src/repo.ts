import { chain, IOEither } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import {PermissionsParams } from "./content";
import {catchEnonicError, fromNullable } from "./utils";

const repo = __non_webpack_require__("/lib/xp/repo");

export interface IndexDefinition {
  settings: any;
  mapping: any;
}

export interface CreateRepoParams {
  id: string;
  rootPermissions?: Array<PermissionsParams>;
  settings?: {
    definitions?: {
      search?: IndexDefinition;
      version?: IndexDefinition;
      branch?: IndexDefinition;
    };
  };
}

export interface CreateBranchParams {
  branchId: string;
  repoId: string;
}

export interface RepositoryConfig {
  id: string;
  branches: Array<string>;
  settings: any;
}

export interface RefreshParams {
  mode?: string;
  repo?: string;
  branch?: string;
}

export interface DeleteBranchParams {
  branchId: string;
  repoId: string;
}

export function create(
  params: CreateRepoParams
): IOEither<EnonicError, RepositoryConfig> {
  return catchEnonicError<RepositoryConfig>(
    () => repo.create(params)
  );
}

export function createBranch(
  params: CreateBranchParams
): IOEither<EnonicError, RepositoryConfig> {
  return catchEnonicError<RepositoryConfig>(
    () => repo.createBranch(params)
  );
}

export function get(id: string): IOEither<EnonicError, RepositoryConfig> {
  return pipe(
    catchEnonicError<RepositoryConfig>(
      () => repo.get(id)
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function list(): IOEither<EnonicError, Array<RepositoryConfig>> {
  return catchEnonicError<Array<RepositoryConfig>>(
    () => repo.list()
  );
}

export function remove(id: string): IOEither<EnonicError, boolean> {
  return catchEnonicError<boolean>(
    () => repo.delete(id)
  );
}

export function deleteBranch(
  params: DeleteBranchParams
): IOEither<EnonicError, any> {
  // TODO Figure out the shape here for "any"
   return catchEnonicError<any>(
    () => repo.deleteBranch(params)
  );
}

export function refresh(
  params: RefreshParams
): IOEither<EnonicError, Array<RepositoryConfig>> {
  return catchEnonicError<Array<RepositoryConfig>>(
    () => repo.refresh(params)
  );
}
