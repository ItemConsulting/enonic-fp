import { chain, IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Error } from "./common";
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
): IOEither<Error, RepositoryConfig> {
  return tryCatch<Error, RepositoryConfig>(
    () => repo.create(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function createBranch(
  params: CreateBranchParams
): IOEither<Error, RepositoryConfig> {
  return tryCatch<Error, RepositoryConfig>(
    () => repo.createBranch(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function get(id: string): IOEither<Error, RepositoryConfig> {
  return pipe(
    tryCatch<Error, RepositoryConfig>(
      () => repo.get(id),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
    ),
    chain(fromNullable<Error>({ errorKey: "NotFoundError" }))
  );
}

export function list(): IOEither<Error, Array<RepositoryConfig>> {
  return tryCatch<Error, Array<RepositoryConfig>>(
    () => repo.list(),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function remove(id: string): IOEither<Error, boolean> {
  return tryCatch<Error, boolean>(
    () => repo.delete(id),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

export function deleteBranch(params: DeleteBranchParams): IOEither<Error, any> {
  // Figure out the shape here for any
  return pipe(
    tryCatch<Error, any>(
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
): IOEither<Error, Array<RepositoryConfig>> {
  return tryCatch<Error, Array<RepositoryConfig>>(
    () => repo.refresh(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}
