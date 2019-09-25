import { chain, IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { PermissionsParams } from "./content";
import { fromNullable } from "./utils";

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
  return tryCatch<EnonicError, RepositoryConfig>(
    () => repo.create(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function createBranch(
  params: CreateBranchParams
): IOEither<EnonicError, RepositoryConfig> {
  return tryCatch<EnonicError, RepositoryConfig>(
    () => repo.createBranch(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function get(id: string): IOEither<EnonicError, RepositoryConfig> {
  return pipe(
    tryCatch<EnonicError, RepositoryConfig>(
      () => repo.get(id),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<EnonicError>({ errorKey: "NotFoundError" }))
  );
}

export function list(): IOEither<EnonicError, Array<RepositoryConfig>> {
  return tryCatch<EnonicError, Array<RepositoryConfig>>(
    () => repo.list(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function remove(id: string): IOEither<EnonicError, boolean> {
  return tryCatch<EnonicError, boolean>(
    () => repo.delete(id),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function deleteBranch(
  params: DeleteBranchParams
): IOEither<EnonicError, any> {
  // Figure out the shape here for any
  return pipe(
    tryCatch<EnonicError, any>(
      () => repo.deleteBranch(params),
      (e: any) => {
        return {
          cause: String(e),
          errorKey:
            e.code === "branchNotFound"
              ? "NotFoundError"
              : "InternalServerError"
        };
      }
    )
  );
}

export function refresh(
  params: RefreshParams
): IOEither<EnonicError, Array<RepositoryConfig>> {
  return tryCatch<EnonicError, Array<RepositoryConfig>>(
    () => repo.refresh(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}
