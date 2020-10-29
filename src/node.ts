import {IOEither} from "fp-ts/IOEither";
import {
  DiffParams,
  DiffResponse,
  FindVersionsParams,
  MultiRepoConnection,
  MultiRepoConnectParams,
  NodeCreateParams,
  NodeFindChildrenParams,
  NodeGetParams,
  NodeLibrary,
  NodeModifyParams,
  NodeQueryParams,
  NodeQueryResponse,
  NodeVersionQueryResult,
  RepoConnection,
  RepoNode,
  Source
} from "enonic-types/node";
import {catchEnonicError, EnonicError} from "./errors";

let nodeLib = __non_webpack_require__("/lib/xp/node");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: NodeLibrary): void {
  nodeLib = library;
}

/**
 * Creates a connection to a repository with a given branch and authentication info.
 */
export function connect(params: Source): IOEither<EnonicError, RepoConnection> {
  return catchEnonicError(
    () => nodeLib.connect(params)
  );
}

/**
 * Creates a connection to several repositories with a given branch and authentication info.
 */
export function multiRepoConnect(params: MultiRepoConnectParams): IOEither<EnonicError, MultiRepoConnection> {
  return catchEnonicError(
    () => nodeLib.multiRepoConnect(params)
  );
}

/**
 * Creating a node. To create a content where the name is not important and there could be multiple instances under the
 * same parent content, skip the name parameter and specify a displayName.
 */
export function create<A>(
  repo: RepoConnection,
  params: A & NodeCreateParams
): IOEither<EnonicError, A & RepoNode> {
  return catchEnonicError(
    () => repo.create<A>(params)
  );
}

/**
 * Deleting a node or nodes.
 */
export function remove(
  repo: RepoConnection,
  keys: string | ReadonlyArray<string>
): IOEither<EnonicError, ReadonlyArray<string>> {
  return catchEnonicError(
    () => repo.delete(keys)
  );
}


/**
 * Resolves the differences for a node between current and given branch.
 */
export function diff(
  repo: RepoConnection,
  params: DiffParams
): IOEither<EnonicError, DiffResponse> {
  return catchEnonicError(
    () => repo.diff(params)
  );
}

/**
 * Checking if a node or nodes exist for the current context.
 */
export function exists(
  repo: RepoConnection,
  keys: string | ReadonlyArray<string>
): IOEither<EnonicError, ReadonlyArray<string>> {
  return catchEnonicError(
    () => repo.exists(keys)
  );
}

/**
 * Fetch the versions of a node.
 */
export function findVersions(
  repo: RepoConnection,
  params: FindVersionsParams
): IOEither<EnonicError, NodeVersionQueryResult> {
  return catchEnonicError(
    () => repo.findVersions(params)
  );
}

/**
 * Fetches specific nodes by path or ID.
 */
export function get<A>(repo: RepoConnection, key: string | NodeGetParams): IOEither<EnonicError, A & RepoNode>;
export function get<A>(
  repo: RepoConnection,
  keys: ReadonlyArray<string | NodeGetParams>
): IOEither<EnonicError, ReadonlyArray<A & RepoNode>>;

export function get<A>(
  repo: RepoConnection,
  keys: string | NodeGetParams | ReadonlyArray<string | NodeGetParams>
): IOEither<EnonicError, A & RepoNode | ReadonlyArray<A & RepoNode>> {
  return catchEnonicError(
    () => repo.get<A>(keys)
  );
}

/**
 * This command queries nodes.
 */
export function query<B extends string>(
  repo: RepoConnection,
  params: NodeQueryParams<B>
): IOEither<EnonicError, NodeQueryResponse<B>> {
  return catchEnonicError(
    () => repo.query<B>(params)
  );
}

/**
 * This function modifies a node.
 */
export function modify<A>(
  repo: RepoConnection,
  params: NodeModifyParams<A>
): IOEither<EnonicError, A & RepoNode> {
  return catchEnonicError(
    () => repo.modify(params)
  );
}

/**
 * Get children for given node.
 */
export function findChildren(
  repo: RepoConnection,
  params: NodeFindChildrenParams
): IOEither<EnonicError, NodeQueryResponse<never>> {
  return catchEnonicError(
    () => repo.findChildren(params)
  );
}
