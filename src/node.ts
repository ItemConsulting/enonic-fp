import { chain, IOEither } from "fp-ts/es6/IOEither";
import { catchEnonicError, type EnonicError, notFoundError } from "./errors";
import * as nodeLib from "/lib/xp/node";
import type {
  FindVersionsParams,
  MultiRepoConnection,
  MultiRepoConnectParams,
  RepoConnection,
  ConnectParams,
  CreateNodeParams,
  DiffBranchesParams,
  DiffBranchesResult,
  FindChildrenParams,
  FindNodesByParentResult,
  GetNodeParams,
  ModifyNodeParams,
  Node,
  NodeQueryResult,
  NodeVersionsQueryResult,
  QueryNodeParams,
} from "/lib/xp/node";
import { forceArray } from "./array";
import { pipe } from "fp-ts/es6/function";
import { fromNullable } from "./utils";
import { Aggregations, AggregationsToAggregationResults } from "@enonic-types/core";

/**
 * Creates a connection to a repository with a given branch and authentication info.
 */
export function connect(params: ConnectParams): IOEither<EnonicError, RepoConnection> {
  return catchEnonicError(() => nodeLib.connect(params));
}

/**
 * Creates a connection to several repositories with a given branch and authentication info.
 */
export function multiRepoConnect(params: MultiRepoConnectParams): IOEither<EnonicError, MultiRepoConnection> {
  return catchEnonicError(() => nodeLib.multiRepoConnect(params));
}

/**
 * Creating a node. To create a content where the name is not important and there could be multiple instances under the
 * same parent content, skip the name parameter and specify a displayName.
 */
export function create<NodeData = Record<string, unknown>>(
  repo: RepoConnection,
  params: CreateNodeParams<NodeData>
): IOEither<EnonicError, Node<NodeData>> {
  return catchEnonicError(() => repo.create<NodeData>(params));
}

/**
 * Deleting a node or nodes.
 */
export function remove(repo: RepoConnection, keys: string | string[]): IOEither<EnonicError, string[]> {
  return catchEnonicError(() => repo.delete(keys));
}

/**
 * Resolves the differences for a node between current and given branch.
 */
export function diff(repo: RepoConnection, params: DiffBranchesParams): IOEither<EnonicError, DiffBranchesResult> {
  return catchEnonicError(() => repo.diff(params));
}

/**
 * Checking if a node or nodes exist for the current context.
 */
export function exists(repo: RepoConnection, keys: string): IOEither<EnonicError, boolean> {
  return catchEnonicError(() => repo.exists(keys));
}

/**
 * Fetch the versions of a node.
 */
export function findVersions(
  repo: RepoConnection,
  params: FindVersionsParams
): IOEither<EnonicError, NodeVersionsQueryResult> {
  return catchEnonicError(() => repo.findVersions(params));
}

/**
 * Fetches specific nodes by path or ID.
 */
export function get<NodeData = Record<string, unknown>>(
  repo: RepoConnection,
  key: string | GetNodeParams
): IOEither<EnonicError, Node<NodeData>>;
export function get<NodeData = Record<string, unknown>>(
  repo: RepoConnection,
  keys: (string | GetNodeParams)[]
): IOEither<EnonicError, Node<NodeData>[]>;
export function get<NodeData = Record<string, unknown>>(
  repo: RepoConnection,
  keys: string | GetNodeParams | (string | GetNodeParams)[]
): IOEither<EnonicError, Node<NodeData> | Node<NodeData>[]> {
  return pipe(
    catchEnonicError(() => (Array.isArray(keys) ? forceArray(repo.get<NodeData>(keys)) : repo.get<NodeData>(keys))),
    chain(fromNullable(notFoundError))
  );
}

/**
 * This command queries nodes.
 */
export function query<AggregationInput extends Aggregations = never>(
  repo: RepoConnection,
  params: QueryNodeParams<AggregationInput>
): IOEither<EnonicError, NodeQueryResult<AggregationsToAggregationResults<AggregationInput>>> {
  return catchEnonicError(() => repo.query<AggregationInput>(params));
}

/**
 * This function modifies a node.
 */
export function modify<NodeData = Record<string, unknown>>(
  repo: RepoConnection,
  params: ModifyNodeParams<NodeData>
): IOEither<EnonicError, Node<NodeData>> {
  return catchEnonicError(() => repo.modify(params));
}

/**
 * Get children for given node.
 */
export function findChildren(
  repo: RepoConnection,
  params: FindChildrenParams
): IOEither<EnonicError, FindNodesByParentResult> {
  return catchEnonicError(() => repo.findChildren(params));
}
