import * as turboStreamsLib from "/lib/turbo-streams";
import type { TurboStreamAction, TurboStreamsParams, TurboStreamsRemoveParams } from "/lib/turbo-streams";
import { catchEnonicError, type EnonicError } from "./errors";
import type { IOEither } from "fp-ts/es6/IOEither";
import type { GetWebSocketUrlParams } from "/lib/turbo-streams/websockets";
import type { Request } from "@item-enonic-types/global/controller";

/**
 * Replace the library with a mocked version

/**
 * Append some markup to a target id in the dom
 */
export function append(params: TurboStreamsParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => turboStreamsLib.append(params));
}

/**
 * Prepend some markup to a target id in the dom
 */
export function prepend(params: TurboStreamsParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => turboStreamsLib.prepend(params));
}

/**
 * Replace some markup at a target id in the dom
 */
export function replace(params: TurboStreamsParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => turboStreamsLib.replace(params));
}

/**
 * Remove an element with a target id from the dom
 */
export function remove(params: TurboStreamsRemoveParams): IOEither<EnonicError, void> {
  return catchEnonicError(() => turboStreamsLib.remove(params));
}

/**
 * Returns a url to a service, but using the web socket protocols
 */
export function getWebSocketUrl(params?: GetWebSocketUrlParams): string {
  return turboStreamsLib.getWebSocketUrl(params);
}

/**
 * Returns a websocket group name specific for the user, based on the user session number
 */
export function getUsersPersonalGroupName(): IOEither<EnonicError, string> {
  return catchEnonicError(() => turboStreamsLib.getUsersPersonalGroupName());
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
  return turboStreamsLib.serialize(actions);
}

/**
 * Checks the request header if the response can be of mime type "text/vnd.turbo-stream.html"
 */
export function acceptTurboStreams(req: Request): boolean {
  return turboStreamsLib.acceptTurboStreams(req);
}

/**
 * Get mime type to use when returning Turbo Streams over HTTP
 */
export function getTurboStreamsMimetype(): string {
  return turboStreamsLib.MIME_TYPE_TURBO_STREAMS;
}

/**
 * Get the default group id
 */
export function getDefaultGroupId(): string {
  return turboStreamsLib.DEFAULT_GROUP_ID;
}
