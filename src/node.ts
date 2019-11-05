import { IOEither, map } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./errors";
import { catchEnonicError } from "./utils";
import {
  NodeCreateParams,
  NodeLibrary,
  NodeQueryParams,
  NodeQueryResponse, RepoConnection,
  RepoNode,
  Source
} from "enonic-types/lib/node";

const nodeLib: NodeLibrary = __non_webpack_require__("/lib/xp/node");

/**
 * Creates a connection to a repository with a given branch and authentication info.
 */
export function connect(params: Source): IOEither<EnonicError, RepoConnection> {
  return catchEnonicError<RepoConnection>(
    () => nodeLib.connect(params)
  );
}

/**
 * This function fetches nodes.
 */
export function get<A>(
  repo: RepoConnection,
  keys: string | ReadonlyArray<string>
): IOEither<EnonicError, ReadonlyArray<A & RepoNode>> {
  return pipe(
    catchEnonicError<ReadonlyArray<A & RepoNode> | A & RepoNode>(
      () => repo.get(keys)
    ),
    map(data => (Array.isArray(data) ? data : [data]))
  );
}

/**
 * This function creates a node.
 */
export function create<A>(
  repo: RepoConnection,
  params: A & NodeCreateParams
): IOEither<EnonicError, A & RepoNode> {
  return catchEnonicError<A & RepoNode>(
    () => repo.create(params)
  );
}

/**
 * This function deletes a node or nodes.
 */
export function remove(
  repo: RepoConnection,
  keys: ReadonlyArray<string>
): IOEither<EnonicError, boolean> {
  return catchEnonicError<boolean>(
    () => repo.delete(keys)
  );
}

/**
 * This command queries nodes.
 */
export function query(
  repo: RepoConnection,
  params: NodeQueryParams
): IOEither<EnonicError, NodeQueryResponse> {
  return catchEnonicError<NodeQueryResponse>(
    () => repo.query(params)
  );
}
