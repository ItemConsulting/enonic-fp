import type {
  GetWebSocketUrlParams,
  TurboStreamAction,
  TurboStreamsLibrary,
  TurboStreamsParams,
  TurboStreamsRemoveParams,
} from "/lib/turbo-streams";
import { IOEither } from "fp-ts/es6/IOEither";
import { catchEnonicError, type EnonicError } from "./errors";

let lib: TurboStreamsLibrary;

export function getLibrary(): TurboStreamsLibrary {
  return lib ?? import("/lib/turbo-streams");
}

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: TurboStreamsLibrary): void {
  lib = library;
}

/**
 * Append some markup to a target id in the dom
 */
export function append(params: TurboStreamsParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => getLibrary().append(params));
}

/**
 * Prepend some markup to a target id in the dom
 */
export function prepend(params: TurboStreamsParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => getLibrary().prepend(params));
}

/**
 * Replace some markup at a target id in the dom
 */
export function replace(params: TurboStreamsParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => getLibrary().replace(params));
}

/**
 * Remove an element with a target id from the dom
 */
export function remove(params: TurboStreamsRemoveParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => getLibrary().remove(params));
}

/**
 * Returns a url to a service, but using the web socket protocols
 */
export function getWebSocketUrl(params?: GetWebSocketUrlParams): string {
  return getLibrary().getWebSocketUrl(params);
}

/**
 * Returns a websocket group name specific for the user, based on the user session number
 */
export function getUsersPersonalGroupName(): IOEither<EnonicError, string> {
  return catchEnonicError(() => getLibrary().getUsersPersonalGroupName());
}

/**
 * Guard that verifies that an object is of type TurboStreamAction
 */
export function isTurboStreamAction(v: unknown): v is TurboStreamAction {
  // Copy of implementation, so that it can be used without importing library
  const value = v as TurboStreamAction;
  return (
    v !== undefined &&
    v !== null &&
    ["append", "prepend", "replace", "update", "remove"].indexOf(value.action) !== -1 &&
    typeof value.target === "string"
  );
}

/**
 * Serializes actions to frames that can be sent over the wire
 */
export function serialize(action: TurboStreamAction): string;
export function serialize(actions: Array<TurboStreamAction>): string;
export function serialize(actions: TurboStreamAction | Array<TurboStreamAction>): string;
export function serialize(actions: TurboStreamAction | Array<TurboStreamAction>): string {
  return getLibrary().serialize(actions);
}

/**
 * Checks the request header if the response can be of mime type "text/vnd.turbo-stream.html"
 */
export function acceptTurboStreams(req: XP.Request): boolean {
  return getLibrary().acceptTurboStreams(req);
}

/**
 * Get mime type to use when returning Turbo Streams over HTTP
 */
export function getTurboStreamsMimetype(): string {
  return getLibrary().MIME_TYPE_TURBO_STREAMS;
}

/**
 * Get the default group id
 */
export function getDefaultGroupId(): string {
  return getLibrary().DEFAULT_GROUP_ID;
}
