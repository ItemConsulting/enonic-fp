import { chain, IOEither } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import {PermissionsParams } from "./content";
import {catchEnonicError, fromNullable } from "./utils";

const repo = __non_webpack_require__("/lib/xp/repo");

export interface IndexDefinition {
  readonly settings: any;
  readonly mapping: any;
}

export interface CreateRepoParams {
  readonly id: string;
  readonly rootPermissions?: ReadonlyArray<PermissionsParams>;
  readonly settings?: {
    readonly definitions?: {
      readonly search?: IndexDefinition;
      readonly version?: IndexDefinition;
      readonly branch?: IndexDefinition;
    };
  };
}

export interface CreateBranchParams {
  readonly branchId: string;
  readonly repoId: string;
}

export interface RepositoryConfig {
  readonly id: string;
  readonly branches: ReadonlyArray<string>;
  readonly settings: any;
}

export interface RefreshParams {
  readonly mode?: string;
  readonly repo?: string;
  readonly branch?: string;
}

export interface DeleteBranchParams {
  readonly branchId: string;
  readonly repoId: string;
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

export function list(): IOEither<EnonicError, ReadonlyArray<RepositoryConfig>> {
  return catchEnonicError<ReadonlyArray<RepositoryConfig>>(
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
): IOEither<EnonicError, ReadonlyArray<RepositoryConfig>> {
  return catchEnonicError<ReadonlyArray<RepositoryConfig>>(
    () => repo.refresh(params)
  );
}
