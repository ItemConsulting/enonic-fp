import { IOEither, map, tryCatch } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError } from "./common";
import { PermissionsParams } from "./content";
const node = __non_webpack_require__("/lib/xp/node");

export interface Source {
  repoId: string;
  branch: string;
  user?: {
    login: string;
    idProvider?: string;
  };
  principals?: Array<string>;
}

export interface NodeQueryHit {
  id: string;
  score: number;
}

export interface NodeQueryResponse {
  total: number;
  count: number;
  hits: Array<NodeQueryHit>;
}

export interface NodeQueryParams {
  /**
   * Start index (used for paging).
   */
  start?: number;

  /**
   * Number of contents to fetch.
   */
  count?: number;

  /**
   * Query expression.
   */
  query: string;

  /**
   * Query filters
   */
  filters?: any;

  /**
   * Sorting expression.
   */
  sort?: string;

  /**
   * Aggregations expression.
   */
  aggregations?: string;

  /**
   * Return score calculation explanation.
   */
  explain?: boolean;
}

export interface IndexConfigEntry {
  /**
   * If true, indexing is done based on valueType, according to the table above. I.e. numeric values are indexed as
   * both string and numeric.
   */
  decideByType: boolean;

  /**
   * If false, indexing will be disabled for the affected properties
   */
  enabled: boolean;

  /**
   * Values are stored as 'ngram'
   */
  nGram: boolean;

  /**
   * Values are stored as 'ngram', 'analyzed' and also added to the _allText system property
   */
  fulltext: boolean;

  /**
   * Affected values will be added to the _allText property
   */
  includeInAllText: boolean;

  /**
   * Values are stored as 'path' type and applicable for the pathMatch-function
   */
  path: boolean;

  indexValueProcessors: Array<any>;
  languages: Array<any>;
}

export type IndexConfigTemplates =
  | "none"
  | "byType"
  | "fulltext"
  | "path"
  | "minimal";

export interface IndexConfig {
  default: IndexConfigEntry | IndexConfigTemplates;
  configs?: Array<{
    path: string;
    config: IndexConfigEntry | IndexConfigTemplates;
  }>;
}

export interface NodeCreateParams {
  /**
   * Name of content.
   */
  _name?: string;

  /**
   * Path to place content under.
   */
  _parentPath?: string;

  /**
   * How the document should be indexed. A default value "byType" will be set if no value specified.
   */
  _indexConfig?: IndexConfig;

  /**
   * The access control list for the node. By default the creator will have full access
   */
  _permissions?: Array<PermissionsParams>;

  /**
   * true if the permissions should be inherited from the node parent. Default is false.
   */
  _inheritsPermissions?: boolean;

  /**
   * Value used to order document when ordering by parent and child-order is set to manual
   */
  _manualOrderValue?: number;

  /**
   * Default ordering of children when doing getChildren if no order is given in query
   */
  _childOrder?: string;
}

export interface RepoNode {
  _id: string;
  _childOrder: string;
  _indexConfig: IndexConfig;
  _inheritsPermissions: boolean;
  _permissions: Array<PermissionsParams>;
  _state: string;
  _nodeType: string;
}

export interface RepoConnection {
  create<A>(a: A & NodeCreateParams): A & RepoNode;
  delete(keys: Array<string> | string): boolean;
  get<A>(keys: string | Array<string>): Array<A & RepoNode>;
  query<A>(params: NodeQueryParams): NodeQueryResponse;
}

/**
 * Creates a connection to a repository with a given branch and authentication info.
 */
export function connect(params: Source): IOEither<EnonicError, RepoConnection> {
  return tryCatch<EnonicError, RepoConnection>(
    () => node.connect(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

/**
 * This function fetches nodes.
 */
export function get<A>(
  repo: RepoConnection,
  keys: string | Array<string>
): IOEither<EnonicError, Array<A & RepoNode>> {
  return pipe(
    tryCatch<EnonicError, Array<A & RepoNode> | A & RepoNode>(
      () => repo.get(keys),
      e => ({ errorKey: "InternalServerError", cause: String(e) })
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
  return tryCatch<EnonicError, A & RepoNode>(
    () => repo.create(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

/**
 * This function deletes a node or nodes.
 */
export function remove(
  repo: RepoConnection,
  keys: Array<string>
): IOEither<EnonicError, boolean> {
  return tryCatch<EnonicError, boolean>(
    () => repo.delete(keys),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}

/**
 * This command queries nodes.
 */
export function query(
  repo: RepoConnection,
  params: NodeQueryParams
): IOEither<EnonicError, NodeQueryResponse> {
  return tryCatch<EnonicError, NodeQueryResponse>(
    () => repo.query(params),
    e => ({ errorKey: "InternalServerError", cause: String(e) })
  );
}
