import {chain, IOEither} from "fp-ts/lib/IOEither";
import {pipe} from "fp-ts/lib/pipeable";
import {EnonicError} from "./errors";
import {catchEnonicError, fromNullable} from "./utils";
import {
  CreateBranchParams,
  CreateRepoParams,
  DeleteBranchParams,
  RefreshParams,
  RepositoryConfig
} from "enonic-types/lib/repo";

const repoLib = __non_webpack_require__("/lib/xp/repo");

export function create(
  params: CreateRepoParams
): IOEither<EnonicError, RepositoryConfig> {
  return catchEnonicError(
    () => repoLib.create(params)
  );
}

export function createBranch(
  params: CreateBranchParams
): IOEither<EnonicError, RepositoryConfig> {
  return catchEnonicError(
    () => repoLib.createBranch(params)
  );
}

export function get(id: string): IOEither<EnonicError, RepositoryConfig> {
  return pipe(
    catchEnonicError(
      () => repoLib.get(id)
    ),
    chain(fromNullable<EnonicError>({errorKey: "NotFoundError"}))
  );
}

export function list(): IOEither<EnonicError, ReadonlyArray<RepositoryConfig>> {
  return catchEnonicError(
    () => repoLib.list()
  );
}

export function remove(id: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(
    () => repoLib.delete(id)
  );
}

export function deleteBranch(
  params: DeleteBranchParams
): IOEither<EnonicError, any> {
  return catchEnonicError(
    () => repoLib.deleteBranch(params)
  );
}

export function refresh(
  params: RefreshParams
): IOEither<EnonicError, ReadonlyArray<RepositoryConfig>> {
  return catchEnonicError(
    () => repoLib.refresh(params)
  );
}
