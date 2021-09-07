import { chain, IOEither } from "fp-ts/IOEither";
import { pipe } from "fp-ts/function";
import { catchEnonicError, EnonicError, notFoundError } from "./errors";
import { fromNullable } from "./utils";
import {
  BranchConfig,
  CreateBranchParams,
  CreateRepoParams,
  DeleteBranchParams,
  RefreshParams,
  RepoLibrary,
  RepositoryConfig,
} from "enonic-types/repo";

let repoLib = __non_webpack_require__("/lib/xp/repo");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: RepoLibrary): void {
  repoLib = library;
}

export function create(params: CreateRepoParams): IOEither<EnonicError, RepositoryConfig> {
  return catchEnonicError(() => repoLib.create(params));
}

export function createBranch(params: CreateBranchParams): IOEither<EnonicError, BranchConfig> {
  return catchEnonicError(() => repoLib.createBranch(params));
}

export function get<Data>(id: string): IOEither<EnonicError, RepositoryConfig<Data> | null> {
  return pipe(
    catchEnonicError(() => repoLib.get<Data>(id)),
    chain(fromNullable(notFoundError))
  );
}

export function list(): IOEither<EnonicError, ReadonlyArray<RepositoryConfig>> {
  return catchEnonicError(() => repoLib.list());
}

export function remove(id: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => repoLib.delete(id));
}

export function deleteBranch(params: DeleteBranchParams): IOEither<EnonicError, any> {
  return catchEnonicError(() => repoLib.deleteBranch(params));
}

export function refresh(params: RefreshParams): IOEither<EnonicError, ReadonlyArray<unknown>> {
  return catchEnonicError(() => repoLib.refresh(params));
}
