import { chain, IOEither } from "fp-ts/es6/IOEither";
import { pipe } from "fp-ts/es6/function";
import { catchEnonicError, type EnonicError, notFoundError } from "./errors";
import { fromNullable } from "./utils";
import * as repoLib from "/lib/xp/repo";
import type {
  CreateBranchParams,
  DeleteBranchParams,
  RefreshParams,
  BranchResult,
  CreateRepositoryParams,
  Repository,
} from "/lib/xp/repo";

export function create(params: CreateRepositoryParams): IOEither<EnonicError, Repository> {
  return catchEnonicError(() => repoLib.create(params));
}

export function createBranch(params: CreateBranchParams): IOEither<EnonicError, BranchResult> {
  return catchEnonicError(() => repoLib.createBranch(params));
}

export function get(id: string): IOEither<EnonicError, Repository | null> {
  return pipe(
    catchEnonicError(() => repoLib.get(id)),
    chain(fromNullable(notFoundError))
  );
}

export function list(): IOEither<EnonicError, ReadonlyArray<Repository>> {
  return catchEnonicError(() => repoLib.list());
}

export function remove(id: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => repoLib.delete(id));
}

export function deleteBranch(params: DeleteBranchParams): IOEither<EnonicError, any> {
  return catchEnonicError(() => repoLib.deleteBranch(params));
}

export function refresh(params: RefreshParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => repoLib.refresh(params));
}
